import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRoles } from 'src/constants/user-roles.constant';
import { UserStatus } from 'src/constants/user-status.constant';
import { v4 as uuidV4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ type: String, default: uuidV4(), required: true })
  uuid: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  phone: string;

  @Prop({ enum: UserRoles, default: UserRoles.CLIENT, required: true })
  role: UserRoles;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE, required: true })
  status: UserStatus;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  salt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
