import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class ftAuthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = await super.canActivate(context) as boolean;
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    // await super.logIn(request);
    console.log(request);
    return activate;
  }
}