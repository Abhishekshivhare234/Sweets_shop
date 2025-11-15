import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'product name is required'], minlength: 3, maxlength: 50 },
  price: { type: Number, required: [true, 'price is required'], min: 0 },
  description: { type: String, maxlength: 500 },
  stock: { type: Number, default: 0, min: 0 },
  category: { type: String, required: [true, 'category is required'] },
  image: { type: String },
  addedby:{type:String,default:"Admin"},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Product', productSchema);