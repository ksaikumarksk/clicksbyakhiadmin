"use server";

import { revalidatePath } from "next/cache";
// import ProductModel, { Product } from "./models/Product";
import clientPromise from "./mongodb";
import ProductModel, { Product } from "./models/product";

export async function addProduct(productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) {
  try {
    await clientPromise();

    const newProduct = await ProductModel.create({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const insertedProduct = {
      ...newProduct.toObject(),
      _id: newProduct._id.toString(),
    };

    console.log("Product added via Mongoose:", insertedProduct);
    revalidatePath("/");

    return insertedProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    await clientPromise();

    const products = await ProductModel.find().lean();

    const formattedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
      updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined,
    })) as Product[];

    console.log("Products retrieved from MongoDB:", formattedProducts);
    return formattedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to get products");
  }
}
