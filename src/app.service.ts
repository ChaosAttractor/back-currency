import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';
import { Currency } from './models/Currency.model';

@Injectable()
export class AppService {
  constructor(
    private sequelize: Sequelize,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Метод для получения курса валют
   * @returns {Promise<Currency[]>} Возвращает промис со всеми данными из таблицы currency
   */
  async getCurrency(): Promise<Currency[]> {
    return await this.sequelize.query('SELECT * FROM currency', {
      model: Currency,
      mapToModel: true,
    });
  }

  /**
   * Метод для заполнения таблицы при получении данных с внешней API
   * @returns {Promise<void>} Ничего не возвращает
   */
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

      await this.sequelize.query(`INSERT INTO currency VALUES ?`, {
        replacements: [values],
      });
    } catch (err) {
      console.log(`Что-то пошло не так ${err}`);
    }
  }

  /**
   * Крон вызываемый каждые 5 секунд, который триггерит вызов метода заполнения таблицы
   * @returns {Promise<void>} Ничего не возвращает
   */
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron(): Promise<void> {
    await this.fillCurrency();
  }
}
