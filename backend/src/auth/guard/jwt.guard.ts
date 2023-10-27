import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class jwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
    ) {
    super();
  }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // const token = ExtractJwt.fromUrlQueryParameter('token')(request);
    const token = request.cookies?.token?.access_token; // get token from cookie
    if (!token)
      throw new UnauthorizedException();
    
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {secret: process.env.JWT_SECRET},
      );
      if (payload.verified === false)
        return false;
      request['user'] = await this.userService.getUser(payload.id);
    } catch {
      throw new UnauthorizedException()
    }
    // const activate = await super.canActivate(context);
    // console.log(activate);
    return true;
  }

}