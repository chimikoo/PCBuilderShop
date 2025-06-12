import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  try {
    // Ensure we properly extract the ID parameter
    const { params } = context;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await dbConnect();
    
    // Add error handling for invalid ObjectId
    let product;
    try {
      product = await Product.findById(id);
    } catch (error) {
      console.error('Error finding product:', error);
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in product API route:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    // Get the ID from params
    const { params } = context;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    // Parse the request body
    const body = await req.json();
    
    await dbConnect();
    
    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
