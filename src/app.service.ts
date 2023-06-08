import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';
import { Valute } from './models/Valute.model';
import { format } from 'pg-format';

@Injectable()
export class AppService {
  constructor(
    private sequelize: Sequelize,
    private readonly httpService: HttpService,
  ) {}

  async getCurrency(): Promise<Valute[]> {
    return await this.sequelize.query('SELECT * FROM currency', {
      model: Valute,
      mapToModel: true,
    });
  }

  async fillCurrency(): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${process.env.API_URL}/daily_json.js`).pipe(),
      );

      await this.sequelize.query('TRUNCATE TABLE currency');

      const values = [];
      Object.keys(data.Valute).map((key) => {
        values.push([
          data.Valute[key].ID,
          data.Valute[key].NumCode,
          data.Valute[key].CharCode,
          data.Valute[key].Nominal,
          data.Valute[key].Name,
          data.Valute[key].Value,
          data.Valute[key].Previous,
        ]);
      });
      await this.sequelize.query(
        format(
          `INSERT INTO currency (id, "NumCode", "CharCode", "Nominal", "Name", "Value", "Previous") VALUES %L`,
          values,
        ),
      );
    } catch (err) {
      console.log(`Что-то пошло не так ${err}`);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron(): void {
    this.fillCurrency();
  }
}
