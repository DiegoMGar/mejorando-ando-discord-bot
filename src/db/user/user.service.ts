import { Inject, Injectable } from '@nestjs/common';
import { CoreMongodbService } from '../core-mongodb/core-mongodb';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService extends CoreMongodbService<User, UserDocument> {
  constructor(@Inject('USER_MODEL') model: Model<UserDocument>) {
    super(model);
  }
}
