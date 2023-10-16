import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile, VerifyCallback } from 'passport-42'
import { Injectable } from '@nestjs/common'
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
    console.log(accessToken);
    console.log(refreshToken);
    const {id, username} = profile;
    // console.log(id, username, displayName);
    // console.log(_json);
    console.log(cb(null, profile));
    this.authService.validateUser({id, username}); 
    return cb(null, profile);
  }
}