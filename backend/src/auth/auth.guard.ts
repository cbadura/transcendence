import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PassportModule } from 'passport'


@Injectable()
export class ftAuthGuard extends AuthGuard() {
  async canActivate(context: ExecutionContext): Promise<any>  {
    const activate = await super.canActivate(context) as boolean;
    const request = context.switchToHttp().getRequest();
    console.log(request);
    await super.logIn(request);
    return activate;
  }
}