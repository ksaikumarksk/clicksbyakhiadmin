"use server"

import { revalidatePath } from "next/cache"
import type { Product } from "./models/product"
import clientPromise from "./mongodb"

export async function addProduct(productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) {
  try {
    const client = await clientPromise
    const db = client.db("productDatabase")
    const collection = db.collection("products")

    const newProduct = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newProduct)

    // Return the new product with the generated _id
    const insertedProduct = {
      ...newProduct,
      _id: result.insertedId.toString(),
    }

    console.log("Product added to MongoDB:", insertedProduct)
    revalidatePath("/")

    return insertedProduct
  } catch (error) {
    console.error("Error adding product to MongoDB:", error)
    throw new Error("Failed to add product to database")
  }
}

export async function getProducts() {
  try {
    const client = await clientPromise
    const db = client.db("productDatabase")
    const collection = db.collection("products")

    const products = await collection.find({}).toArray()

    // Convert _id from ObjectId to string
    const formattedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
      updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined,
    })) as Product[]

    return formattedProducts
  } catch (error) {
    console.error("Error getting products from MongoDB:", error)
    throw new Error("Failed to get products from database")
  }
}
