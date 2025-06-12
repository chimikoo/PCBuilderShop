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

export default function CreateWeeklySale() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SaleProduct[]>([]);
  const [durationDays, setDurationDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setAllProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  // Create weekly sale
  const handleCreateSale = async () => {
    if (selectedProducts.length === 0) {
      setError("Please select at least one product");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/weekly-sales", {
        method: "POST",
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
        throw new Error(data.error || "Failed to create weekly sale");
      }

      // Redirect to weekly sales page on success
      router.push("/admin/weekly-sales");
    } catch (error: any) {
      console.error("Error creating weekly sale:", error);
      setError(error.message || "Failed to create weekly sale");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/admin/weekly-sales" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Weekly Sale</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Select products and set discount for the weekly sale
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sale Configuration</CardTitle>
            <CardDescription>Set the sale duration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="duration">Sale Duration</Label>
                <span className="text-sm font-medium">{durationDays} days</span>
              </div>
              <Slider
                id="duration"
                min={1}
                max={14}
                step={1}
                value={[durationDays]}
                onValueChange={(value) => setDurationDays(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 day</span>
                <span>7 days</span>
                <span>14 days</span>
              </div>
            </div>

            <div className="pt-4">
              <Label htmlFor="preview">Preview</Label>
              <div className="mt-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm">
                  <span className="font-medium">Sale Duration:</span> {durationDays} days
                </p>
                <p className="text-sm">
                  <span className="font-medium">Products:</span> {selectedProducts.length}/3 selected
                </p>
                {selectedProducts.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Selected Products:</p>
                    <ul className="space-y-1">
                      {selectedProducts.map((item) => {
                        const product = allProducts.find(p => p._id === item.productId);
                        return (
                          <li key={item.productId} className="text-xs flex justify-between">
                            <span className="truncate max-w-[150px]">{product?.name || 'Product'}</span>
                            <span className="font-medium">{item.discountPercentage}% off</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Products</CardTitle>
            <CardDescription>Choose up to 3 products for the weekly sale</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search-products">Search Products</Label>
              <Input
                id="search-products"
                placeholder="Search by name, category, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>

            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No products found</div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {filteredProducts.map((product) => {
                  const isSelected = selectedProducts.some(item => item.productId === product._id);
                  const selectedProduct = selectedProducts.find(item => item.productId === product._id);
                  
                  return (
                    <div key={product._id} className="rounded-lg border overflow-hidden">
                      <div
                        className={`flex items-center p-3 cursor-pointer transition-colors ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                        }`}
                        onClick={() => toggleProductSelection(product._id)}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{product.category}</span>
                            {product.brand && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span>{product.brand}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium">${product.price}</div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isSelected
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-400 dark:bg-gray-700"
                            }`}
                          >
                            {isSelected ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Percent className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Discount:</span>
                            </div>
                            <div className="font-medium text-sm">
                              {selectedProduct?.discountPercentage}%
                            </div>
                          </div>
                          <Slider
                            min={10}
                            max={50}
                            step={5}
                            value={[selectedProduct?.discountPercentage || 20]}
                            onValueChange={(value) => updateProductDiscount(product._id, value[0])}
                            className="py-4"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>10%</span>
                            <span>30%</span>
                            <span>50%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedProducts([])}>
              Clear Selection
            </Button>
            <Button 
              onClick={handleCreateSale} 
              disabled={selectedProducts.length === 0 || submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Create Sale
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}

// Plus icon component
function Plus({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
