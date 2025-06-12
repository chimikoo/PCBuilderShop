"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ShoppingBag, ArrowLeft, Check, X, Percent } from "lucide-react";

interface SaleProduct {
  productId: string;
  discountPercentage: number;
}

export default function EditWeeklySale() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SaleProduct[]>([]);
  const [durationDays, setDurationDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSale, setCurrentSale] = useState<any>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // Fetch current sale and all products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch current sale
        const saleRes = await fetch("/api/weekly-sales");
        const saleData = await saleRes.json();
        
        if (saleRes.ok && saleData.sale) {
          setCurrentSale(saleData.sale);
          
          // Set selected products from current sale
          const saleProducts = saleData.sale.saleProducts.map((item: any) => ({
            productId: item.productId,
            discountPercentage: item.discountPercentage
          }));
          setSelectedProducts(saleProducts);
          
          // Calculate remaining days for duration
          const startDate = new Date(saleData.sale.startDate);
          const endDate = new Date(saleData.sale.endDate);
          setEndDate(endDate);
          const remainingDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          setDurationDays(remainingDays > 0 ? remainingDays : 1);
        } else {
          // No active sale, redirect back to weekly sales page
          router.push("/admin/weekly-sales");
          return;
        }
        
        // Fetch all products
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();
        setAllProducts(productsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Filter products based on search term
  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(item => item.productId === productId);
      
      if (isSelected) {
        return prev.filter(item => item.productId !== productId);
      } else {
        // Limit to 3 products
        if (prev.length >= 3) {
          return [...prev.slice(1), { productId, discountPercentage: 20 }];
        }
        return [...prev, { productId, discountPercentage: 20 }];
      }
    });
  };
  
  // Update discount for a specific product
  const updateProductDiscount = (productId: string, discountPercentage: number) => {
    setSelectedProducts(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          return { ...item, discountPercentage };
        }
        return item;
      });
    });
  };

  // Update weekly sale
  const handleUpdateSale = async () => {
    if (selectedProducts.length === 0) {
      setError("Please select at least one product");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/weekly-sales/${currentSale._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          saleProducts: selectedProducts,
          durationDays
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update weekly sale");
      }

      // Redirect to weekly sales page on success
      router.push("/admin/weekly-sales");
    } catch (error: any) {
      console.error("Error updating weekly sale:", error);
      setError(error.message || "Failed to update weekly sale");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/admin/weekly-sales" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Weekly Sale</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Update products and discounts for the current weekly sale
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sale Configuration</CardTitle>
            <CardDescription>Update the sale duration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="duration">Remaining Duration</Label>
                <span className="text-sm font-medium">{durationDays} days</span>
              </div>
              <Slider
                id="duration"
                min={1}
                max={14}
                step={1}
                value={[durationDays]}
                onValueChange={(value) => setDurationDays(value[0])}
              />
              <p className="text-xs text-gray-500">
                Current end date: {endDate?.toLocaleDateString()} - New end date will be {new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            {selectedProducts.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Selected Products</h3>
                {selectedProducts.map((item) => {
                  const product = allProducts.find(p => p._id === item.productId);
                  if (!product) return null;
                  
                  return (
                    <Card key={item.productId} className="overflow-hidden">
                      <div className="flex items-center p-4">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="object-cover w-full h-full rounded"
                            />
                          ) : (
                            <ShoppingBag className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-gray-500">${product.price}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={() => toggleProductSelection(item.productId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="flex justify-between mb-2">
                          <Label>Discount</Label>
                          <span className="text-sm font-medium">{item.discountPercentage}%</span>
                        </div>
                        <Slider
                          min={10}
                          max={50}
                          step={5}
                          value={[item.discountPercentage]}
                          onValueChange={(value) => updateProductDiscount(item.productId, value[0])}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/admin/weekly-sales")}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSale} disabled={submitting || selectedProducts.length === 0}>
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Updating...
                </div>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Sale
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Selection</CardTitle>
            <CardDescription>Select up to 3 products for the weekly sale</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search" className="sr-only">Search</Label>
              <Input
                id="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="h-[500px] overflow-y-auto border rounded-md">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <ShoppingBag className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500">No products found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredProducts.map((product) => {
                    const isSelected = selectedProducts.some((item) => item.productId === product._id);
                    const selectedProduct = selectedProducts.find((item) => item.productId === product._id);
                    return (
                      <div
                        key={product._id}
                        className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                          isSelected ? "bg-blue-50" : ""
                        }`}
                        onClick={() => toggleProductSelection(product._id)}
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="object-cover w-full h-full rounded"
                            />
                          ) : (
                            <ShoppingBag className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-gray-500">${product.price}</p>
                        </div>
                        {isSelected ? (
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-blue-600 mr-2">
                              {selectedProduct?.discountPercentage}% off
                            </span>
                            <div className="bg-blue-100 text-blue-600 rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
