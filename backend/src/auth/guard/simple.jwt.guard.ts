import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class simplejwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}