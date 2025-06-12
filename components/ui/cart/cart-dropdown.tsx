"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';

export function CartDropdown() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="font-medium text-lg">Your cart is empty</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Add some products to your cart to see them here.
              </p>
              <SheetClose asChild>
                <Button asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item._id} className="flex items-start py-2 border-b">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted mr-4 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-muted-foreground text-xs">{item.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="font-medium">€{item.price.toFixed(2)}</div>
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-base font-medium">
                <span>Subtotal</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
