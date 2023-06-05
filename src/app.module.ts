import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
