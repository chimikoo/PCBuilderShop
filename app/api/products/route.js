import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET(req) {
  await dbConnect();
  const url = new URL(req.url);
  const types = url.searchParams.get('types');
  const countByCategory = url.searchParams.get('countByCategory');
  
  // If requesting counts by category
  if (countByCategory === 'true') {
    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
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
  
  // Regular product filtering
  let filter = {};
  if (types) {
    filter.category = { $in: types.split(',') };
  }
  
  const products = await Product.find(filter);
  return new Response(JSON.stringify(products), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
