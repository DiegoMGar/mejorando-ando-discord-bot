import { Module } from '@nestjs/common';
import { ProvidersModule } from './db/providers/providers.module';
import { ConfigModule } from '@nestjs/config';
import { QuestionModule } from './db/question/question.module';
import { AnswerModule } from './db/answer/answer.module';
import { UserModule } from './db/user/user.module';
import { DiscordModule } from './services/discord/discord.module';
import { BotConfigModule } from './db/bot-config/bot-config.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ProvidersModule,
    QuestionModule,
    AnswerModule,
    UserModule,
    DiscordModule,
    BotConfigModule,
  ],
})
export class AppModule {}
