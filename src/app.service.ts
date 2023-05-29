import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from './constants';

@Injectable()
export class AppService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getCurrency(): Promise<any> {
    const res = await this.conn.query('SELECT * FROM currency');
    return res.rows;
  }
}
