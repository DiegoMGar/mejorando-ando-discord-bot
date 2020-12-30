import { Inject, Injectable } from '@nestjs/common';
import { CoreMongodbService } from '../core-mongodb/core-mongodb';
import { BotConfig, BotConfigDocument } from './bot-config.schema';
import { Model } from 'mongoose';

@Injectable()
export class BotConfigService extends CoreMongodbService<
  BotConfig,
  BotConfigDocument
> {
  constructor(@Inject('BOT_CONFIG_MODEL') model: Model<BotConfigDocument>) {
    super(model);
  }

  async insertDefaultConfig(): Promise<BotConfigDocument> {
    return this.insert({
      admins: [],
      channels: [],
      updatedAt: new Date(),
    });
  }
}
