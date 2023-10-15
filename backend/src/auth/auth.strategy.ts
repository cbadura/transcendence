import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile, VerifyCallback } from 'passport-42'
import { Inject, Injectable } from '@nestjs/common'
import { AuthService } from './auth.service';

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.TCD_UID,
      clientSecret: process.env.TCD_SECRET,
      callbackURL: process.env.TCD_CALLBACKURL,
      scope: ['public'],
      passReqToCallback: true,
    });
  }

  async validate(
    request: string,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback
    ) {
    // console.log(accessToken, refreshToken);
    console.log(accessToken);
    console.log(refreshToken);
    // console.log(profile);
    const {id, username, displayName, _json} = profile;
    // console.log(id, username, displayName);
    // this.authService.validateUser(id);
    // console.log(_json);
    console.log(cb.toString);
    this.authService.validateUser(1);
    // return cb;
  }
}