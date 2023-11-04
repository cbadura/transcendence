import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AppService } from './app.service';
import { DebugRoute } from "./auth/guard/debugRoute.guard";

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

}
