"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { toast } from "sonner"

import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/lib/actions";
import type { Product } from "@/lib/models/product";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = [
  "Women",
  "Men",
  "Kids",
  "Home and kitchen",
  "Beauty",
  "Jewellery and accessories",
  "Bags and foot wear",
  "Electronics",
  "New born Baby needs",
  "kitchen"
];

export default function AdminPanel() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("add");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      oldPrice: "",
      rating: "",
      discount: "",
      image: "",
      url: "",
      category: "",
    },
  });

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

  const priceW = Number.parseFloat(watch("price"));
  const oldPriceW = Number.parseFloat(watch("oldPrice"));
  // console.log("priceW", priceW);
  // console.log("oldPriceW", oldPriceW);
  useEffect(() => {
    if (oldPriceW > 0 && priceW >= 0) {
      const discount = ((oldPriceW - priceW) / oldPriceW) * 100;
      setValue("discount", discount.toFixed(0));
    }
  }, [oldPriceW, priceW, setValue]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }

  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async function onSubmit(data: FormData) {
    try {
      setIsSubmitting(true);

      let base64Image = "";

      // If editing and no new image is selected, use the existing image
      if (editingProduct && !imageFile) {
        base64Image = editingProduct.image;
      } else {
        // For new products or when updating with a new image
        if (!imageFile) throw new Error("Image file is required");
        base64Image = await convertToBase64(imageFile);
      }

      const formattedData = {
        ...data,
        price: Number.parseFloat(data.price),
        oldPrice: data.oldPrice ? Number.parseFloat(data.oldPrice) : null,
        rating: data.rating ? Number.parseFloat(data.rating) : null,
        discount: data.discount ? Number.parseFloat(data.discount) : null,
        image: base64Image,
      };

      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct._id, formattedData);
        toast.success("Product updated successfully");
      } else {
        // Add new product
        await addProduct(
          formattedData as Omit<Product, "_id" | "createdAt" | "updatedAt">
        );
        toast.success("Product added successfully");
      }

      // Reset form and refresh product list
      reset();
      setImageFile(null);
      setEditingProduct(null);
      fetchProducts();
      setActiveTab("list");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        editingProduct ? "Failed to update product" : "Failed to add product"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);

    // Populate form with product data
    setValue("name", product.name);
    setValue("price", product.price.toString());
    setValue("oldPrice", product.oldPrice ? product.oldPrice.toString() : "");
    setValue("rating", product.rating ? product.rating.toString() : "");
    setValue("discount", product.discount ? product.discount.toString() : "");
    setValue("url", product.url);
    setValue("category", product.category);

    // Switch to add/edit tab
    setActiveTab("add");
  }

  async function handleDelete(productId: string) {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  }

  return (
    <div className="grid gap-8 max-w-6xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px] mx-auto mb-6">
          <TabsTrigger value="add">
            {editingProduct ? "Edit Product" : "Add Product"}
          </TabsTrigger>
          <TabsTrigger value="list">Product List</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Product name"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message as string}
                      </p>
                    )}
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
                    {errors.price && (
                      <p className="text-sm text-red-500">
                        {errors.price.message as string}
                      </p>
                    )}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">
                      {editingProduct
                        ? "Image File (Leave empty to keep current image)"
                        : "Image File"}
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setImageFile(file);
                      }}
                    />
                    {editingProduct && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          Current image:
                        </p>
                        <img
                          src={editingProduct.image || "/placeholder.svg"}
                          alt={editingProduct.name}
                          className="w-20 h-20 object-cover mt-1 border rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">Product URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/product"
                      {...register("url", {
                        required: "Product URL is required",
                      })}
                    />
                    {errors.url && (
                      <p className="text-sm text-red-500">
                        {errors.url.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full border rounded-md px-3 py-2"
                      {...register("category", {
                        required: "Category is required",
                      })}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((category) => (
                        <option
                          key={category}
                          value={category.toLowerCase().replace(/\s+/g, "-")}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-500">
                        {errors.category.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingProduct ? "Updating..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        {editingProduct ? (
                          <>
                            <Edit className="mr-2 h-4 w-4" />
                            Update Product
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                          </>
                        )}
                      </>
                    )}
                  </Button>

                  {editingProduct && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingProduct(null);
                        reset();
                        setImageFile(null);
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No products found. Add some products to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {product.category ? (
                              <span className="capitalize">
                                {product.category.replace(/-/g, " ")}
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic">
                                None
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Product
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete 
                                      {product.name}? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(product._id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>{product.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="flex justify-center">
                                      <img
                                        src={
                                          product.image || "/placeholder.svg"
                                        }
                                        alt={product.name}
                                        className="w-40 h-40 object-cover rounded"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div className="font-medium">Price:</div>
                                      <div>{product.price.toFixed(2)}</div>

                                      {product.oldPrice && (
                                        <>
                                          <div className="font-medium">
                                            Old Price:
                                          </div>
                                          <div>
                                            {product.oldPrice.toFixed(2)}
                                          </div>
                                        </>
                                      )}

                                      {product.rating && (
                                        <>
                                          <div className="font-medium">
                                            Rating:
                                          </div>
                                          <div>{product.rating}/5</div>
                                        </>
                                      )}

                                      {product.discount && (
                                        <>
                                          <div className="font-medium">
                                            Discount:
                                          </div>
                                          <div>{product.discount}%</div>
                                        </>
                                      )}

                                      <div className="font-medium">
                                        Category:
                                      </div>
                                      <div className="capitalize">
                                        {product.category
                                          ? product.category.replace(/-/g, " ")
                                          : "None"}
                                      </div>

                                      <div className="font-medium">URL:</div>
                                      <div className="truncate">
                                        <a
                                          href={product.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline"
                                        >
                                          {product.url}
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
