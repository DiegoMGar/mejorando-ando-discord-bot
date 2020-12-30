import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { ProvidersModule } from '../providers/providers.module';
import { questionProviders } from './question.providers';

@Module({
  imports: [ProvidersModule],
  providers: [QuestionService, ...questionProviders],
  exports: [QuestionService],
})
export class QuestionModule {}
