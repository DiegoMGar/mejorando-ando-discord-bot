import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type QuestionDocument = Question & Document;

export enum QuestionType {
  FREE,
  SELECTION,
  YESNO,
}

@Schema({ strict: true })
export class Question {
  @Prop() title: string;
  @Prop() type: QuestionType;
  @Prop() answers?: string[];
  @Prop() createdAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
