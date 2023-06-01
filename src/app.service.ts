import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from './constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { config } from 'dotenv';
config();

@Injectable()
export class AppService {
  constructor(
    @Inject(PG_CONNECTION) private conn: any,
    private readonly httpService: HttpService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getCurrency(): Promise<string[]> {
    const res = await this.conn.query('SELECT * FROM currency ORDER BY id DESC LIMIT 1');
    return res.rows;
  }

  async getDaily(): Promise<string[]> {
    const res = await this.conn.query(
      'SELECT * FROM daily ORDER BY id DESC LIMIT 1',
    );
    return res.rows;
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron(): Promise<string[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${process.env.API_URL}/latest.js`).pipe(
        catchError((error: AxiosError) => {
          throw `${error} Что-то пошло не так`;
        }),
      ),
    );
    const res = await this.conn.query(
      `INSERT INTO currency (date, timestamp, base, rate) VALUES ('${
        data.date
      }','${data.timestamp}','${data.base}','${JSON.stringify(data.rates)}')`,
    );
    return res;
  }

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async daily(): Promise<string[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${process.env.API_URL}/daily_json.js`).pipe(
        catchError((error: AxiosError) => {
          throw `${error} Что-то пошло не так`;
        }),
      ),
    );
    const res = await this.conn.query(
      `INSERT INTO daily (date, previousdate, timestamp, valute) VALUES ('${
        data.Date
      }','${data.PreviousDate}','${data.Timestamp}','${JSON.stringify(
        data.Valute,
      )}')`,
    );
    return res;
  }
}
