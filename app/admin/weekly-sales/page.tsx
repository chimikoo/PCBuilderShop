"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Plus, Calendar, Percent, Clock, Trash2, RefreshCw } from "lucide-react";
import { CountdownTimer } from "@/components/ui/countdown-timer";

// Badge component for status indicators
const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "success" | "warning" | "danger" }) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default function WeeklySalesAdmin() {
  const [currentSale, setCurrentSale] = useState<any>(null);
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [allSales, setAllSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(true);
  const [error, setError] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Fetch current weekly sale
  useEffect(() => {
    const fetchCurrentSale = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/weekly-sales");
        const data = await res.json();
        
        if (res.ok && data.sale) {
          setCurrentSale(data.sale);
          setSaleProducts(data.products || []);
        } else {
          setCurrentSale(null);
          setSaleProducts([]);
        }
      } catch (error) {
        console.error("Error fetching weekly sale:", error);
        setError("Failed to load weekly sale data");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentSale();
  }, [actionInProgress]);
  
  // Fetch all weekly sales
  useEffect(() => {
    const fetchAllSales = async () => {
      setSalesLoading(true);
      try {
        const res = await fetch("/api/weekly-sales/all");
        const data = await res.json();
        
        if (res.ok && data.sales) {
          setAllSales(data.sales);
        } else {
          setAllSales([]);
        }
      } catch (error) {
        console.error("Error fetching all weekly sales:", error);
      } finally {
        setSalesLoading(false);
      }
    };

    fetchAllSales();
  }, [actionInProgress]);

  // Fetch all products for selection
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setAllProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Weekly Sales</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage special weekly discounts for your products
          </p>
        </div>
        <Link href="/admin/weekly-sales/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Sale
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
        {currentSale ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Weekly Sale</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">Active</Badge>
                  <Link href={`/admin/weekly-sales/edit`}>
                    <Button variant="outline" size="sm" className="h-7 px-2">
                      <span className="mr-1">Edit</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
                    </Button>
                  </Link>
                </div>
              </CardTitle>
              <CardDescription>
                Sale runs from {formatDate(currentSale.startDate)} to {formatDate(currentSale.endDate)}
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <span>Sale End Date:</span>
              </div>
              <div className="font-medium">{formatDate(currentSale.endDate)}</div>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center">
                <Percent className="h-5 w-5 text-gray-500 mr-2" />
                <span>Discounts:</span>
              </div>
              <div>
                {currentSale.saleProducts && currentSale.saleProducts.map((product: any, index: number) => {
                  const saleProduct = saleProducts.find((p: any) => p._id.toString() === product.productId.toString());
                  return (
                    <div key={product.productId} className="text-sm font-medium">
                      {saleProduct ? saleProduct.name.substring(0, 15) + (saleProduct.name.length > 15 ? '...' : '') : `Product ${index + 1}`}: {product.discountPercentage}% off
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span>Time Remaining:</span>
              </div>
              <div>
                <CountdownTimer endDate={new Date(currentSale.endDate)} />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-3">Products On Sale</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {saleProducts.map((product) => (
                  <Card key={product._id} className="overflow-hidden">
                    <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {currentSale.saleProducts.find((p: any) => p.productId.toString() === product._id.toString())?.discountPercentage || 0}% OFF
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium line-clamp-1">{product.name}</h4>
                      <div className="flex items-center mt-2">
                        <span className="text-lg font-bold text-green-600">${product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${product.originalPrice || (product.price / (1 - currentSale.discountPercentage / 100)).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        ) : null}
        </>
      )}
    </div>
  );
}


