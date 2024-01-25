import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { AppService } from './app.service';
import { AppUpdate } from './app.update';
import * as dotenv from 'dotenv';

dotenv.config();
const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
