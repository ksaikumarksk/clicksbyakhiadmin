import mongoose, { Schema, Document, Model } from "mongoose";
export interface Product extends Document {
    _id: string; // Make _id required
    name: string;
    price: number;
    oldPrice: number|null;
    rating: number | null;
    discount: number | null;
    category: string;
    image: string;
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
  }


// Define the interface
// export interface Product extends Document {
//   name: string;
//   price: number;
//   description?: string;
//   imageUrl?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// Define the schema
const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, },
    rating: { type: Number,},
    discount: { type: Number, },
    category: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);
// Export the model or reuse existing one
const ProductModel: Model<Product> =
  mongoose.models.Product || mongoose.model<Product>("Product", ProductSchema);

export default ProductModel;

  