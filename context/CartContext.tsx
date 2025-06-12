"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Define the cart item type
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

// Define the cart context type
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
  syncWithServer: (userId: string) => Promise<void>;
  prepareForCheckout: () => Promise<{ success: boolean; error?: string; checkoutUrl?: string }>;
}

// Create the cart context with default values
const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
  cartCount: 0,
  isLoading: false,
  syncWithServer: async () => {},
  prepareForCheckout: async () => ({ success: false }),
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart from localStorage (if available)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const router = useRouter();

  // Load cart from localStorage on initial render (client-side only)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Calculate cart total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setCartTotal(total);
      
      // Calculate cart count (total number of items)
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  // Add a product to the cart
  const addToCart = (product: any, quantity: number = 1) => {
    setCart(prevCart => {
      // Check if the product is already in the cart
      const existingItemIndex = prevCart.findIndex(item => item._id === product._id);
      
      if (existingItemIndex >= 0) {
        // Product exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Product doesn't exist, add new item
        return [...prevCart, {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image || '/placeholder.png',
          quantity: quantity,
          category: product.category
        }];
      }
    });
  };

  // Remove a product from the cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  // Update the quantity of a product in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Sync cart with server (for logged-in users)
  const syncWithServer = useCallback(async (userId: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // First, get the current server cart
      const response = await fetch(`/api/cart?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok && data.cart) {
        // If server cart is empty but local cart has items, push local cart to server
        if (data.cart.items.length === 0 && cart.length > 0) {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              items: cart.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                category: item.category
              }))
            })
          });
        } 
        // If server cart has items, merge with local cart
        else if (data.cart.items.length > 0) {
          // Convert server items to match our CartItem structure
          const serverItems = data.cart.items.map((item: any) => ({
            _id: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            category: item.category
          }));
          
          // Merge server items with local cart
          const mergedCart = [...cart];
          
          serverItems.forEach((serverItem: CartItem) => {
            const localItemIndex = mergedCart.findIndex(item => item._id === serverItem._id);
            
            if (localItemIndex >= 0) {
              // Item exists in both, take the higher quantity
              mergedCart[localItemIndex].quantity = Math.max(
                mergedCart[localItemIndex].quantity,
                serverItem.quantity
              );
            } else {
              // Item only on server, add to local cart
              mergedCart.push(serverItem);
            }
          });
          
          // Update local cart with merged cart
          setCart(mergedCart);
          
          // Update server with merged cart
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              items: mergedCart.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                category: item.category
              }))
            })
          });
        }
      }
    } catch (error) {
      console.error('Failed to sync cart with server:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  // Prepare cart for checkout (future Stripe integration)
  const prepareForCheckout = async () => {
    try {
      // This is where we would integrate with Stripe
      // For now, we'll just return a success status
      // In the future, this would create a Stripe checkout session
      
      // Example of what this would look like with Stripe:
      // const response = await fetch('/api/checkout/create-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items: cart })
      // });
      // const data = await response.json();
      // if (data.url) {
      //   router.push(data.url);
      //   return { success: true, checkoutUrl: data.url };
      // }
      
      // For now, just redirect to a checkout page
      router.push('/checkout');
      return { success: true };
    } catch (error) {
      console.error('Error preparing for checkout:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to prepare for checkout' 
      };
    }
  };

  // Provide the cart context to children components
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isLoading,
      syncWithServer,
      prepareForCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
}
