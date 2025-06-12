"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ShoppingCart, Plus, Minus, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ productId, isOpen, onClose }: ProductModalProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (isOpen && productId) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/products/${productId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [productId, isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle quantity changes
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Prepare product images
  const productImages = product?.images && product.images.length > 0 
    ? product.images 
    : [(product?.image || "/placeholder.svg")];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose}></div>
      <Card className="max-w-4xl w-full mx-auto relative z-10 overflow-hidden bg-white">
        <div className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : !product ? (
            <div className="text-center p-8">
              <h2 className="text-xl font-bold">Product not found</h2>
              <Button className="mt-4" onClick={onClose}>Close</Button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              {/* Product Images */}
              <div className="w-full md:w-1/2 p-6 bg-white border-r border-gray-200">
                <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                  <Image
                    src={productImages[activeImage] || "/placeholder.svg"}
                    alt={product?.name || "Product image"}
                    fill
                    className="object-contain"
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                {productImages.length > 1 && (
                  <div className="flex overflow-x-auto space-x-2 pb-2">
                    {productImages.map((image: string, idx: number) => (
                      <div 
                        key={idx}
                        className={`relative w-16 h-16 flex-shrink-0 cursor-pointer border-2 rounded ${activeImage === idx ? 'border-blue-600' : 'border-transparent'}`}
                        onClick={() => setActiveImage(idx)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="w-full md:w-1/2 p-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.round(product.rating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.rating || 4.5} ({product.reviews || Math.floor(Math.random() * 100) + 10} reviews)
                    </span>
                  </div>
                </div>
                
                <div className="my-4 pb-4 border-b border-gray-200">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-bold text-blue-600">
                        €{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                      </span>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">{product.category}</Badge>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm">
                        {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Brand: {product.brand || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div className="my-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center w-32 border border-gray-300 rounded-md">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none" 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="flex-1 text-center">{quantity}</div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none" 
                      onClick={incrementQuantity}
                      disabled={!product || quantity >= product.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="my-4 pb-4 border-b border-gray-200">
                  <p className="text-gray-700">
                    {product.description || 'No description available.'}
                  </p>
                </div>
                
                {/* Specifications and Reviews Tabs */}
                <Tabs defaultValue="specs" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  {/* Specifications Tab */}
                  <TabsContent value="specs" className="mt-2">
                    <div className="border rounded-md overflow-hidden">
                      {product.specs && Object.entries(product.specs || {}).length > 0 ? (
                        Object.entries(product.specs || {}).map(([key, value], index) => (
                          <div 
                            key={key} 
                            className={`grid grid-cols-2 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                          >
                            <span className="text-sm font-medium text-gray-700 p-3 border-r">{key}</span>
                            <span className="text-sm p-3">{String(value)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4">
                          <h3 className="font-medium">Technical Specifications</h3>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="text-sm font-medium">Category:</span>
                              <span className="text-sm ml-2">{product.category || 'N/A'}</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="text-sm font-medium">Brand:</span>
                              <span className="text-sm ml-2">{product.brand || 'N/A'}</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="text-sm font-medium">Stock:</span>
                              <span className="text-sm ml-2">{product.stock || 0} units</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="text-sm font-medium">SKU:</span>
                              <span className="text-sm ml-2">{product.sku || product._id?.substring(0, 8) || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Features Tab */}
                  <TabsContent value="features" className="mt-2">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Product Features</h3>
                      {product.features && product.features.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {product.features.map((feature: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700">{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-gray-500">Key features of {product.name}:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li className="text-sm">High quality {product.category}</li>
                            <li className="text-sm">Made by {product.brand || 'a trusted manufacturer'}</li>
                            <li className="text-sm">Excellent performance and reliability</li>
                            <li className="text-sm">Compatible with standard systems</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="mt-2">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Customer Reviews</h3>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < Math.round(product.rating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">
                            {product.rating || 4.5}/5
                          </span>
                        </div>
                      </div>
                      
                      {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-4">
                          {product.reviews.map((review: any, idx: number) => (
                            <div key={idx} className="border-b pb-3">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{review.name || `User${idx + 1}`}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm mt-1">{review.comment}</p>
                              <span className="text-xs text-gray-500 mt-1">{review.date || 'Recent'}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="border-b pb-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">John D.</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    className={i < 5 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm mt-1">Great product! Exactly what I needed for my setup.</p>
                            <span className="text-xs text-gray-500 mt-1">2 weeks ago</span>
                          </div>
                          <div className="border-b pb-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Sarah M.</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm mt-1">Good quality and fast shipping. Would buy again.</p>
                            <span className="text-xs text-gray-500 mt-1">1 month ago</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6">
                  <Button 
                    className="w-full h-12 text-base" 
                    disabled={product.stock <= 0}
                    onClick={() => alert(`Added ${quantity} ${product.name} to cart`)}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.stock > 0 ? `Add to Cart (${quantity})` : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
