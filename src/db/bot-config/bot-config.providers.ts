import { Connection } from 'mongoose';
import { BotConfigSchema } from './bot-config.schema';

export const botConfigProviders = [
  {
    provide: 'BOT_CONFIG_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('BotConfig', BotConfigSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
