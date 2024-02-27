import { BaseEntity } from '@modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserRole } from '@modules/user-roles/entities/user-role.entity';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Address, AddressSchema } from './address.entity';

export type UserDocument = HydratedDocument<User>;

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
export enum LANGUAGES {
  ENGLISH = 'English',
  FRENCH = 'French',
  JAPANESE = 'Japanese',
  KOREAN = 'Korean',
  SPANISH = 'Spanish',
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User extends BaseEntity {
  @Prop()
  friendly_id: number;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 60,
    set: (first_name: string) => {
      return first_name.trim();
    },
  })
  first_name: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 60,
    set: (last_name: string) => {
      return last_name.trim();
    },
  })
  last_name: string;

  @Prop({
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  @Expose({ name: 'mail', toPlainOnly: true })
  email: string;

  @Prop({
    type: [String],
    enum: LANGUAGES,
  })
  interested_languages: LANGUAGES[];

  @Prop({
    match: /^([+]\d{2})?\d{10}$/,
    get: (phone_number: string) => {
      if (!phone_number) {
        return;
      }
      const last_four_digits = phone_number.slice(phone_number.length - 4);
      return `***-***-${last_four_digits}`;
    },
  })
  phone_number: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Exclude()
  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default:
      'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
  })
  avatar: string;

  @Prop()
  date_of_birth: Date;

  @Prop({
    enum: GENDER,
  })
  gender: GENDER;

  @Prop({ default: 0 })
  point: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserRole.name,
  })
  @Type(() => UserRole)
  @Transform((value) => value.obj.role?.name, { toClassOnly: true })
  role: UserRole;

  @Prop({
    type: [
      {
        type: AddressSchema,
      },
    ],
  })
  @Type(() => Address)
  address: Address[];

  @Prop({
    default: 'cus_mock_id',
  })
  @Exclude()
  stripe_customer_id: string;

  default_address?: string;

  @Prop()
  @Exclude()
  current_refresh_token: string;

  @Expose({ name: 'full_name' })
  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
