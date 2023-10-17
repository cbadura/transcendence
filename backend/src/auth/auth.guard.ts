import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs';


@Injectable()
export class ftAuthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<boolean>  {
    const activate = await super.canActivate(context) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('is authenticated', req.isAuthenticated());
    return req.isAuthenticated();
  }
}