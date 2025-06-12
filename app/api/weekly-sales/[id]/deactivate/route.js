import dbConnect from '@/lib/dbConnect';
import WeeklySale from '@/models/WeeklySale';
import { NextResponse } from 'next/server';

// POST /api/weekly-sales/[id]/deactivate - Deactivate a specific weekly sale
export async function POST(req, { params }) {
  try {
    await dbConnect();
    
    // Properly await params before using its properties
    const { id } = await params;
    
    // Deactivate the sale
    const deactivatedSale = await WeeklySale.deactivateSale(id);
    
    if (!deactivatedSale) {
      return NextResponse.json({ 
        error: 'Weekly sale not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      message: 'Weekly sale deactivated successfully',
      sale: deactivatedSale
    }, { status: 200 });
  } catch (error) {
    console.error('Error deactivating weekly sale:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
