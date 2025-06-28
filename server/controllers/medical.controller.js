import MedicalDetails from '../models/medicalDetails.model.js';

// Controller function to save medical details
export const createMedicalDetails = async (req, res) => {
  try {
    const medicalData = req.body;
    const newMedicalEntry = new MedicalDetails(medicalData);
    await newMedicalEntry.save();

    res.status(201).json({
      message: 'Medical details saved successfully',
      medicalDetails: newMedicalEntry
    });
  } catch (error) {
    console.error('Error saving medical details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller function to get medical details by ID
export const getMedicalDetailsById = async (req, res) => {
  try {
    const medicalId = req.params.id;
    const medicalDetails = await MedicalDetails.findById(medicalId);

    if (!medicalDetails) {
      return res.status(404).json({ message: 'Medical details not found' });
    }

    res.status(200).json(medicalDetails);
  } catch (error) {
    console.error('Error fetching medical details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};