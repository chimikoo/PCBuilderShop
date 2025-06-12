import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    console.log('API: Connecting to database...');
    await dbConnect();
    console.log('API: Database connected successfully');
    
    const url = new URL(req.url);
    const types = url.searchParams.get('types');
    const countByCategory = url.searchParams.get('countByCategory');
    
    console.log('API: Query params:', { types, countByCategory });
  
  // If requesting counts by category
  if (countByCategory === 'true') {
    console.log('API: Fetching category counts...');
    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('API: Category counts result:', counts);
    
    // Convert to a more usable format
    const countMap = {};
    counts.forEach(item => {
      countMap[item._id] = item.count;
    });
    
    return new Response(JSON.stringify(countMap), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Filter by types if provided
  let query = {};
  if (types) {
    const typeArray = types.split(',');
    query.category = { $in: typeArray };
    console.log('API: Filtering by categories:', typeArray);
  }
  
  console.log('API: Fetching products with query:', JSON.stringify(query));
  const products = await Product.find(query);
  console.log(`API: Found ${products.length} products`);
  
  return new Response(JSON.stringify(products), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  } catch (error) {
    console.error('API Error in products route:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
