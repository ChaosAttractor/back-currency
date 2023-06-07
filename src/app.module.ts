import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';

@Module({
  // todo проверить
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [],
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
