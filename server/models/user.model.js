import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import e from 'express';

const GuardianSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  phone: { type: String, trim: true },
  relationship: { type: String, trim: true },
  email: { type: String, trim: true },
  address: { type: String, trim: true }
}, { _id: false });

const MedicalSchema = new mongoose.Schema({
  bloodGroup: { type: String, trim: true },
  allergies: { type: String, trim: true, default: "" },      // changed to String
  sugarLevel: { type: String, trim: true, default: "" },     // added
  pressure: { type: String, trim: true, default: "" },       // added
  weight: { type: String, trim: true, default: "" },         // added
  treatments: { type: String, trim: true, default: "" }      // added
}, { _id: false });
const UserDetailsSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: "" },
  age: { type: Number, min: 0, max: 150 },
  place: { type: String, trim: true, default: "" },
  phone: { type: String, trim: true, default: "" },
  nic: { type: String, trim: true, default: "" },
  work: { type: String, trim: true, default: "" }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'caretaker', 'superadmin', 'hospital'],
    default: 'user'
  },
  medical: MedicalSchema,
  guardian: GuardianSchema,
  details: UserDetailsSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate signed JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export default mongoose.model('User', UserSchema);