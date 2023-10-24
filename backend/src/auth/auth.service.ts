import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib'
import { toDataURL } from 'qrcode'
import { secretBoxDto } from './dto/secretBox.dto';
import { SecretBox } from 'src/entities/secretBox.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(SecretBox) private boxRepo: Repository<SecretBox>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  private generateToken(user: User, verified: boolean) {
    const payload = {
      verified: verified,
      id: user.id,
      ftid: user.ftid
    };
    return {
      verified: verified,
      access_token: this.jwtService.sign(payload)
    }
  }

  private dataToImage(qr: string) {
    if (!qr)
      throw new InternalServerErrorException();
    const data = qr.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(data, 'base64');
  }

  private async secretToImage(user: User, secret: string) {
    const otpurl = authenticator.keyuri(user.name, 'pong', secret);
    const qr = await toDataURL(otpurl);
    return this.dataToImage(qr);
  }

  private createBox(user: User) {
    const newBox: secretBoxDto = {
      id: user.id,
      ftid: user.ftid,
      tempSecret: authenticator.generateSecret()
    }
    return this.boxRepo.save(newBox);
  }
  
  private async deleteBox(id: number) {
    const deletedBox = await this.boxRepo.findOne({where: {id}});
    await this.boxRepo.remove(deletedBox);
    return deletedBox;
  }

  async ftValidateUser(ftid: number, username: string, avatar: string) {
    // const user: User = await this.userRepo.findOne({where: {ftid: id}});
    const user: User = await this.userService.getUserFromftid(ftid);
    if (user) return user;
    const newUser = new CreateUserDto;
    newUser.name = username;
    newUser.ftid = ftid;
    newUser.avatar = avatar;
    return this.userService.createUser(newUser);
  }

  async jwtIssueToken(user: any) {
    if (user.tfa === true)
      return this.generateToken(user, false);
    if (user.tfa === false)
      return this.generateToken(user, true);
  }

  async getTempSecret(ruser: any) {
    const user: User = await this.userService.getUser(ruser.id);
    const box = await this.boxRepo.findOne({where: {id: user.id}});
    if (box) {
      box.tempSecret = authenticator.generateSecret();
      this.boxRepo.save(box);
      console.log(box.tempSecret);
      return this.secretToImage(user, box.tempSecret);
    }
    const newBox = await this.createBox(user);
    console.log(newBox.tempSecret);
    return this.secretToImage(user, newBox.tempSecret);
  }


  async test() {
    const secret = authenticator.generateSecret();
    console.log(authenticator.check('546750', 'HN7EYWI5HQVEMFCW'));
    // return this.secretToImage(qrcode);
  }
  
  findUser(ftid: number): Promise<User | undefined> {
    return this.userRepo.findOne({where: {ftid} });
  }


  /* -------------dev-------------- */
  getBoxes() {
    return this.boxRepo.find();
  }

  burnAllSecret() {
    this.boxRepo.clear();
  }


}
