import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('currency')
  getCurrency(): Promise<unknown[]> {
    return this.appService.getCurrency();
  }
}
