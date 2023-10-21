import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";

@Injectable()
export class jwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }
  
  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const request = context.switchToHttp().getRequest();
  //   const token = ExtractJwt.fromUrlQueryParameter('userId')(request);
  //   if (!token)
  //     throw new UnauthorizedException();
    
  //   try {
  //     const payload = await this.jwtService.verifyAsync(
  //       token,
  //       {secret: process.env.JWT_SECRET},
  //     );
  //     request['user'] = payload;
  //   } catch {
  //     throw new UnauthorizedException()
  //   }
  //   const activate = await super.canActivate(context);
  //   // console.log(activate);
  //   return true;
  // }

}