import { Controller, Get, Param } from "@nestjs/common";
import { AppService } from './app.service';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getHello(@Param('id') id: string): string {
    return this.appService.getHello();
  }
}
