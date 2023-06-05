import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import Valute from './interfaces/Valute';

@Injectable()
export class AppService {
  constructor(
    @Inject('PG_CONNECTION') private conn: any,
    private readonly httpService: HttpService,
  ) {}

  async getCurrency(): Promise<Valute[]> {
    const res = await this.conn.query('SELECT * FROM currency');
    return res.rows;
  }

  async fillCurrency(): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${process.env.API_URL}/daily_json.js`).pipe(),
      );

      await this.conn.query('TRUNCATE TABLE currency');
      const valutes = Object.keys(data.Valute).map((key) => {
        return data.Valute[key];
      });

      for (const valute of valutes) {
        await this.conn.query(
          `INSERT INTO currency (id, "NumCode", "CharCode", "Nominal", "Name", "Value", "Previous")
            VALUES ('${valute.ID}', '${valute.NumCode}','${valute.CharCode}','${valute.Nominal}','${valute.Name}','${valute.Value}','${valute.Previous}')`,
        );
      }
    } catch (err) {
      console.log(`Что-то пошло не так ${err}`);
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron(): void {
    this.fillCurrency();
  }
}
