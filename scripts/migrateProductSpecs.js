// Migration script to flatten product specs structure
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Use the MongoDB URI from the environment or fallback to a default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webshop';

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

async function migrateProductSpecs() {
  console.log('Starting product specs migration...');
  
  try {
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate`);
    
    let migratedCount = 0;
    
    for (const product of products) {
      // Skip if specs is not an object
      if (!product.specs || typeof product.specs !== 'object') {
        console.log(`Skipping product ${product._id}: No specs object found`);
        continue;
      }
      
      const newSpecs = { ...product.specs };
      
      // Migrate CPU specs
      if (product.specs.cpu) {
        console.log(`Migrating CPU specs for ${product.name}`);
        Object.entries(product.specs.cpu).forEach(([key, value]) => {
          newSpecs[key] = value;
        });
      }
      
      // Migrate GPU specs
      if (product.specs.gpu) {
        console.log(`Migrating GPU specs for ${product.name}`);
        Object.entries(product.specs.gpu).forEach(([key, value]) => {
          newSpecs[key] = value;
        });
      }
      
      // Migrate RAM specs
      if (product.specs.ram) {
        console.log(`Migrating RAM specs for ${product.name}`);
        Object.entries(product.specs.ram).forEach(([key, value]) => {
          newSpecs[key] = value;
        });
      }
      
      // Migrate Storage specs
      if (product.specs.storage) {
        console.log(`Migrating Storage specs for ${product.name}`);
        Object.entries(product.specs.storage).forEach(([key, value]) => {
          newSpecs[key] = value;
        });
      }
      
      // Migrate Motherboard specs
      if (product.specs.motherboard) {
        console.log(`Migrating Motherboard specs for ${product.name}`);
        Object.entries(product.specs.motherboard).forEach(([key, value]) => {
          newSpecs[key] = value;
        });
      }
      
      // Migrate Cooling specs
      if (product.specs.cooling) {
        console.log(`Migrating Cooling specs for ${product.name}`);
        Object.entries(product.specs.cooling).forEach(([key, value]) => {
          newSpecs[key] = value;
        });
      }
      
      // Update the product with flattened specs
      await Product.updateOne(
        { _id: product._id },
        { $set: { specs: newSpecs } }
      );
      
      migratedCount++;
      console.log(`Migrated product ${migratedCount}/${products.length}: ${product.name}`);
    }
    
    console.log(`Migration complete. ${migratedCount} products updated.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateProductSpecs();
