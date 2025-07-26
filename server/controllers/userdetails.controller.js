// Example: In your backend's user controller file (e.g., controllers/user.controller.js)

import User from '../models/user.model.js'; // Assuming your Mongoose User model is defined here

// @desc    Update user details
// @route   POST /api/users/:id/details
// @access  Private (requires authentication, e.g., via 'protect' middleware)
export const updateUserDetails = async (req, res) => {
    try {
        // Get the user ID from the URL parameters (e.g., /api/users/123/details, so id is '123')
        const userId = req.params.id;
        // Extract the user details sent from the frontend form in the request body
        // Ensure these fields match what your frontend (UserDetailsScreen) sends in its 'form' state
        const { name, age, place, phone, nic, work } = req.body;

        // Optional: Security check - ensure authenticated user can only update their own details.
        // This assumes your 'protect' middleware adds the authenticated user's ID to 'req.user.id'.
        // If you enable this, the user making the request must have an ID that matches the :id in the URL.
        // if (req.user && req.user.id !== userId) {
        //     return res.status(403).json({ success: false, message: 'Not authorized to update this user' });
        // }

        // Find the user by ID in the database
        const user = await User.findById(userId);

        // If no user is found with the given ID, return a 404 Not Found error
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update the user's fields with the new data from the request body.
        // Using '|| user.fieldName' ensures that if a field is not provided in the request,
        // its existing value in the database is retained, rather than being set to undefined/null.
        user.name = name || user.name; // This 'name' refers to the full name collected in UserDetailsScreen
        user.age = age || user.age;
        user.place = place || user.place;
        user.phone = phone || user.phone;
        user.nic = nic || user.nic;
        user.work = work || user.work;

        // Save the updated user document to the database
        await user.save();

        // Send a success response (HTTP status 200 OK)
        res.status(200).json({
            success: true,
            message: 'User details updated successfully',
            // Optionally, send back the updated user object or specific fields
            user: {
                id: user._id, // MongoDB's default ID field
                email: user.email,
                name: user.name,
                age: user.age,
                place: user.place,
                phone: user.phone,
                nic: user.nic,
                work: user.work,
                // Add any other relevant user fields you want the frontend to receive
            }
        });

    } catch (error) {
        // Log the detailed error for backend debugging purposes
        console.error('Error updating user details:', error);
        // Send a 500 Internal Server Error for any unexpected server-side issues
        res.status(500).json({ success: false, message: 'Server Error updating user details', error: error.message });
    }
};
// @desc    Get full user details (for admin)
// @route   GET /api/users/:id/details
// @access  Private (Admin only)
export const getUserDetailsByAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                age: user.age,
                place: user.place,
                phone: user.phone,
                nic: user.nic,
                work: user.work,
                medicalDetails: user.medical ? {
                    bloodGroup: user.medical.bloodGroup || '',
                    pressure: user.medical.pressure || '',
                    sugarLevel: user.medical.sugarLevel || ''
                } : null,
                guardian: user.guardian ? {
                    name: user.guardian.name || '',
                    phone: user.guardian.phone || '',
                    relationship: user.guardian.relationship || ''
                } : null
            }
        });
    } catch (error) {
        console.error("Admin failed to fetch user details:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
