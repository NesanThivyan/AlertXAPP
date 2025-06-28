import User from '../models/user.model.js';

// @desc    Update user medical details
// @route   POST /api/user/:id/medical
// @access  Private
export const updateUserMedical = async (req, res) => {
  try {
    const userId = req.params.id;
    const { bloodGroup, allergies, sugarLevel, pressure, weight, treatments } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the user's medical subdocument
  user.medical = {
  bloodGroup: bloodGroup || user.medical.bloodGroup,
  allergies: allergies || user.medical.allergies,
  sugarLevel: sugarLevel || user.medical.sugarLevel,
  pressure: pressure || user.medical.pressure,
  weight: weight || user.medical.weight,
  treatments: treatments || user.medical.treatments,
};
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Medical details updated successfully',
      medical: user.medical,
    });
  } catch (error) {
    console.error('Error updating medical details:', error);
    res.status(500).json({ success: false, message: 'Server Error updating medical details', error: error.message });
  }
};