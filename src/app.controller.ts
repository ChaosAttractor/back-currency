import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Currency } from './models/Currency.model';

@ApiTags('currency')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Метод для получения курса валют',
  })
  @ApiResponse({
    status: 200,
    description: 'Успех',
    schema: {
      example: {
        data: [
          {
            id: 'R01235',
            NumCode: 840,
            CharCode: 'USD',
            Nominal: 1,
            Name: 'Доллар США',
            Value: 83.6405,
            Previous: 82.6417,
          },
          {
            id: 'R01020A',
            NumCode: 944,
            CharCode: 'AZN',
            Nominal: 1,
            Name: 'Азербайджанский манат',
            Value: 49.2003,
            Previous: 48.6128,
          },
          {
            id: 'R01135',
            NumCode: 348,
            CharCode: 'HUF',
            Nominal: 100,
            Name: 'Венгерских форинтов',
            Value: 24.4234,
            Previous: 24.0889,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Не найдено',
    schema: { example: { message: 'Not Found' } },
  })
  @ApiResponse({
    status: 500,
    description: 'Не удалось подключиться',
    schema: {
      example: {
        message: 'Cannot GET /currency',
      },
    },
  })
  @Get('currency')
  getCurrency(): Promise<Currency[]> {
    return this.appService.getCurrency();
  }
}
