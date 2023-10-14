import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-42'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.TCD_UID,
      clientSecret: process.env.TCD_SECRET,
      callbackURL: process.env.TCD_CALLBACKURL,
      scope: ['public'],
      passReqToCallback: true,
    });
  }

  async validate(wtf: string, accessToken: string, refreshToken: string, profile: Profile) {
    // console.log(accessToken, refreshToken);
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    const {id, username, displayName} = profile;
    console.log(id, username, displayName);
  }
}