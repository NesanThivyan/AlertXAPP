import MedicalDetails from '../models/medicalDetails.model.js';

export const createMedicalDetails = async (req, res) => {
  try {
    const { userId, ...medicalData } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Create new medical entry with user reference
    const newMedicalEntry = new MedicalDetails({
      user: userId,
      ...medicalData
    });

    const savedEntry = await newMedicalEntry.save();

    res.status(201).json({
      success: true,
      message: 'Medical details saved successfully',
      data: savedEntry
    });

  } catch (error) {
    console.error('Error saving medical details:', error);
    
    // Handle specific Mongoose errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to save medical details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getMedicalDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid medical record ID' });
    }

    const medicalDetails = await MedicalDetails.findById(id);

    if (!medicalDetails) {
      return res.status(404).json({ 
        success: false,
        message: 'Medical details not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: medicalDetails
    });

  } catch (error) {
    console.error('Error fetching medical details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medical details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};