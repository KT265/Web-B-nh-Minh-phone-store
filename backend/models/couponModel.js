import mongoose from 'mongoose';

const couponSchema = mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    trim: true 
  },
  discount: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  }, 
  expirationDate: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;