import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '@modules/users/schemas/users.schema';
import { PropertyType } from '@constants/property-types.constant';

@Schema({ timestamps: true, versionKey: false })
export class Ad extends Document {
  @Prop({ type: String, ref: User.name, required: true, index: 1 })
  userUuid: String;

  @Prop({ enum: PropertyType, required: true })
  propertyType: PropertyType;

  @Prop({ type: String, required: true })
  area: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  district: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Date, default: Date.now() })
  refreshedAt: Date;
}

export const AdSchema = SchemaFactory.createForClass(Ad);
