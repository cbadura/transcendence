import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      // jwtFromRequest: ExtractJwt.fromExtractors([(req) => { // read token from cookie
      //   return req.cookies['access_token'];
      // }]), 
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: any) {
    const user = await this.userService.getUser(payload.id);
    if (!user)
      throw new UnauthorizedException();
    // console.log(user);
    return user;
  }
}