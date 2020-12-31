import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { ConfigModule } from '@nestjs/config';
import { BotConfigModule } from '../../db/bot-config/bot-config.module';
import { UserDiscordService } from './user/user-discord-service';
import { UserModule } from '../../db/user/user.module';

@Module({
  imports: [ConfigModule, BotConfigModule, UserModule],
  providers: [DiscordService, UserDiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
