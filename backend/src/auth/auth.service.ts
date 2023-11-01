import { Injectable, InternalServerErrorException, Res, UnauthorizedException } from '@nestjs/common';
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
import { verifyDto } from './dto/verify.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Response } from 'express';
import { cookieConfig } from './cookie.config';
import { Handshake } from 'socket.io/dist/socket';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(SecretBox) private boxRepo: Repository<SecretBox>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  private signToken(user: User, verified: boolean) {
    const payload = {
      verified: verified,
      id: user.id,
    };
    return this.jwtService.sign(payload);
    // return {
    //   verified: verified,
    //   access_token: this.jwtService.sign(payload)
    // };
  }

  private dataToImage(qr: string) { //useless, keeping it just for reference, should remove soon. 
    if (!qr)
      throw new InternalServerErrorException();
    const data = qr.replace(/^data:image\/\w+;base64,/, '');
    return qr;
  }

  private async secretToImage(user: User, secret: string) { //return qr directly
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

  async jwtIssueToken(user: any, @Res() res: Response) {
    res.cookie('token', this.signToken(user, !user.tfa), cookieConfig);
    return {verified: !user.tfa};
    if (user.tfa === true)
      return this.signToken(user, false);
    if (user.tfa === false)
      return this.signToken(user, true);
  }

  async getTempQRcode(ruser: any) {
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

  async verifyActivate(ruser: any, body: any) {
    const user: User = await this.userService.getUser(ruser.id);
    const box: SecretBox = await this.boxRepo.findOne({where: {id: user.id}});
    if (!box)
      throw new UnauthorizedException();
    const verified: boolean = authenticator.check(body['key'], box.tempSecret);
    const dto = new verifyDto;
    if (verified) {
      dto.verified = true;
      this.userService.updateUser(user.id, {tfa: true})
      box.secret = box.tempSecret;
      this.boxRepo.save(box);
    }
    if (!verified)
      dto.verified = false;
    console.log(body);
    console.log(verified);
    return dto;
  }

  async deactivateTfa(ruser: any) {
    const user: User = await this.userService.getUser(ruser.id);
    const box: SecretBox = await this.boxRepo.findOne({where: {id: user.id}});
    if (box)
      this.boxRepo.remove(box);
    this.userService.updateUser(user.id, {tfa: false});
    return box;
  }

  async tfaVerify(ruser: any, body: any, @Res() res: Response) {
    if (!body || !body['key'])
      return {verified: false};
    const user: User = await this.userService.getUser(ruser.id);
    const box: SecretBox = await this.boxRepo.findOne({where: {id: user.id}});
    if (!box)
      throw new UnauthorizedException(); // not sure what exception to throw, when a non 2fa user try to verify
    const verified: boolean = authenticator.check(body['key'], box.secret);
    const dto = new verifyDto;
    if (verified) {
      res.cookie('token', this.signToken(user, true), cookieConfig);
      return {verified: true};
      // return this.signToken(user, true);
    }
    if (!verified) {
      return {verified: false};
    }
  }

  // private getTokenFromWsHandshake(handshake: Handshake) {
  //   const cookies = handshake.headers.cookie?.split(';').map((cook) => cook.trim());
  //   const tokenstr = cookies?.find((cookie) => cookie.startsWith('token='));
  //   if (tokenstr) {
  //     return tokenstr.split('=')[1];
  //     // const token = tokenstr.split('=')[1];
  //     // console.log('token from handshake cookie', token);
  //     // return token;
  //   }
  //   return null;
  // }
  
  // async verifyJwtFromHandshake(handshake: Handshake): Promise<number | null> {
  //   const token = this.getTokenFromWsHandshake(handshake);
  //   if (!token)
  //     return null;
  //   let payload: any;
  //   try {
  //     payload = await this.jwtService.verifyAsync(token,{secret: process.env.JWT_SECRET});
  //     if (payload.verified === false)
  //       return null;
  //   } catch (error) {
  //     return null;
  //     // throw new UnauthorizedException();
  //   }
  //   return payload.id;
  // }
  
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
