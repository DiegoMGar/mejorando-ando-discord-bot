import { Module } from '@nestjs/common';
import { BotConfigService } from './bot-config.service';
import { ProvidersModule } from '../providers/providers.module';
import { botConfigProviders } from './bot-config.providers';

@Module({
  imports: [ProvidersModule],
  providers: [BotConfigService, ...botConfigProviders],
  exports: [BotConfigService],
})
export class BotConfigModule {}
