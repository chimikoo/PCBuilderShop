import dbConnect from '@/lib/dbConnect';
import WeeklySale from '@/models/WeeklySale';
import { NextResponse } from 'next/server';

// GET /api/weekly-sales/all - Get all weekly sales
export async function GET(req) {
  try {
    await dbConnect();
    
    // Get all weekly sales, sorted by start date (newest first)
    const allSales = await WeeklySale.getAllSales();
    
    return NextResponse.json({ 
      sales: allSales
    });
  } catch (error) {
    console.error('Error fetching weekly sales:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
