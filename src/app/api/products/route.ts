import { NextResponse } from "next/server";
import { getProducts } from "@/lib/actions";

export async function GET() {
  try {
    const products = await getProducts();
    console.log("Products retrieved:", products);

    return new NextResponse(
      JSON.stringify({ products }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", 
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/products:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to retrieve products" }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
