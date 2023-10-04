import { ParseIntPipe,Body, Controller, Get, Post, Query,Param,NotFoundException,Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
