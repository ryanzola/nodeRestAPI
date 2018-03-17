import { Document, Schema, Model, model } from "mongoose";
import { IProduct } from '../interfaces/product'

export var ProductSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    }
})

export const Product = model('Product', ProductSchema)
