"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Redirect to products page if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      router.push('/products');
    }
  }, [cart, router, isSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="container max-w-4xl py-12">
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              <CardTitle>Order Confirmed!</CardTitle>
            </div>
            <CardDescription>
              Thank you for your purchase. Your order has been received and is being processed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We've sent a confirmation email to <span className="font-medium">{formData.email}</span>.
              You'll receive another email when your order ships.
            </p>
            <div className="flex justify-center py-6">
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
              <CardDescription>
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                    <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-medium">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>€0.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>€{(cartTotal * 0.21).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>€{(cartTotal + cartTotal * 0.21).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full text-center text-sm text-muted-foreground">
                <p>Payment processing coming soon with Stripe</p>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Checkout Form */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Enter your details to complete your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData.city}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input 
                      id="postalCode" 
                      name="postalCode" 
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    name="country" 
                    value={formData.country}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="pt-4 flex flex-col space-y-4">
                  <div className="flex items-center p-4 border rounded-md bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      This is a demo checkout. No real payment will be processed.
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Order'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <Link href="/products">Return to Shopping</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
