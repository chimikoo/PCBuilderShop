"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function MigrateProductsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      setResults({
        success: true,
        message: `Successfully fetched ${data.length} products`,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      setResults({
        success: false,
        message: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const migrateProductSpecs = async () => {
    setIsLoading(true);
    try {
      let migratedCount = 0;
      let errorCount = 0;
      
      for (const product of products) {
        if (!product.specs || typeof product.specs !== "object") {
          console.log(`Skipping product ${product._id}: No specs object found`);
          continue;
        }
        
        const newSpecs = { ...product.specs };
        
        // Migrate CPU specs
        if (product.specs.cpu) {
          Object.entries(product.specs.cpu).forEach(([key, value]) => {
            newSpecs[key] = value;
          });
        }
        
        // Migrate GPU specs
        if (product.specs.gpu) {
          Object.entries(product.specs.gpu).forEach(([key, value]) => {
            newSpecs[key] = value;
          });
        }
        
        // Migrate RAM specs
        if (product.specs.ram) {
          Object.entries(product.specs.ram).forEach(([key, value]) => {
            newSpecs[key] = value;
          });
        }
        
        // Migrate Storage specs
        if (product.specs.storage) {
          Object.entries(product.specs.storage).forEach(([key, value]) => {
            newSpecs[key] = value;
          });
        }
        
        // Migrate Motherboard specs
        if (product.specs.motherboard) {
          Object.entries(product.specs.motherboard).forEach(([key, value]) => {
            newSpecs[key] = value;
          });
        }
        
        // Migrate Cooling specs
        if (product.specs.cooling) {
          Object.entries(product.specs.cooling).forEach(([key, value]) => {
            newSpecs[key] = value;
          });
        }
        
        try {
          // Update the product with flattened specs
          const updateResponse = await fetch(`/api/products/${product._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...product,
              specs: newSpecs,
            }),
          });
          
          if (updateResponse.ok) {
            migratedCount++;
          } else {
            errorCount++;
            console.error(`Failed to update product ${product._id}:`, await updateResponse.text());
          }
        } catch (error) {
          errorCount++;
          console.error(`Error updating product ${product._id}:`, error);
        }
      }
      
      setResults({
        success: migratedCount > 0,
        message: `Migration complete. ${migratedCount}/${products.length} products updated.`,
        details: errorCount > 0 ? `${errorCount} products failed to update.` : undefined,
      });
    } catch (error) {
      console.error("Error during migration:", error);
      setResults({
        success: false,
        message: "Migration failed",
        details: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Product Specs Migration</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Migrate Product Specs</CardTitle>
          <CardDescription>
            This utility will flatten the nested specs structure for all products.
            First fetch all products, then run the migration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Step 1: Fetch all products</h3>
              <Button 
                onClick={fetchProducts} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Fetch Products
              </Button>
              {products.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {products.length} products loaded
                </p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Step 2: Migrate product specs</h3>
              <Button 
                onClick={migrateProductSpecs} 
                disabled={isLoading || products.length === 0}
                variant="default"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start Migration
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {results && (
            <Alert variant={results.success ? "default" : "destructive"}>
              {results.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{results.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>
                {results.message}
                {results.details && (
                  <p className="text-sm mt-1">{results.details}</p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
