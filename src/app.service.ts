import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
  constructor(
    private sequelize: Sequelize,
    private readonly httpService: HttpService,
  ) {}
  // todo Valute[] не дружит((( Object[] тоже. Тип res[unknown[],unknown] + приходит странно
  // typeof res в логи кидает Object
  async getCurrency(): Promise<unknown[]> {
    const [res] = await this.sequelize.query('SELECT * FROM currency');
    return res;
  }

  async fillCurrency(): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${process.env.API_URL}/daily_json.js`).pipe(),
      );

      await this.sequelize.query('TRUNCATE TABLE currency');
      const valutes = Object.keys(data.Valute).map((key) => {
        return data.Valute[key];
      });

      for (const valute of valutes) {
        await this.sequelize.query(
          `INSERT INTO currency (id, "NumCode", "CharCode", "Nominal", "Name", "Value", "Previous")
            VALUES ('${valute.ID}', '${valute.NumCode}','${valute.CharCode}','${valute.Nominal}','${valute.Name}','${valute.Value}','${valute.Previous}')`,
        );
      }
    } catch (err) {
      console.log(`Что-то пошло не так ${err}`);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron(): void {
    this.fillCurrency();
  }
}
