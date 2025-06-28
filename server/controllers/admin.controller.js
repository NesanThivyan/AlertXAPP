// userController.js

import User from '../models/user.model.js';
import Caretaker from '../models/caretaker.model.js';

// --- User Management ---

// @desc    Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Update a user's role
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User role updated', data: user });
    } catch (error) {
        res.status(422).json({ success: false, message: 'Validation failed', error: error.message });
    }
};

// --- Caretaker Management ---

// @desc    Get all caretakers
export const getAllCaretakers = async (req, res) => {
    try {
        const caretakers = await Caretaker.find();
        res.status(200).json({ success: true, data: caretakers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Add a caretaker
export const addCaretaker = async (req, res) => {
    try {
        const caretaker = await Caretaker.create(req.body);
        res.status(201).json({ success: true, message: 'Caretaker added', data: caretaker });
    } catch (error) {
        res.status(422).json({ success: false, message: 'Validation failed', error: error.message });
    }
};

// @desc    Update a caretaker
export const updateCaretaker = async (req, res) => {
    try {
        if (req.body?.status && !['active', 'inactive'].includes(req.body.status)) {
            return res.status(422).json({ success: false, message: 'Invalid status value' });
        }

        const caretaker = await Caretaker.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!caretaker) {
            return res.status(404).json({ success: false, message: 'Caretaker not found' });
        }

        res.status(200).json({ success: true, message: 'Caretaker updated', data: caretaker });
    } catch (error) {
        console.error(error);
        res.status(422).json({ success: false, message: 'Validation failed', error: error.message });
    }
};

// @desc    Delete a caretaker
export const deleteCaretaker = async (req, res) => {
    try {
        const caretaker = await Caretaker.findByIdAndDelete(req.params.id);
        if (!caretaker) {
            return res.status(404).json({ success: false, message: 'Caretaker not found' });
        }
        res.status(200).json({ success: true, message: 'Caretaker deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
