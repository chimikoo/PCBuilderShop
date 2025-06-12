import dbConnect from '@/lib/dbConnect';
import WeeklySale from '@/models/WeeklySale';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

// GET /api/weekly-sales - Get current weekly sale products
export async function GET(req) {
  try {
    await dbConnect();
    
    // Get the current active weekly sale
    const currentSale = await WeeklySale.getCurrentSale();
    
    if (!currentSale) {
      return NextResponse.json({ 
        sale: null,
        products: [],
        message: "No active weekly sale found" 
      }, { status: 404 });
    }
    
    // Extract product IDs from sale products
    const productIds = currentSale.saleProducts.map(item => item.productId);
    
    // Fetch the products in the sale
    const products = await Product.find({
      _id: { $in: productIds }
    });
    
    // Create a map of product discounts for easy lookup
    const discountMap = {};
    currentSale.saleProducts.forEach(item => {
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
        _id: currentSale._id,
        startDate: currentSale.startDate,
        endDate: currentSale.endDate,
        saleProducts: currentSale.saleProducts
      },
      products: productsWithDiscount
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching weekly sale:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/weekly-sales - Create a new weekly sale
export async function POST(req) {
  try {
    await dbConnect();
    
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
    
    // Extract product IDs for verification and convert string IDs to ObjectId if needed
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
    
    // Prepare the sale data directly instead of using the static method
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (durationDays || 7));
    
    // Deactivate any current active sales
    await WeeklySale.updateMany(
      { endDate: { $gte: startDate }, isActive: true },
      { isActive: false }
    );
    
    // Create the sale directly to have more control over the structure
    const newSale = await WeeklySale.create({
      saleProducts: saleProducts,
      startDate,
      endDate,
      isActive: true
    });
  
    return NextResponse.json({
      message: 'Weekly sale created successfully',
      sale: newSale
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating weekly sale:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
