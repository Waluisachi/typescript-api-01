import mongoose from "mongoose";
import {UserDocument} from "./user.model";
import { v4 as uuidv4 } from 'uuid';
//import {  } from 'nanoid';

//const nano_id = nanoid()//customAlphabet("qwertyuiopasdfghjklzxcvbnm12345678900", 10);

export interface ProductDocument extends mongoose.Document {
    user: UserDocument["_id"];
    title: string;
    description: string;
    price: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new mongoose.Schema(
        {
            product_id: {
                type: String,
                required: true,
                unique: true,
                default: () => `product_${uuidv4()}`,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            }
        },
        {
            timestamps: true
        }
        );

const Product = mongoose.model<ProductDocument>("Product", productSchema);

export default Product;