import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { AppService } from './app.service';
import { AppUpdate } from './app.update';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TaskEntity } from './task.entity';

dotenv.config();
const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: process.env.DATABASE,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, '**', '*.migration.{ts,js}')],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
