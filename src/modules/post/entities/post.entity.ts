import { BaseEntity } from '@modules/shared/base/base.entity';
import { User } from '@modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

const ObjectId = mongoose.Schema.Types.ObjectId;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Post extends BaseEntity {
  @Prop({
    required: true,
  })
  title: string;
  @Prop({
    required: true,
  })
  content: string;

  @Prop()
  images: string[];

  @Prop({
    type: ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
