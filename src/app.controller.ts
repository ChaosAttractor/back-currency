import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Money } from './models/Money.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // todo поправить свагер. Пример - https://api.fesco.com/api/public
  @ApiResponse({
    description: 'Метод для получения курса валют',
  })
  @ApiResponse({ status: 200, description: 'Успех' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  @ApiResponse({ status: 500, description: 'Не удалось подключиться' })
  @Get('currency')
  getCurrency(): Promise<Money[]> {
    return this.appService.getCurrency();
  }
}
