import { ParseIntPipe,Body, Controller, Get,Res, Post, Query,Param,NotFoundException,Put, Delete, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express'
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Express } from 'express'
import { diskStorage } from 'multer';
import { extname } from 'path';
import {Response} from 'express'
import * as path from 'path';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  GetUsers(){
    return this.userService.getUsers();
  }

  @Get('dummy')
  createDummyUsers(){
    this.userService.createDummyUsers();
  }

  @Delete('dummy')
  deleteUserDatabase(){
    this.userService.deleteUserDatabase();
  }

  //todo: prevent uploading files if user doesnt exist 
  @Post(':id/profilepic')
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination: './uploadedData/profilepictures',
      filename: (req,file,callback) => {
          const userId = req.params.id;
          // const uniqueSuffix = Date.now() 
          // console.log(req);
          const extension = extname(file.originalname)
          const filename =`profilepic_user_${userId}${extension}`;
          callback(null,filename);
      }
    })
  }))
  uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Param('id',ParseIntPipe) id: number,
    @Req() request: Request,
    ) {

    // const baseUrl = request.protocol + '://' + request.get('host');
    const userProfileImageURL = `/users/profilepic/${file.filename}`

    let updateDTO = new UpdateUserDto();
    console.log('successfully uploaded file to: ',userProfileImageURL);
    updateDTO.avatar = userProfileImageURL;
    try {
       this.userService.updateUser(id,updateDTO);
    } catch (error) {
        throw new NotFoundException()
    }
      return userProfileImageURL;
  }

  // this makes sense, but blocks the other
  @Get('profilepic/:filename')
  ServeUploadedFile(@Param('filename')filename:string, @Res() res: Response){
      const filePath = path.join(__dirname, '../../', 'uploadedData/profilepictures/', filename);
      res.sendFile(filePath)
  }


  // GET /user/:id --> {...} get a single ninja
  @Get(':id')
  getUser(@Param('id',ParseIntPipe) id: number) {
      try {
          return this.userService.getUser(id);
      } catch (error) {
          throw new NotFoundException()
      }
  };

  @Put(':id')
  updateUser(@Param('id',ParseIntPipe ) id: number,@Body() dto: UpdateUserDto) {
      try {
          return this.userService.updateUser(id,dto);
      } catch (error) {
          throw new NotFoundException()
      }
  };

  @Delete(':id')
  deleteUser(@Param('id',ParseIntPipe) id: number){
    return this.userService.deleteUser(id);
  }

  @Post()
  createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }

}
