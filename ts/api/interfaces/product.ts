import { Schema } from 'mongoose'

export interface IProduct {
  _id?: Schema.Types.ObjectId,
  name?: String,
  price?: Number,
  productImage?: String
}