

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, ChevronDown, X, Star, Moon, Sun, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDropdown } from "@/components/ui/cart/cart-dropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInitialCategoryFromQuery } from "./useInitialCategoryFromQuery";
import ProductCard from "./_components/product-card";
import ProductModal from "@/components/ui/modal/product-modal-redesigned";

export default function Page() {
  // --- State variables for filters ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { cart } = useCart();
  
  // Set initial filter from ?type=... query param on mount
  useInitialCategoryFromQuery(setSelectedTypes);
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Apply theme change consistently
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  };
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<string>("relevance");

  // --- Modal state ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // First fetch all products
        let url = "/api/products";
        if (selectedTypes.length > 0) {
          url += `?types=${encodeURIComponent(selectedTypes.join(","))}`;
        }
        const productRes = await fetch(url);
        const productData = await productRes.json();
        
        // Then check if any products are part of an active weekly sale
        const saleResponse = await fetch('/api/weekly-sales');
        const saleData = await saleResponse.json();
        
        let finalProducts = productData;
        
        // If there's an active sale with products, update prices for those products
        if (saleResponse.ok && saleData.products && Array.isArray(saleData.products)) {
          // Create a map of sale products for quick lookup
          const saleProductsMap: Record<string, any> = {};
          saleData.products.forEach((saleProduct: any) => {
            if (saleProduct._id) {
              saleProductsMap[saleProduct._id.toString()] = saleProduct;
            }
          });
          
          // Update any products that are on sale
          finalProducts = productData.map((product: any) => {
            const productId = product._id.toString();
            const saleProduct = saleProductsMap[productId];
            
            if (saleProduct) {
              console.log(`Product ${product.name} is on sale:`, saleProduct);
              return {
                ...product,
                originalPrice: product.price,
                price: saleProduct.price,
                discount: saleProduct.discount,
                badge: saleProduct.badge || 'Sale'
              };
            }
            return product;
          });
        }
        
        setProducts(finalProducts);
      } catch (e) {
        console.error("Error fetching products:", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedTypes]);

  // --- Filtering and sorting logic ---
  const filteredProducts = useMemo(() => {
    // First apply all filters
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesBrand =
        selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));
      
      const matchesType =
        selectedTypes.length === 0 || (product.category && selectedTypes.includes(product.category));
      
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesBrand && matchesType && matchesPrice;
    });

    // Then apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        case "name-a-z":
          return a.name.localeCompare(b.name);
        case "name-z-a":
          return b.name.localeCompare(a.name);
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default: // relevance or any other value
          return 0; // Keep original order
      }
    });
  }, [products, searchTerm, selectedBrands, selectedTypes, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-950 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">PCBuilderShop</h1>
            </div>
            </Link>
            
            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 bg-gray-50 dark:bg-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Theme toggle */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {/* Cart dropdown from site-header will be used */}
              <CartDropdown />
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="w-full md:w-64 shrink-0">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {/* Price Range Filter */}
                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="min-price">Min Price: €{priceRange[0]}</Label>
                          <Input
                            id="min-price"
                            type="range"
                            min="0"
                            max="2000"
                            step="50"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          />
                        </div>
                        <div>
                          <Label htmlFor="max-price">Max Price: €{priceRange[1]}</Label>
                          <Input
                            id="max-price"
                            type="range"
                            min="0"
                            max="2000"
                            step="50"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Hardware Type Filter */}
                  <AccordionItem value="type">
              <AccordionTrigger>Hardware Type</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {[...new Set(products.map((product) => product.category))].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type}`} 
                        checked={selectedTypes.includes(type)} 
                        onCheckedChange={(checked) => {
                          setSelectedTypes((prev) => 
                            checked ? [...prev, type] : prev.filter((t) => t !== type)
                          );
                        }} 
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm font-normal">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Brand Filter - Dynamically filtered based on selected types */}
            <AccordionItem value="brand">
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full">
                  <span>Brand</span>
                  {selectedTypes.length > 0 && (
                    <span className="text-xs text-blue-600 font-normal">
                      Filtered for {selectedTypes.join(", ")}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {/* Get unique brands filtered by selected types */}
                  {[
                    ...new Set(
                      products
                        .filter(product => selectedTypes.length === 0 || selectedTypes.includes(product.category))
                        .map(product => product.brand)
                    )
                  ].sort().map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`brand-${brand}`} 
                        checked={selectedBrands.includes(brand)} 
                        onCheckedChange={(checked) => {
                          setSelectedBrands((prev) => 
                            checked ? [...prev, brand] : prev.filter((b) => b !== brand)
                          );
                        }} 
                      />
                      <Label htmlFor={`brand-${brand}`} className="text-sm font-normal">
                        {brand}
                        <span className="ml-1 text-xs text-gray-500">
                          ({products.filter(p => p.brand === brand && (selectedTypes.length === 0 || selectedTypes.includes(p.category))).length})
                        </span>
                      </Label>
                    </div>
                  ))}
                  {[
                    ...new Set(
                      products
                        .filter(product => selectedTypes.length === 0 || selectedTypes.includes(product.category))
                        .map(product => product.brand)
                    )
                  ].length === 0 && (
                    <div className="text-sm text-gray-500 italic">No brands available for the selected filters</div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Filter Summary */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Showing {filteredProducts.length} products
            </div>
            {(selectedTypes.length > 0 || selectedBrands.length > 0 || searchTerm || 
              (priceRange[0] > 0 || priceRange[1] < 2000)) && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedBrands([]);
                  setSelectedTypes([]);
                  setPriceRange([0, 2000]);
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>

            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          {/* Sort controls */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {selectedTypes.length > 0 ? selectedTypes.join(', ') : 'All Products'}
            </h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Products grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  onOpenModal={(productId: string) => {
                    setSelectedProductId(productId);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your filters or search term
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedBrands([]);
                  setSelectedTypes([]);
                  setPriceRange([0, 2000]);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          productId={selectedProductId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button variant="outline">&larr; Return to Frontpage</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
