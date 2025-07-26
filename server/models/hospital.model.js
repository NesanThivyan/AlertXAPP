
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  departments: { type: String, required: true },
  beds: { type: Number, required: true },

  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending Approval'],
    default: 'Pending Approval'
  }
}, {
  timestamps: true
});

// Hash password before saving
hospitalSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Hospital', hospitalSchema);
;
