import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BotConfigDocument = BotConfig & Document;

@Schema()
export class BotConfig {
  @Prop() admins: string[]; // LIST OF ADMIN IDS
  @Prop() channels: string[]; // LIST OF CHANNELS LISTENING
  @Prop() updatedAt: Date;
}

export const BotConfigSchema = SchemaFactory.createForClass(BotConfig);
