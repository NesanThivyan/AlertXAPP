// bookingController.js

import Booking from '../models/booking.model.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    try {
        const booking = await Booking.create({ 
            ...req.body, 
            user: req.user._id 
        });

        return res.status(201).json({ 
            success: true, 
            message: 'Booking created successfully.', 
            data: booking 
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: 'Failed to create booking.', 
            error: error.message 
        });
    }
};

// @desc    Update booking by ID
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findOneAndUpdate(
            { _id: id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found or unauthorized.' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Booking updated successfully.', 
            data: booking 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to update booking.', 
            error: error.message 
        });
    }
};

// @desc    Delete booking by ID
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findOneAndDelete({ 
            _id: id, 
            user: req.user._id 
        });

        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found or unauthorized.' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Booking cancelled successfully.' 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to delete booking.', 
            error: error.message 
        });
    }
};

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'name email');
        return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// @desc    Get booking by ID (admin only)
// @route   GET /api/bookings/:id
// @access  Private/Admin
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('user', 'name email');
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }
        return res.status(200).json({ success: true, data: booking });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};
