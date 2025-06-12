import dbConnect from '@/lib/dbConnect';
import WeeklySale from '@/models/WeeklySale';
import { NextResponse } from 'next/server';

// POST /api/weekly-sales/[id]/activate - Activate a specific weekly sale and deactivate all others
export async function POST(req, { params }) {
  try {
    await dbConnect();
    
    // Properly await params before using its properties
    const { id } = await params;
    
    // Activate the sale (this will also deactivate all other sales)
    const activatedSale = await WeeklySale.activateSale(id);
    
    if (!activatedSale) {
      return NextResponse.json({ 
        error: 'Weekly sale not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      message: 'Weekly sale activated successfully',
      sale: activatedSale
    }, { status: 200 });
  } catch (error) {
    console.error('Error activating weekly sale:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
