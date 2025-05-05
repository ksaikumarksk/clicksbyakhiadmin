"use client"

import {useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Plus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addProduct } from "@/lib/actions"
import { Product } from "@/lib/models/product"
import { toast } from "sonner"

export default function AdminPanel() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  // const [imageError, setImageError] = useState(false)


  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      price: "",
      oldPrice: "",
      rating: "",
      discount: "",
      image: "",
      url: "",
      category: "",
    }
  })

  interface FormData {
    name: string;
    price: string;
    oldPrice: string;
    rating: string;
    discount: string;
    image: string;
    url: string;
    category: string;
  }

// console.log("fjijei")

function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

  async function onSubmit(data: FormData) {
    try {
      setIsSubmitting(true)
      console.log("Form data:", data)
       if (!imageFile) throw new Error("Image file is required")
      const base64Image = await convertToBase64(imageFile)

      const formattedData = {
        ...data,
        price: parseFloat(data.price),
        oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : null,
        rating: data.rating ? parseFloat(data.rating) : null,
        discount: data.discount ? parseFloat(data.discount) : null,
        image: base64Image,
      }

      console.log("Formatted data:", formattedData)
      
      const newProduct = await addProduct(formattedData as Omit<Product, "_id" | "createdAt" | "updatedAt">)
      console.log("Product added:", newProduct)

      reset()
      setImageFile(null)
      toast.success("Product added successfully")

    } catch (error) {
      console.error("Error adding product:", error)
      toast.error("Failed to add product")
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
                  {...register("oldPrice")}
                />
                {/* {errors.oldPrice && <p className="text-sm text-red-500">{errors.oldPrice.message as string}</p>} */}
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
                  {...register("rating")}
                />
                {/* {errors.rating && <p className="text-sm text-red-500">{errors.rating.message as string}</p>} */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input 
                  id="discount" 
                  type="number" 
                  min="0" 
                  max="100" 
                  placeholder="10" 
                  {...register("discount")}
                />
                {/* {errors.discount && <p className="text-sm text-red-500">{errors.discount.message as string}</p>} */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image File</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setImageFile(file)
                  }}
                />
                {/* {!imageError && <p className="text-sm text-red-500">Image file is required</p>} */}
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

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full border rounded-md px-3 py-2"
                  {...register("category", { required: "Category is required" })}
                >
                  <option value="">Select a category</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home</option>
                  <option value="electronics">Electronics</option>
                  <option value="need">Need</option>
                </select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message as string}</p>}
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
    </div>
  )
}
