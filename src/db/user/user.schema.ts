import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ index: true }) discord: string; // DISCORD USER ID
  @Prop() discordUsername: string;
  @Prop() score: number;
  @Prop() admin: boolean;
  @Prop() adminRange: number;
  @Prop() createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
