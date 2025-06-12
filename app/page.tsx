"use client";

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Zap, TrendingUp, Moon, Sun } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { CartDropdown } from "@/components/ui/cart/cart-dropdown"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import ProductModal from "@/components/ui/modal/product-modal-redesigned"
import { ProductCardSkeleton } from "@/components/ui/skeleton/product-card-skeleton"
import ProductCard from "@/app/products/_components/product-card"

import { useState, useEffect } from "react";

// Remove static featuredProducts array. We'll fetch from the API instead.


const categories = [
  { name: "CPUs", icon: "🔥", type: "CPU", href: "/products?type=CPU" },
  { name: "GPUs", icon: "⚡", type: "GPU", href: "/products?type=GPU" },
  { name: "Motherboards", icon: "🔧", type: "Motherboard", href: "/products?type=Motherboard" },
  { name: "RAM", icon: "💾", type: "RAM", href: "/products?type=RAM" },
  { name: "Storage", icon: "💿", type: "Storage", href: "/products?type=Storage" },
  { name: "Power Supply", icon: "⚡", type: "PSU", href: "/products?type=PSU" },
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const { cart } = useCart();
  
  // Handle opening the product modal
  const handleOpenModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

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

  // Fetch product counts by category
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const res = await fetch("/api/products?countByCategory=true");
        const data = await res.json();
        
        // Ensure all values are numbers
        const sanitizedData: Record<string, number> = {};
        Object.keys(data).forEach(key => {
          sanitizedData[key] = typeof data[key] === 'number' ? data[key] : 0;
        });
        
        console.log('Category counts:', sanitizedData);
        setCategoryCounts(sanitizedData);
      } catch (e) {
        console.error("Error fetching category counts:", e);
        setCategoryCounts({});
      }
    };
    fetchCategoryCounts();
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // State for weekly sale products and end date
  const [salesOfTheDay, setSalesOfTheDay] = useState<any[]>([]);
  const [saleEndDate, setSaleEndDate] = useState<Date>(new Date());
  const [saleLoading, setSaleLoading] = useState(true);
  
  // Fetch weekly sale products
  useEffect(() => {
    const fetchWeeklySale = async () => {
      setSaleLoading(true);
      try {
        const res = await fetch("/api/weekly-sales");
        const data = await res.json();
        
        console.log('Weekly sale data:', JSON.stringify(data));
        
        if (res.ok && data.products && Array.isArray(data.products) && data.products.length > 0) {
          // Sanitize products to ensure they're valid for rendering
          const sanitizedProducts = data.products.map((product: any) => {
            // Create a shallow copy of the product
            const sanitized = { ...product };
            
            // Keep the specs object and images array intact for proper rendering later
            // but ensure other complex objects are handled safely
            Object.keys(sanitized).forEach(key => {
              const value = sanitized[key];
              if (value === null || value === undefined) {
                sanitized[key] = '';
              } else if (typeof value === 'object' && key !== 'specs' && key !== 'images') {
                // Convert non-specs, non-images objects to strings to prevent direct rendering
                sanitized[key] = JSON.stringify(value);
              }
              // Leave specs and images as objects for proper handling in the rendering logic
            });
            
            return sanitized;
          });
          
          console.log('Sanitized products:', sanitizedProducts);
          setSalesOfTheDay(sanitizedProducts);
          
          if (data.sale && data.sale.endDate) {
            // Ensure the end date is properly parsed as a Date object
            let endDate;
            
            try {
              // Handle various date formats that might come from the API
              if (typeof data.sale.endDate === 'string') {
                endDate = new Date(data.sale.endDate);
              } else if (data.sale.endDate instanceof Date) {
                endDate = data.sale.endDate;
              } else if (typeof data.sale.endDate === 'object' && data.sale.endDate.$date) {
                // Handle MongoDB date format if it comes as an object with $date property
                endDate = new Date(data.sale.endDate.$date);
              } else {
                throw new Error('Unrecognized date format');
              }
              
              console.log('Sale end date from API:', endDate, 'Is valid date:', !isNaN(endDate.getTime()));
              
              // Validate the date is actually valid
              if (isNaN(endDate.getTime())) {
                throw new Error('Invalid date value');
              }
              
              // Make sure the end date is in the future
              const now = new Date();
              if (endDate > now) {
                setSaleEndDate(endDate);
                console.log('Using valid future end date:', endDate);
              } else {
                // If the end date from API is in the past, set a future date to avoid showing "Deal Expired"
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 7);
                setSaleEndDate(futureDate);
                console.log('End date was in the past, using fallback date:', futureDate);
              }
            } catch (error) {
              console.error('Error parsing end date:', error);
              // Use fallback date if parsing fails
              const fallbackDate = new Date();
              fallbackDate.setDate(fallbackDate.getDate() + 7);
              setSaleEndDate(fallbackDate);
              console.log('Error with end date, using fallback date:', fallbackDate);
            }
          } else {
            // Fallback end date
            const fallbackEndDate = new Date();
            fallbackEndDate.setDate(fallbackEndDate.getDate() + 7);
            setSaleEndDate(fallbackEndDate);
            console.log('No end date in API response, using fallback date:', fallbackEndDate);
          }
        } else {
          // Fallback to filtering products if no active weekly sale
          const filteredSales = products
            .filter(p => typeof p.discount === "number" && p.discount >= 10 && p.discount <= 30)
            .slice(0, 3)
            .map(product => {
              // Sanitize products
              const sanitized: any = {};
              Object.keys(product).forEach(key => {
                const value = product[key];
                if (value === null || value === undefined) {
                  sanitized[key] = '';
                } else if (typeof value === 'object') {
                  sanitized[key] = JSON.stringify(value);
                } else {
                  sanitized[key] = value;
                }
              });
              return sanitized;
            });
          
          console.log('Fallback filtered sales:', filteredSales);
          setSalesOfTheDay(filteredSales);
          
          // Create fallback end date (1 week from now)
          const fallbackEndDate = new Date();
          fallbackEndDate.setDate(fallbackEndDate.getDate() + 7);
          setSaleEndDate(fallbackEndDate);
        }
      } catch (e) {
        console.error("Error fetching weekly sale:", e);
        // Fallback to filtering products
        const filteredSales = products
          .filter(p => typeof p.discount === "number" && p.discount >= 10 && p.discount <= 30)
          .slice(0, 3)
          .map(product => {
            // Sanitize products
            const sanitized: any = {};
            Object.keys(product).forEach(key => {
              const value = product[key];
              if (value === null || value === undefined) {
                sanitized[key] = '';
              } else if (typeof value === 'object') {
                sanitized[key] = JSON.stringify(value);
              } else {
                sanitized[key] = value;
              }
            });
            return sanitized;
          });
        
        console.log('Error fallback sales:', filteredSales);
        setSalesOfTheDay(filteredSales);
        
        // Create fallback end date (1 week from now)
        const fallbackEndDate = new Date();
        fallbackEndDate.setDate(fallbackEndDate.getDate() + 7);
        setSaleEndDate(fallbackEndDate);
      } finally {
        setSaleLoading(false);
      }
    };
    
    fetchWeeklySale();
  }, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-950/80 dark:border-gray-800 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">PCBuilderShop</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Products
              </Link>
              <Link href="/deals" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Deals
              </Link>
              <Link href="/build-guide" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Build Guide
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="rounded-full"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              <div className="relative">
                <CartDropdown />
              </div>
              
              <Button size="sm">Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">Build Your Dream PC</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Premium computer parts at unbeatable prices. From gaming rigs to workstations, we've got everything you
              need.
            </p>
                        
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 bg-blue-700 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white">
                <Zap className="w-5 h-5 mr-2" />
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-blue-700 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-500 dark:hover:bg-blue-950/50">
                Build Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sales of the Day */}
      <section className="py-12 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold text-center mb-2 dark:text-gray-100">Sales of the Day</h2>
            <CountdownTimer endDate={saleEndDate} className="mb-4" />
          </div>
          <div className="flex justify-end mb-4">
            <Link href="/products?sale=true">
              <Button variant="link" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                View All <TrendingUp className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saleLoading ? (
              // Show skeleton loading when loading sales
              Array(3).fill(0).map((_, index) => (
                <div key={`sale-skeleton-${index}`} className="block h-full">
                  <ProductCardSkeleton />
                </div>
              ))
            ) : salesOfTheDay.length === 0 ? (
              <div className="text-center py-12 col-span-3 text-gray-500">No sales found today.</div>
            ) : (
              salesOfTheDay.map((product) => {
                // Debug logging for each product
                console.log('Rendering product:', product);
                
                // Safely extract primitive values to prevent rendering objects directly
                const safeProduct = {
                  _id: typeof product._id === 'object' ? JSON.stringify(product._id) : product._id,
                  name: typeof product.name === 'string' ? product.name : 'Product',
                  // Handle images correctly for all product types
                  image: (() => {
                    // Check if product has an image property directly
                    if (product.image && typeof product.image === 'string') {
                      return product.image;
                    }
                    // Check if product has images array
                    if (Array.isArray(product.images) && product.images.length > 0) {
                      return product.images[0];
                    }
                    // Use appropriate placeholder based on what's available
                    return '/placeholder.svg';
                  })(),
                  badge: typeof product.badge === 'string' ? product.badge : '',
                  discount: typeof product.discount === 'number' ? product.discount : 0,
                  category: typeof product.category === 'string' ? product.category : '',
                  brand: typeof product.brand === 'string' ? product.brand : '',
                  // Extract a clean description from specs if it's an object
                  specs: (() => {
                    if (typeof product.specs === 'string') return product.specs;
                    if (!product.specs) return '';
                    
                    try {
                      // Handle stringified JSON
                      const parsedSpecs = typeof product.specs === 'string' 
                        ? JSON.parse(product.specs) 
                        : product.specs;
                      
                      // Use flattened specs structure (post-migration)
                      
                      // Handle CPU products
                      if (product.category === 'CPU') {
                        const cores = parsedSpecs.cores || '';
                        const baseSpeed = parsedSpecs.baseClockSpeed || '';
                        const boostSpeed = parsedSpecs.boostClockSpeed || '';
                        const socket = parsedSpecs.socket || '';
                        
                        if (cores && baseSpeed) {
                          return `${cores} Cores | ${baseSpeed}${boostSpeed ? ` - ${boostSpeed}` : ''}`;
                        } else if (socket) {
                          return `Socket ${socket}`;
                        }
                      }
                      
                      // Handle GPU products
                      if (product.category === 'GPU') {
                        const memSize = parsedSpecs.memorySize || '';
                        const memType = parsedSpecs.memoryType || '';
                        const chipset = parsedSpecs.chipset || '';
                        
                        if (memSize && memType) {
                          return `${memSize} ${memType}${chipset ? ` | ${chipset}` : ''}`;
                        } else if (chipset) {
                          return chipset;
                        }
                      }
                      
                      // Handle RAM products
                      if (product.category === 'RAM') {
                        const capacity = parsedSpecs.capacity || '';
                        const type = parsedSpecs.type || '';
                        const speed = parsedSpecs.speed || '';
                        
                        if (capacity && type) {
                          return `${capacity} ${type}${speed ? ` | ${speed}` : ''}`;
                        }
                      }
                      
                      // Handle Storage products
                      if (product.category === 'Storage') {
                        const capacity = parsedSpecs.capacity || '';
                        const type = parsedSpecs.type || '';
                        
                        if (capacity) {
                          return `${capacity}${type ? ` ${type}` : ''}`;
                        }
                      }
                      
                      // Handle Motherboard products
                      if (product.category === 'Motherboard') {
                        const chipset = parsedSpecs.chipset || '';
                        const socket = parsedSpecs.socket || '';
                        
                        if (chipset && socket) {
                          return `${chipset} | Socket ${socket}`;
                        } else if (chipset) {
                          return chipset;
                        } else if (socket) {
                          return `Socket ${socket}`;
                        }
                      }
                      
                      // Generic fallbacks
                      if (parsedSpecs.memoryType) return `${parsedSpecs.memoryType} ${parsedSpecs.memorySize || ''}`;
                      if (parsedSpecs.capacity) return `${parsedSpecs.capacity} ${parsedSpecs.type || ''}`;
                      if (parsedSpecs.chipset) return `${parsedSpecs.chipset} | ${parsedSpecs.socket || ''}`;
                      
                      // Fallback: Return first non-object property if available
                      for (const key in parsedSpecs) {
                        const value = parsedSpecs[key];
                        if (typeof value !== 'object' || value === null) {
                          return String(value);
                        }
                      }
                    } catch (e) {
                      console.error('Error parsing specs:', e);
                    }
                    
                    return '';
                  })(),
                  description: typeof product.description === 'string' ? product.description : '',
                  price: typeof product.price === 'number' ? product.price : 0,
                  originalPrice: typeof product.originalPrice === 'number' ? product.originalPrice : null,
                };
                
                return (
                  <Card 
                    key={safeProduct._id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedProductId(product._id);
                      setIsModalOpen(true);
                    }}
                  >
                    <CardHeader className="relative">
                      {safeProduct.badge && (
                        <Badge variant="destructive" className="absolute top-2 left-2 z-10">
                          {safeProduct.badge}
                          {safeProduct.discount > 0 && ` -${safeProduct.discount}%`}
                        </Badge>
                      )}
                      <Image
                        src={safeProduct.image || "/placeholder.svg"}
                        alt={safeProduct.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{safeProduct.category}</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{safeProduct.brand}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">{safeProduct.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 min-h-[60px]">
                        {(() => {
                          try {
                            const specs = typeof product.specs === 'string' 
                              ? JSON.parse(product.specs) 
                              : product.specs;
                              
                            if (!specs) {
                              // Return placeholder description based on category
                              if (safeProduct.category === 'Storage') {
                                return `High-performance ${safeProduct.name} storage solution for your system needs.`;
                              }
                              if (safeProduct.category === 'Cooling') {
                                return `Advanced cooling solution to keep your components at optimal temperatures.`;
                              }
                              return safeProduct.description || 'Premium quality component for your PC build.';
                            }
                            
                            // Handle different product categories
                            if (safeProduct.category === 'CPU') {
                              const cores = specs.cores || '';
                              const baseSpeed = specs.baseClockSpeed || '';
                              const boostSpeed = specs.boostClockSpeed || '';
                              
                              if (cores && baseSpeed) {
                                return `${cores} Cores | ${baseSpeed}${boostSpeed ? ` - ${boostSpeed}` : ''}`;
                              }
                              return 'High-performance processor for gaming and productivity.';
                            }
                            
                            if (safeProduct.category === 'GPU') {
                              const memSize = specs.memorySize || '';
                              const memType = specs.memoryType || '';
                              const chipset = specs.chipset || '';
                              
                              if (memSize && memType) {
                                return `${memSize} ${memType}${chipset ? ` | ${chipset}` : ''}`;
                              } else if (chipset) {
                                return chipset;
                              }
                              return 'Powerful graphics card for gaming and content creation.';
                            }
                            
                            // Storage products
                            if (safeProduct.category === 'Storage') {
                              const capacity = specs.capacity || '';
                              const type = specs.type || '';
                              
                              if (capacity) {
                                return `${capacity}${type ? ` ${type}` : ''} storage for fast data access and ample space.`;
                              }
                              return `High-performance ${safeProduct.name} storage solution for your system needs.`;
                            }
                            
                            // Cooling products
                            if (safeProduct.category === 'Cooling') {
                              return `Advanced cooling solution to keep your components at optimal temperatures.`;
                            }
                            
                            // Generic fallbacks
                            if (specs.memoryType) return `${specs.memoryType} ${specs.memorySize || ''}`;
                            if (specs.capacity) return `${specs.capacity} ${specs.type || ''}`;
                            if (specs.chipset) return `${specs.chipset}`;
                          } catch (e) {
                            console.error('Error parsing specs:', e);
                          }
                          
                          return safeProduct.description || 'Premium quality component for your PC build.';
                        })()}
                      </p>
                      <div className="flex items-center mb-3">
                        {/* You can add rating/reviews if present in backend */}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-green-600">€{safeProduct.price}</span>
                          {safeProduct.originalPrice && (
                            <span className="text-lg text-gray-400 line-through">€{safeProduct.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-gray-100">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              // Show skeleton loading when loading
              Array(8).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="block h-full">
                  <ProductCardSkeleton />
                </div>
              ))
            ) : (
              // Show actual products when loaded
              products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} onOpenModal={handleOpenModal} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-100">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-center mb-2 dark:text-gray-100">Fast Shipping</CardTitle>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Get your products delivered in 1-3 business days with our express shipping options.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-center mb-2 dark:text-gray-100">Quality Products</CardTitle>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  We only sell high-quality products from trusted brands to ensure your satisfaction.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-center mb-2 dark:text-gray-100">Competitive Prices</CardTitle>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  We offer competitive prices on all our products to ensure you get the best value for your money.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PC</span>
                </div>
                <h3 className="text-xl font-bold">PCBuilderShop</h3>
              </div>
              <p className="text-gray-400">Your trusted partner for premium computer parts and components.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/products?type=CPU" className="hover:text-white transition-colors">
                    CPUs
                  </Link>
                </li>
                <li>
                  <Link href="/products?type=GPU" className="hover:text-white transition-colors">
                    Graphics Cards
                  </Link>
                </li>
                <li>
                  <Link href="/products?type=RAM" className="hover:text-white transition-colors">
                    Memory
                  </Link>
                </li>
                <li>
                  <Link href="/products?type=Storage" className="hover:text-white transition-colors">
                    Storage
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/warranty" className="hover:text-white transition-colors">
                    Warranty
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PCBuilderShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          productId={selectedProductId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
