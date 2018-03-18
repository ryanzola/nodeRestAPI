import { Schema, Document } from 'mongoose'

export interface IProductDocument extends Document {
  _id: Schema.Types.ObjectId,
  name: String,
  price: Number,
  productImage: String
}