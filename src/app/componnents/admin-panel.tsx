"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Plus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addProduct } from "@/lib/actions"
// import { ProductList } from "@/components/product-list"
import type { Product } from "@/lib/models/product"
import { ProductList } from "./product-list"

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      // description: "",
      price: "",
      oldPrice: "",
      rating: "",
      discount: "",
      image: "",
      url: "",
    }
  })

  async function onSubmit(data: any) {
    try {
      setIsSubmitting(true)
      
      // Convert numeric fields
      const formattedData = {
        ...data,
        price: parseFloat(data.price),
        oldPrice: parseFloat(data.oldPrice),
        rating: parseFloat(data.rating),
        discount: parseFloat(data.discount),
      }
      
      const newProduct = await addProduct(formattedData)
      console.log("Product added:", newProduct)

      // Add the new product to the state
      setProducts((prev) => [...prev, newProduct])

      // Reset the form
      reset()
    } catch (error) {
      console.error("Error adding product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-8 max-w-4xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Product name" 
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  placeholder="29.99" 
                  {...register("price", { required: "Price is required" })}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="oldPrice">Old Price</Label>
                <Input 
                  id="oldPrice" 
                  type="number" 
                  step="0.01" 
                  placeholder="39.99" 
                  {...register("oldPrice", { required: "Old price is required" })}
                />
                {errors.oldPrice && <p className="text-sm text-red-500">{errors.oldPrice.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input 
                  id="rating" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="5" 
                  placeholder="4.5" 
                  {...register("rating", { required: "Rating is required" })}
                />
                {errors.rating && <p className="text-sm text-red-500">{errors.rating.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input 
                  id="discount" 
                  type="number" 
                  min="0" 
                  max="100" 
                  placeholder="10" 
                  {...register("discount", { required: "Discount is required" })}
                />
                {errors.discount && <p className="text-sm text-red-500">{errors.discount.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image" 
                  placeholder="https://example.com/image.jpg" 
                  {...register("image", { required: "Image URL is required" })}
                />
                {errors.image && <p className="text-sm text-red-500">{errors.image.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">Product URL</Label>
                <Input 
                  id="url" 
                  placeholder="https://example.com/product" 
                  {...register("url", { required: "Product URL is required" })}
                />
                {errors.url && <p className="text-sm text-red-500">{errors.url.message as string}</p>}
              </div>
              
              
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* {products.length > 0 && <ProductList products={products} />} */}
    </div>
  )
}
