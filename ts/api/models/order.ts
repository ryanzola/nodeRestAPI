import { Document, Schema, Model, model } from "mongoose";
import { IOrder } from '../interfaces/order';

export var OrderSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    product: Schema.Types.ObjectId,
    quantity: Number
})

export const Order = model("Order", OrderSchema);
