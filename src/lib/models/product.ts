export interface Product {
    _id?: string
    name: string
    description: string
    price: number
    oldPrice: number
    rating: number
    discount: number
    image: string
    url: string
    createdAt?: Date
    updatedAt?: Date
  }
  