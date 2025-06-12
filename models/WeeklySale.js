import mongoose from 'mongoose';

const saleProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 10,
    max: 50,
    validate: {
      validator: function(v) {
        return v >= 10 && v <= 50; // Discount between 10-50%
      },
      message: 'Discount must be between 10% and 50%'
    }
  }
});

const weeklySaleSchema = new mongoose.Schema({
  saleProducts: {
    type: [saleProductSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length <= 3; // Maximum 3 products on sale at a time
      },
      message: 'Weekly sale can have at most 3 products'
    }
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        // End date must be after start date
        return v > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  // Legacy field - now optional since we use per-product discounts
  discountPercentage: {
    type: Number,
    required: false,
    min: 10,
    max: 50
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for efficient queries
weeklySaleSchema.index({ startDate: 1, endDate: 1 });
weeklySaleSchema.index({ isActive: 1 });

// Static method to get the current active weekly sale
weeklySaleSchema.statics.getCurrentSale = async function() {
  const now = new Date();
  
  // Find a sale that is currently active (marked as active and current date is between start and end dates)
  const currentSale = await this.findOne({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
  
  return currentSale;
};

// Static method to get all weekly sales
weeklySaleSchema.statics.getAllSales = async function() {
  return await this.find().sort({ startDate: -1 });
};

// Static method to activate a sale and deactivate all others
weeklySaleSchema.statics.activateSale = async function(saleId) {
  // First deactivate all sales
  await this.updateMany({}, { isActive: false });
  
  // Then activate the specified sale
  const activatedSale = await this.findByIdAndUpdate(
    saleId,
    { isActive: true },
    { new: true }
  );
  
  return activatedSale;
};

// Static method to deactivate a sale
weeklySaleSchema.statics.deactivateSale = async function(saleId) {
  return await this.findByIdAndUpdate(
    saleId,
    { isActive: false },
    { new: true }
  );
};

// Static method to create a new weekly sale
weeklySaleSchema.statics.createWeeklySale = async function(saleProducts, durationDays = 7, makeActive = false) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationDays);
  
  // If this sale should be active, deactivate all other sales first
  if (makeActive) {
    await this.updateMany({}, { isActive: false });
  }
  
  // Create a new weekly sale
  const newSale = new this({
    saleProducts,
    startDate,
    endDate,
    isActive: makeActive
  });
  
  // Save the new sale
  await newSale.save();
  
  return newSale;
};

// Remove any validation for old schema fields that are no longer used
weeklySaleSchema.pre('validate', function(next) {
  // If using the new schema with saleProducts, we don't need the old discountPercentage field
  if (this.saleProducts && this.saleProducts.length > 0) {
    // Set a dummy value to satisfy any remaining validation
    this.set('discountPercentage', undefined, { strict: false });
  }
  next();
});

export default mongoose.models.WeeklySale || mongoose.model('WeeklySale', weeklySaleSchema);
