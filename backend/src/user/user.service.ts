import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(id: number): Promise<User | undefined>{
    return await this.userRepository.findOne({ where: { id }});
  }

  async updateUser(id: number,dto: UpdateUserDto) {
    const currUser = await this.userRepository.findOne({ where: { id }});
    console.log(currUser);
    this.userRepository.merge(currUser, dto);
    console.log(currUser);
    const updatedUser = await this.userRepository.save(currUser);
    return updatedUser;
  }

  createUser(dtoUserCreator: CreateUserDto): Promise<User> {
    console.log(dtoUserCreator);
    const newUser:CreateUserDto = {...dtoUserCreator,level:1.00,matches: 0, wins: 0};
    return this.userRepository.save(newUser);
  }


  async deleteUser(id: number){
    const DeletedUser = await this.userRepository.findOne({where: {id}})
    await this.userRepository.remove(DeletedUser);

    return DeletedUser;
  }

  async createDummyUsers() {
    const colors: string[] = ['#E7C9FF','#C9FFE5','#C9CBFF','#FFC9C9','#FFFDC9','#C9FFFC'];
    try{

      for(let i: number = 0 ; i < 100 ;i++){
        let user = new CreateUserDto;
        user.name = 'DummyUser_' + Math.floor(100000 + Math.random() * 900000).toString();
        user.color = colors[Math.floor(100000 + Math.random() * 900000) % 6];
        user.level = Number(((100000 + Math.random() * 10000) % 100).toFixed(2)); 
        user.matches = Math.floor(100000 + Math.random() * 900000) % 500;
        user.wins = Math.floor(user.matches * Math.random());
        await this.userRepository.save(user);
      }
    } catch(error){
      console.log(error);
    }
  }

  async deleteUserDatabase(){
    await this.userRepository.clear();
  }
}
