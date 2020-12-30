import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ProvidersModule } from '../providers/providers.module';
import { userProviders } from './user.providers';

@Module({
  imports: [ProvidersModule],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UserModule {}
