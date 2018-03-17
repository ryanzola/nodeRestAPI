import { Schema, Document } from 'mongoose'

export interface IUserDocument extends Document {
  _id: Schema.Types.ObjectId,
  email: String,
  password: String
}