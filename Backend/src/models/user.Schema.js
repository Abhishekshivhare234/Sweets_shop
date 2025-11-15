import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'name is required'], minlength: 3, maxlength: 30 },
  email: { type: String, required: [true, 'email is required'], unique: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please provide a valid email'] },
  password: { type: String, required: [true, 'password is required'], minlength: 6 },
  role: { type: String,default: 'customer'},
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);