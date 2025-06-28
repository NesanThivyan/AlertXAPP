// connectDB.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://srithivyanesan2002:0Oc4RauGqE8L3Ffc@cluster0.rufe3mm.mongodb.net/Alertx', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  }
};

export default connectDB;
