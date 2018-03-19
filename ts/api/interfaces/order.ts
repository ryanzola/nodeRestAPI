import { Schema, Document } from 'mongoose'

export interface IOrderDocument extends Document {
  _id: Schema.Types.ObjectId,
  product: Schema.Types.ObjectId,
  quantity: Number
}