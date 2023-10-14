import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { Profile } from 'passport-42'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  // constructor() {}

  serializeUser(user: Profile, done: (err: Error, user: Profile) => void) {
    done(null, user);
  }

  deserializeUser(payload: Profile, done: (err: Error, user: Profile) => void) {
    return done(null, payload);
  }

}