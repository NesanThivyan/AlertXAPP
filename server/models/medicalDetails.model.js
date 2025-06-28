import mongoose from 'mongoose';

const medicalDetailsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // associate with user
  bloodGroup: { type: String, required: true, trim: true },
  allergies: { type: String, trim: true, default: "" },
  sugarLevel: { type: String, trim: true, default: "" },
  pressure: { type: String, trim: true, default: "" },
  weight: { type: String, trim: true, default: "" },
  treatments: { type: String, trim: true, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

medicalDetailsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const MedicalDetails = mongoose.model('MedicalDetails', medicalDetailsSchema);

export default MedicalDetails;