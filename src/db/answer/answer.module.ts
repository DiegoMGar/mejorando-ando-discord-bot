import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ProvidersModule } from '../providers/providers.module';
import { answerProviders } from './answer.providers';

@Module({
  imports: [ProvidersModule],
  providers: [AnswerService, ...answerProviders],
  exports: [AnswerService],
})
export class AnswerModule {}
