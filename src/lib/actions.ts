"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "./mongodb"
import ProductModel, { type Product } from "./models/product"

export async function addProduct(productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) {
  try {
    await clientPromise()

    const newProduct = await ProductModel.create({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const insertedProduct = {
      ...newProduct.toObject(),
      _id: newProduct._id.toString(),
    }

    console.log("Product added via Mongoose:", insertedProduct)
    revalidatePath("/")

    return insertedProduct
  } catch (error) {
    console.error("Error adding product:", error)
    throw new Error("Failed to add product")
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    await clientPromise()

    const products = await ProductModel.find().lean()

    const formattedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
      updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined,
    })) as Product[]

    console.log("Products retrieved from MongoDB:", formattedProducts)
    return formattedProducts
  } catch (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to get products")
  }
}

export async function updateProduct(
  productId: string,
  productData: Partial<Omit<Product, "_id" | "createdAt" | "updatedAt">>,
) {
  try {
    await clientPromise()

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        ...productData,
        updatedAt: new Date(),
      },
      { new: true },
    ).lean()

    if (!updatedProduct) {
      throw new Error("Product not found")
    }

    const formattedProduct = {
      ...updatedProduct,
      _id: updatedProduct._id.toString(),
      createdAt: updatedProduct.createdAt ? new Date(updatedProduct.createdAt) : undefined,
      updatedAt: updatedProduct.updatedAt ? new Date(updatedProduct.updatedAt) : undefined,
    } as Product

    console.log("Product updated:", formattedProduct)
    revalidatePath("/")

    return formattedProduct
  } catch (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product")
  }
}

export async function deleteProduct(productId: string) {
  try {
    await clientPromise()

    const deletedProduct = await ProductModel.findByIdAndDelete(productId).lean()

    if (!deletedProduct) {
      throw new Error("Product not found")
    }

    console.log("Product deleted:", deletedProduct._id.toString())
    revalidatePath("/")

    return { success: true, id: deletedProduct._id.toString() }
  } catch (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}

export async function getProductById(productId: string): Promise<Product> {
  try {
    await clientPromise()

    const product = await ProductModel.findById(productId).lean()

    if (!product) {
      throw new Error("Product not found")
    }

    const formattedProduct = {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
      updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined,
    } as Product

    return formattedProduct
  } catch (error) {
    console.error("Error fetching product:", error)
    throw new Error("Failed to get product")
  }
}
