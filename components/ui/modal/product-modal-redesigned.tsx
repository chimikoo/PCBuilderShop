"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Star, Check } from "lucide-react";
import { AddToCartButton } from "@/components/ui/cart/add-to-cart-button";
import { Button } from "@/components/ui/button";
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
  const [randomReviewCount] = useState(Math.floor(Math.random() * 100) + 10); // Store random review count in state

  useEffect(() => {
    if (isOpen && productId) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          // First check if this product is part of an active weekly sale
          const saleResponse = await fetch('/api/weekly-sales');
          const saleData = await saleResponse.json();
          
          // Get the regular product data
          const productResponse = await fetch(`/api/products/${productId}`);
          if (!productResponse.ok) {
            throw new Error('Failed to fetch product');
          }
          const productData = await productResponse.json();
          
          // Check if this product is in the active sale
          let finalProductData = productData;
          
          if (saleResponse.ok && saleData.products && Array.isArray(saleData.products)) {
            // Find if this product is in the sale
            const saleProduct = saleData.products.find(
              (p: any) => p._id.toString() === productId.toString()
            );
            
            // If found in sale, use the sale price and discount information
            if (saleProduct) {
              console.log('Product found in active sale:', saleProduct);
              finalProductData = {
                ...productData,
                originalPrice: productData.price, // Store original price
                price: saleProduct.price, // Use discounted price
                discount: saleProduct.discount,
                badge: saleProduct.badge || 'Sale'
              };
            }
          }
          
          setProduct(finalProductData);
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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-5xl w-full mx-auto relative z-10 overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-2 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : !product ? (
          <div className="text-center p-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Product not found</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sorry, we couldn't find the product you're looking for.</p>
            <Button className="mt-6" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row max-h-[85vh]">
            {/* Product Images Section - Left Side */}
            <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 p-6 md:p-8 flex flex-col">
              {/* Main Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-white dark:bg-gray-700 mb-4">
                <Image
                  src={productImages[activeImage] || "/placeholder.svg"}
                  alt={product?.name || "Product image"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  {productImages.map((image: string, idx: number) => (
                    <button 
                      key={idx}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-600 ring-2 ring-blue-300' : 'border-transparent hover:border-gray-300'}`}
                      onClick={() => setActiveImage(idx)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details Section - Right Side */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[85vh] md:max-h-none flex flex-col">
              {/* Product Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs font-medium px-2 py-0.5">
                    {product.category}
                  </Badge>
                  {product.stock > 0 ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs font-medium px-2 py-0.5">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 text-xs font-medium px-2 py-0.5">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
                
                {/* Ratings */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.round(product.rating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating || 4.5} ({product.reviews?.length || randomReviewCount} reviews)
                  </span>
                </div>
                
                {/* Price */}
                <div className="mt-4">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    €{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                  </span>
                  {product.oldPrice && (
                    <span className="ml-2 text-lg text-gray-500 line-through">
                      €{typeof product.oldPrice === 'number' ? product.oldPrice.toFixed(2) : '0.00'}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Product Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Quantity</h2>
                <div className="flex items-center w-32 border border-gray-300 dark:border-gray-600 rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-l-md" 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center font-medium">{quantity}</div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-r-md" 
                    onClick={incrementQuantity}
                    disabled={!product || quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {product.stock > 0 ? `${product.stock} units available` : 'Currently out of stock'}
                </p>
              </div>
              
              {/* Add to Cart Button */}
              <AddToCartButton
                product={product}
                quantity={quantity}
                className="w-full h-12 text-base mb-6"
              />
              
              {/* Tabs for Specs & Reviews */}
              <Tabs defaultValue="specs" className="mt-6 flex-grow flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                {/* Specifications Tab */}
                <TabsContent value="specs" className="mt-4 flex-1 overflow-y-auto">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                    <div className="p-4">
                      <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100 mb-4">Technical Specifications</h3>
                      
                      <div className="prose dark:prose-invert max-w-none">
                        {product.description && (
                          <div className="mb-4">
                            <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                          </div>
                        )}
                        
                        {/* Features section */}
                        {product.features && product.features.length > 0 && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Features</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {typeof product.features === 'string' 
                                ? product.features.split('\n').map((feature: string, idx: number) => (
                                    <li key={idx} className="text-gray-600 dark:text-gray-400">{feature.trim()}</li>
                                  ))
                                : Array.isArray(product.features)
                                  ? product.features.map((feature: string, idx: number) => (
                                      <li key={idx} className="text-gray-600 dark:text-gray-400">{feature}</li>
                                    ))
                                  : null
                              }
                            </ul>
                          </div>
                        )}
                        
                        {/* Common product information */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Product Information</h4>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Category</td>
                                <td className="py-2 text-gray-600 dark:text-gray-400">{product.category || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Brand</td>
                                <td className="py-2 text-gray-600 dark:text-gray-400">{product.brand || 'N/A'}</td>
                              </tr>

                              <tr>
                                <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Product ID</td>
                                <td className="py-2 text-gray-600 dark:text-gray-400">{product.sku || product._id?.substring(0, 8) || 'N/A'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        {/* CPU-specific specifications */}
                        {product.category === 'CPU' && product.specs?.cpu && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">CPU Specifications</h4>
                            <table className="w-full">
                              <tbody>
                                {product.specs.cpu.cores && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Cores</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.cores}</td>
                                  </tr>
                                )}
                                {product.specs.cpu.threads && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Threads</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.threads}</td>
                                  </tr>
                                )}
                                {product.specs.cpu.baseClockSpeed && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Base Clock</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.baseClockSpeed}</td>
                                  </tr>
                                )}
                                {product.specs.cpu.boostClockSpeed && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Boost Clock</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.boostClockSpeed}</td>
                                  </tr>
                                )}
                                {product.specs.cpu.cache && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Cache</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.cache}</td>
                                  </tr>
                                )}
                                {product.specs.cpu.socket && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Socket</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.socket}</td>
                                  </tr>
                                )}
                                {product.specs.cpu.architecture && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Architecture</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.architecture}</td>
                                  </tr>
                                )}
                                {product.specs.cpu.lithography && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Lithography</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.lithography}</td>
                                  </tr>
                                )}
                                {product.specs.cpu.tdp && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">TDP</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.tdp}</td>
                                  </tr>
                                )}
                                {product.specs.cpu.integratedGraphics && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Integrated Graphics</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.integratedGraphics}</td>
                                  </tr>
                                )}
                                {product.specs.cpu.coolerIncluded !== undefined && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Cooler Included</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.cpu.coolerIncluded ? 'Yes' : 'No'}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        {/* GPU-specific specifications */}
                        {product.category === 'GPU' && product.specs?.gpu && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">GPU Specifications</h4>
                            <table className="w-full">
                              <tbody>
                                {product.specs.gpu.chipset && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Chipset</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.chipset}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.memorySize && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Memory Size</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.memorySize}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.memoryType && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Memory Type</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.memoryType}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.memoryBus && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Memory Bus</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.memoryBus}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.coreClock && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Core Clock</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.coreClock}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.boostClock && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Boost Clock</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.boostClock}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.cudaCores && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">CUDA Cores</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.cudaCores}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.streamProcessors && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Stream Processors</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.streamProcessors}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.rtCores && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">RT Cores</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.rtCores}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.tensorCores && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Tensor Cores</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.tensorCores}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.architecture && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Architecture</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.architecture}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.pciExpressInterface && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">PCIe Interface</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.pciExpressInterface}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.length && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Card Length</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.length}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.displayPorts !== undefined && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">DisplayPort</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.displayPorts}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.hdmiPorts !== undefined && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">HDMI</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.hdmiPorts}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.powerConnectors && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Power Connectors</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.powerConnectors}</td>
                                  </tr>
                                )}
                                {product.specs.gpu.recommendedPSU && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Recommended PSU</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.gpu.recommendedPSU}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        {/* RAM-specific specifications */}
                        {product.category === 'RAM' && product.specs?.ram && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">RAM Specifications</h4>
                            <table className="w-full">
                              <tbody>
                                {product.specs.ram.capacity && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Capacity</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.ram.capacity}</td>
                                  </tr>
                                )}
                                {product.specs.ram.type && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Type</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.ram.type}</td>
                                  </tr>
                                )}
                                {product.specs.ram.speed && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Speed</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.ram.speed}</td>
                                  </tr>
                                )}
                                {product.specs.ram.modules && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Modules</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.ram.modules}</td>
                                  </tr>
                                )}
                                {product.specs.ram.casLatency && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">CAS Latency</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.ram.casLatency}</td>
                                  </tr>
                                )}
                                {product.specs.ram.timing && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Timing</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.ram.timing}</td>
                                  </tr>
                                )}
                                {product.specs.ram.voltage && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Voltage</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.ram.voltage}</td>
                                  </tr>
                                )}
                                {product.specs.ram.profile && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Profile</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.ram.profile}</td>
                                  </tr>
                                )}
                                {product.specs.ram.heatSpreader !== undefined && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">Heat Spreader</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.ram.heatSpreader ? 'Yes' : 'No'}</td>
                                  </tr>
                                )}
                                {product.specs.ram.rgb !== undefined && (
                                  <tr>
                                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">RGB Lighting</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{product.specs.ram.rgb ? 'Yes' : 'No'}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                        

                        
                        {/* Additional product details if available */}
                        {product.details && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Additional Details</h4>
                            <p className="text-gray-700 dark:text-gray-300">{product.details}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-4 flex-1 overflow-y-auto">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Customer Reviews</h3>
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
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {product.rating || 4.5}/5
                        </span>
                      </div>
                    </div>
                    
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {product.reviews.map((review: any, idx: number) => (
                          <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 dark:text-gray-100">{review.name || `User${idx + 1}`}</span>
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
                            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{review.comment}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{review.date || 'Recent'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">John D.</span>
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
                          <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">Great product! Exactly what I needed for my setup.</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">2 weeks ago</span>
                        </div>
                        <div className="pb-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">Sarah M.</span>
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
                          <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">Good quality and fast shipping. Would buy again.</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">1 month ago</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
