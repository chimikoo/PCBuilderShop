import dbConnect from '@/lib/dbConnect';
import WeeklySale from '@/models/WeeklySale';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

// PUT /api/weekly-sales/[id] - Update a weekly sale
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // Properly await params before using its properties
    const { id } = await params;
    const body = await req.json();
    const { saleProducts, durationDays } = body;
    
    // Validate input
    if (!saleProducts || !Array.isArray(saleProducts) || saleProducts.length === 0 || saleProducts.length > 3) {
      return NextResponse.json({ 
        error: 'Please provide 1-3 valid products for the sale' 
      }, { status: 400 });
    }
    
    // Validate each sale product
    for (const product of saleProducts) {
      if (!product.productId) {
        return NextResponse.json({ 
          error: 'Each sale product must have a productId' 
        }, { status: 400 });
      }
      
      if (!product.discountPercentage || product.discountPercentage < 10 || product.discountPercentage > 50) {
        return NextResponse.json({ 
          error: 'Discount percentage must be between 10% and 50% for each product' 
        }, { status: 400 });
      }
    }
    
    // Extract product IDs for verification
    const productIds = saleProducts.map(item => item.productId);
    
    // Verify products exist
    const productsCount = await Product.countDocuments({
      _id: { $in: productIds }
    });
    
    if (productsCount !== productIds.length) {
      return NextResponse.json({ 
        error: 'One or more product IDs are invalid' 
      }, { status: 400 });
    }
    
    // Find the weekly sale
    const existingSale = await WeeklySale.findById(id);
    
    if (!existingSale) {
      return NextResponse.json({ 
        error: 'Weekly sale not found' 
      }, { status: 404 });
    }
    
    // Instead of using findByIdAndUpdate which triggers validation issues,
    // we'll manually update the document to have more control over the validation process
    
    // First, fetch the document
    const saleToUpdate = await WeeklySale.findById(id);
    if (!saleToUpdate) {
      return NextResponse.json({ 
        error: 'Weekly sale not found' 
      }, { status: 404 });
    }
    
    // Update the properties directly
    saleToUpdate.saleProducts = saleProducts;
    
    // Only update the end date if durationDays is provided
    if (durationDays) {
      // Calculate new end date based on the existing start date
      const newEndDate = new Date(saleToUpdate.startDate);
      newEndDate.setDate(newEndDate.getDate() + durationDays);
      saleToUpdate.endDate = newEndDate;
    }
    
    // Save the updated document
    const updatedSale = await saleToUpdate.save();
    
    return NextResponse.json({
      message: 'Weekly sale updated successfully',
      sale: updatedSale
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating weekly sale:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/weekly-sales/[id] - Get a specific weekly sale
export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    // Properly await params before using its properties
    const { id } = await params;
    
    const sale = await WeeklySale.findById(id);
    
    if (!sale) {
      return NextResponse.json({ 
        error: 'Weekly sale not found' 
      }, { status: 404 });
    }
    
    // Extract product IDs from sale products
    const productIds = sale.saleProducts.map(item => item.productId);
    
    // Fetch the products in the sale
    const products = await Product.find({
      _id: { $in: productIds }
    });
    
    // Create a map of product discounts for easy lookup
    const discountMap = {};
    sale.saleProducts.forEach(item => {
      discountMap[item.productId.toString()] = item.discountPercentage;
    });
    
    // Calculate discounted prices for each product
    const productsWithDiscount = products.map(product => {
      const originalPrice = product.price;
      const discountPercentage = discountMap[product._id.toString()];
      const discountedPrice = parseFloat((originalPrice * (1 - discountPercentage / 100)).toFixed(2));
      
      return {
        ...product.toObject(),
        originalPrice: originalPrice,
        price: discountedPrice,
        discount: discountPercentage,
        badge: "Sale"
      };
    });
    
    return NextResponse.json({
      sale: {
        _id: sale._id,
        startDate: sale.startDate,
        endDate: sale.endDate,
        saleProducts: sale.saleProducts
      },
      products: productsWithDiscount
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching weekly sale:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/weekly-sales/[id] - Delete or end a weekly sale
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    // Properly await params before using its properties
    const { id } = await params;
    
    const sale = await WeeklySale.findById(id);
    
    if (!sale) {
      return NextResponse.json({ 
        error: 'Weekly sale not found' 
      }, { status: 404 });
    }
    
    // Instead of deleting, mark as inactive
    sale.isActive = false;
    await sale.save();
    
    return NextResponse.json({
      message: 'Weekly sale ended successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error ending weekly sale:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
