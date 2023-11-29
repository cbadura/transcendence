import {
  ParseIntPipe,
  Body,
  Controller,
  Get,
  Res,
  Post,
  Query,
  Param,
  NotFoundException,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  UseGuards,
  HttpException, HttpStatus
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express'
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Express, Request, Response } from 'express'
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';
import { jwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { DebugRoute } from 'src/auth/guard/debugRoute.guard';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,) {}

  @UseGuards(jwtAuthGuard)
  @Get()
  GetUsers(){
    return this.userService.getUsers();
  }

  //todo: prevent uploading files if user doesnt exist 
  @UseGuards(jwtAuthGuard)
  @Post('profilepic')
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination: './uploadedData/profilepictures',
      filename: (req,file,callback) => {
          const userId = req.user['id']; 
          const extension = extname(file.originalname)
          const allowedExtensions: string[] = [".jpeg", ".jpg", ".png",".PNG",".JPEG",".JPG"]
          if(allowedExtensions.find((elem)=> elem == extension)){
            const filename =`profilepic_user_${userId}_${new Date().getTime()}${extension}`;
            callback(null,filename);
          }
      }
    }),
    limits: { fileSize: 10000000}
  }))
  uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    ) {
      console.log("here")
    // const baseUrl = request.protocol + '://' + request.get('host');
    // dirty fix by cosmo :(, prepended `http://localhost:3000` to the imageURL 
    const userProfileImageURL = `https://${process.env.HOST_NAME}:3000/users/profilepic/${file.filename}`

    let updateDTO = new UpdateUserDto();
    console.log('successfully uploaded file to: ',userProfileImageURL);
    updateDTO.avatar = userProfileImageURL;
    try {
       this.userService.updateUser(req.user['id'],updateDTO);
    } catch (error) {
        throw new NotFoundException()
    }
      return {img: userProfileImageURL};
  }

  @UseGuards(jwtAuthGuard)
  @Delete('profilepic')
  resetProfilePic(@Req() req: Request) {
    const newImage = this.userService.resetProfilePic(req.user['id']);
    return {img: newImage};
  }

  // this makes sense, but blocks the other
  @UseGuards(jwtAuthGuard)
  @Get('profilepic/:filename')
  ServeUploadedFile(@Param('filename')filename:string, @Res() res: Response){
      const filePath = path.join(__dirname, '../../', 'uploadedData/profilepictures/', filename);
      // console.log(filePath);
      res.sendFile(filePath)
  }

  @UseGuards(jwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return await this.userService.getUser(req.user['id']);
  }

  @UseGuards(jwtAuthGuard)
  @Get(':id')
  getUser(@Param('id',ParseIntPipe) id: number) {
      try {
          return this.userService.getUser(id);
      } catch (error) {
          throw new NotFoundException()
      }
  };

  @UseGuards(jwtAuthGuard)
  @Put()
  async updateUser(@Req() req: Request,@Body() dto: UpdateUserDto) {
       try {
          return await this.userService.updateUser(req.user['id'] ,dto);
       } catch (error) {
        if (error.code === '23505')
          throw new BadRequestException('Username is taken, please choose another username and try again');
        throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
       }
  };

  @UseGuards(jwtAuthGuard)
  @Delete()
  deleteUser(@Req() req: Request){
    return this.userService.deleteUser(req.user['id']);
  }

  @UseGuards(jwtAuthGuard)
  @Get(':id/matches')
  getUserMatches(@Param('id',ParseIntPipe) id: number){
    return this.userService.getUserMatches(id);
  }

  @UseGuards(jwtAuthGuard)
  @Get(':id/relationship') // no need to remove id, user can view others friend list in their profile
  getUserRelationships(@Param('id',ParseIntPipe) id: number,
  @Query('filter') filter?: string,
  ){
      if (filter && filter !== 'friend' && filter !== 'blocked') 
        throw new BadRequestException('filterField must be either "friend" or "blocked"');
    return this.userService.getUserRelationships(id,filter);
  }

  @UseGuards(jwtAuthGuard)
  @Get(':id/friends')
  async getUserFriendList(@Param('id', ParseIntPipe) id: number): Promise<User[]> {
    return await this.userService.getUserFriendList(id);
  }

}
