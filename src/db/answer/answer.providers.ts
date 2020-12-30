import { Connection } from 'mongoose';
import { AnswerSchema } from './answer.schema';

export const answerProviders = [
  {
    provide: 'ANSWER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Answer', AnswerSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
