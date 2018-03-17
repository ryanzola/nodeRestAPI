import { Schema } from 'mongoose'

export interface IOrder {
  _id?: Schema.Types.ObjectId,
  product?: Schema.Types.ObjectId,
  quantity?: Number
}