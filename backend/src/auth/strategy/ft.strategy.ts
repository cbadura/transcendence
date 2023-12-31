import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile, VerifyCallback } from 'passport-42'
// import { Strategy, VerifyCallback } from 'passport-oauth2'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      // tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.TCD_UID,
      clientSecret: process.env.TCD_SECRET,
      callbackURL: `https://${process.env.HOST_NAME}:4200/signin/token`,
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
    // console.log(accessToken);
    // console.log(refreshToken);
    const {id, username, _json} = profile;
    const avatar = _json['image']['versions']['small'];
    console.log(avatar);
    const user = await this.authService.ftValidateUser(id, username, avatar);
    // console.log(user);
    return cb(null, user);
    // return id;
  }

}