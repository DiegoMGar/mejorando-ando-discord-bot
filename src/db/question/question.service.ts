import { Inject, Injectable } from '@nestjs/common';
import { CoreMongodbService } from '../core-mongodb/core-mongodb';
import { Question, QuestionDocument } from './question.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuestionService extends CoreMongodbService<
  Question,
  QuestionDocument
> {
  constructor(@Inject('QUESTION_MODEL') model: Model<QuestionDocument>) {
    super(model);
  }
}
