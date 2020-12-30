import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { ConfigModule } from '@nestjs/config';
import {BotConfigModule} from '../../db/bot-config/bot-config.module';

@Module({
  imports: [ConfigModule, BotConfigModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
