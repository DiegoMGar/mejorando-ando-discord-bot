import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from '../../config/configuration';

export const databaseProviders = [
  {
    inject: [ConfigService],
    provide: 'DATABASE_CONNECTION',
    useFactory: (
      config: ConfigService<AppConfiguration>,
    ): Promise<typeof mongoose> => mongoose.connect(config.get('MONGODB_URL'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      useCreateIndex: true,
    }),
  },
];
