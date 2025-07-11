// models/hospital.model.js
import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
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

export default mongoose.model('Hospital', hospitalSchema);
;
