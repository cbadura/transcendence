import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { Profile } from 'passport-42'
import { AuthService } from "./auth.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: Profile, done: (err: Error, user: Profile) => void) {
    done(null, user);
  }

  async deserializeUser(payload: Profile, done: (err: Error, user: Profile) => void) {
    // const userDB = await this.authService.findUser();
    // return done(null, payload);
  }

}