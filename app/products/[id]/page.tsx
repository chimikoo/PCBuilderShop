"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import * as React from "react";
import { use, Suspense } from "react";

type Params = { id: string };

export default function ProductDetailPage({ params }: { params: Params }) {
  // Properly type and unwrap params using React.use()
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // First check if this product is part of an active weekly sale
        const saleResponse = await fetch('/api/weekly-sales');
        const saleData = await saleResponse.json();
        
        // Get the regular product data
        const productResponse = await fetch(`/api/products?id=${productId}`);
        const productData = await productResponse.json();
        const productInfo = Array.isArray(productData) ? productData[0] : productData;
        
        // Check if this product is in the active sale
        let finalProductData = productInfo;
        
        if (saleResponse.ok && saleData.products && Array.isArray(saleData.products)) {
          // Find if this product is in the sale
          const saleProduct = saleData.products.find(
            (p: any) => p._id.toString() === productId.toString()
          );
          
          // If found in sale, use the sale price and discount information
          if (saleProduct) {
            console.log('Product found in active sale:', saleProduct);
            finalProductData = {
              ...productInfo,
              originalPrice: productInfo.price, // Store original price
              price: saleProduct.price, // Use discounted price
              discount: saleProduct.discount,
              badge: saleProduct.badge || 'Sale'
            };
          }
        }
        
        setProduct(finalProductData);
      } catch (e) {
        console.error('Error fetching product:', e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/products">
        <Button variant="outline" className="mb-4">&larr; Back to Products</Button>
      </Link>
      <Card className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} width={300} height={300} className="rounded-lg" />
          </div>
          <CardContent className="flex-1 p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
              <div className="text-gray-500 mb-2">{product.brand} {product.model && <>| {product.model}</>}</div>
              <div className="text-gray-600 mb-2">Type: {product.category}</div>
            </CardHeader>
            <div className="mb-4">
              <span className="text-3xl font-bold text-green-600">€{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</span>
              
              {product.originalPrice && product.originalPrice !== product.price && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  €{typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : '0.00'}
                </span>
              )}
              
              {product.discount && (
                <span className="ml-2 text-sm bg-red-600 text-white px-2 py-1 rounded-md">
                  {product.discount}% OFF
                </span>
              )}
              
              <span className="ml-4 text-gray-500">Stock: {product.stock}</span>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Description</h3>
              <p>{product.description}</p>
            </div>
            {product.specs && (
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Specs</h3>
                <p>{product.specs}</p>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="secondary">&larr; Return to Frontpage</Button>
        </Link>
      </div>
    </div>
  );
}
