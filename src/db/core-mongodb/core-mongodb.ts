import { Model, Document } from 'mongoose';

export class CoreMongodbService<Z, T extends Document> {
  protected defaultProjection = { __v: false };

  constructor(protected model: Model<T>) {}

  document(input?: Z): T {
    return new this.model(input);
  }

  insert(input: Z): Promise<T> {
    const created = new this.model(input);
    return created.save();
  }

  findAll(): Promise<T[]> {
    return this.model
      .find()
      .select(this.defaultProjection)
      .exec();
  }

  findOne(id: string): Promise<T> {
    return this.model
      .findById(id)
      .select(this.defaultProjection)
      .exec();
  }

  find(conditions: { [index: string]: any }): Promise<T[]> {
    return this.model
      .find(conditions as any)
      .select(this.defaultProjection)
      .exec();
  }

  deleteOne(
    id: string,
  ): Promise<{ ok?: number; n?: number; deletedCount?: number }> {
    const conditions: any = { _id: id };
    return this.model.deleteOne(conditions).exec();
  }

  deleteMany(conditions: {
    [index: string]: any;
  }): Promise<{ ok?: number; n?: number; deletedCount?: number }> {
    return this.model.deleteMany(conditions as any).exec();
  }
}
