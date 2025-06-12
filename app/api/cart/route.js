import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';

// GET /api/cart?userId=123
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    await connectDB();
    
    let cart = await Cart.findOne({ userId });
    
    // If no cart exists for this user, create an empty one
    if (!cart) {
      cart = new Cart({
        userId,
        items: []
      });
      await cart.save();
    }
    
    return NextResponse.json({
      cart: {
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart
export async function POST(request) {
  try {
    const { userId, items } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    await connectDB();
    
    // Find cart or create new one
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    // Replace entire cart with new items
    if (items && Array.isArray(items)) {
      cart.items = items;
    }
    
    await cart.save();
    
    return NextResponse.json({
      cart: {
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE /api/cart?userId=123
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    await connectDB();
    
    // Find and delete the cart
    await Cart.findOneAndDelete({ userId });
    
    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
