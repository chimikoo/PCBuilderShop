import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';

// POST /api/cart/items - Add item to cart
export async function POST(request) {
  try {
    const { userId, productId, quantity = 1 } = await request.json();
    
    if (!userId || !productId) {
      return NextResponse.json({ 
        error: 'User ID and Product ID are required' 
      }, { status: 400 });
    }
    
    await connectDB();
    
    // Find the product to get its details
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Check if product is in stock
    if (product.stock < quantity) {
      return NextResponse.json({ 
        error: 'Not enough items in stock' 
      }, { status: 400 });
    }
    
    // Find cart or create new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item if it doesn't exist
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        quantity,
        category: product.category
      });
    }
    
    await cart.save();
    
    return NextResponse.json({
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

// PATCH /api/cart/items - Update item quantity
export async function PATCH(request) {
  try {
    const { userId, productId, quantity } = await request.json();
    
    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json({ 
        error: 'User ID, Product ID, and quantity are required' 
      }, { status: 400 });
    }
    
    if (quantity < 0) {
      return NextResponse.json({ 
        error: 'Quantity must be a positive number' 
      }, { status: 400 });
    }
    
    await connectDB();
    
    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }
    
    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    
    return NextResponse.json({
      message: quantity === 0 ? 'Item removed from cart' : 'Item quantity updated',
      cart: {
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// DELETE /api/cart/items?userId=123&productId=456
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');
    
    if (!userId || !productId) {
      return NextResponse.json({ 
        error: 'User ID and Product ID are required' 
      }, { status: 400 });
    }
    
    await connectDB();
    
    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }
    
    // Find and remove item
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }
    
    cart.items.splice(itemIndex, 1);
    await cart.save();
    
    return NextResponse.json({
      message: 'Item removed from cart',
      cart: {
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}
