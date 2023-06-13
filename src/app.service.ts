import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';
import { Valute } from './models/Valute.model';

@Injectable()
export class AppService {
  constructor(
    private sequelize: Sequelize,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Метод для получения курса валют
   * @returns {Promise<Valute>[]} Возвращает промис со всеми данными из таблицы currency
   */
  async getCurrency(): Promise<Valute[]> {
    return await this.sequelize.query('SELECT * FROM currency', {
      model: Valute,
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

      let values = '';
      Object.keys(data.Valute).map((key) => {
        values += `('${data.Valute[key].ID}',
                 ${data.Valute[key].NumCode}, 
                 '${data.Valute[key].CharCode}', 
                 ${data.Valute[key].Nominal}, 
                 '${data.Valute[key].Name}', 
                 ${data.Valute[key].Value}, 
                 ${data.Valute[key].Previous}),`;
      });

      values = values.toString().slice(0, -1) + ';';

      await this.sequelize.query(`INSERT INTO currency VALUES ${values}`);
    } catch (err) {
      console.log(`Что-то пошло не так ${err}`);
    }
  }

  /**
   * Крон вызываемый каждые 5 секунд, который триггерит вызов метода заполнения таблицы
   * @returns {void} Ничего не возвращает
   */
  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron(): void {
    this.fillCurrency();
  }
}
