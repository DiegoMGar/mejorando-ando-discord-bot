import { Inject, Injectable } from '@nestjs/common';
import { CoreMongodbService } from '../core-mongodb/core-mongodb';
import { Answer, AnswerDocument } from './answer.schema';
import { Model } from 'mongoose';

@Injectable()
export class AnswerService extends CoreMongodbService<Answer, AnswerDocument> {
  constructor(@Inject('ANSWER_MODEL') model: Model<AnswerDocument>) {
    super(model);
  }
}
