import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnswerDocument = Answer & Document;

@Schema()
export class Answer {
  @Prop() user: string; // FOREIGN KEY USER DOCUMENT
  @Prop() questions: string[];
  @Prop() answers: string[];
  @Prop() createdAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
