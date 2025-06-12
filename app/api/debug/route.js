import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    console.log('Debug API: Starting database connection test');
    
    // Get MongoDB URI (masking credentials)
    const mongoUri = process.env.MONGO_URI || 'Not set';
    const maskedUri = mongoUri.replace(/\/\/(.*)@/, '//***@');
    
    // Environment info
    const nodeEnv = process.env.NODE_ENV || 'Not set';
    const vercelEnv = process.env.VERCEL_ENV || 'Not deployed on Vercel';
    
    // Attempt database connection
    let dbStatus = 'Not attempted';
    let error = null;
    
    try {
      console.log('Debug API: Attempting database connection');
      await dbConnect();
      dbStatus = 'Connected successfully';
      console.log('Debug API: Database connection successful');
    } catch (err) {
      dbStatus = 'Connection failed';
      error = {
        message: err.message,
        name: err.name,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      };
      console.error('Debug API: Database connection failed', err);
    }
    
    // Return diagnostic information
    return NextResponse.json({
      status: 'ok',
      environment: {
        nodeEnv,
        vercelEnv,
        isVercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || 'Not on Vercel'
      },
      database: {
        uri: maskedUri,
        status: dbStatus,
        error: error
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Debug API: Unexpected error', err);
    return NextResponse.json({
      status: 'error',
      message: err.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
