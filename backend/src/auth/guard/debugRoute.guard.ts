import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class DebugRoute implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        console.log(process.env.DEBUG_FLAG)
        const debugFlag = process.env.DEBUG_FLAG === 'true';
        // return false
        return debugFlag;
    }
}