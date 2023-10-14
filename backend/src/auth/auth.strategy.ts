import { Strategy } from 'passport-oauth2'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.TCD_UID,
      clientSecret: process.env.TCD_SECRET,
      callbackURL: process.env.TCD_CALLBACKURL,
      scope: ['public']
    });
  }

  async validate(accessToken: string, refreshToken: string) {
    console.log(accessToken, refreshToken);
  }
}