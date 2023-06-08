import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Valute } from './models/Valute.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // todo описать метод
  @Get('currency')
  getCurrency(): Promise<Valute[]> {
    return this.appService.getCurrency();
  }
}
