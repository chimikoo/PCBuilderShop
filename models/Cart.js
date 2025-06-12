import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  category: {
    type: String,
    required: true
  }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
CartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for total price
CartSchema.virtual('total').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

// Virtual for total items count
CartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((count, item) => {
    return count + item.quantity;
  }, 0);
});

// Check if model already exists to prevent overwrite during hot reloading
const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

export default Cart;
