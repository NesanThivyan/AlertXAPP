// alertController.js

import Alert from '../models/alert.model.js';
import User from '../models/user.model.js';

// @desc    Create alert
export const createAlert = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const alert = await Alert.create({
            ...req.body,
            user: req.user._id,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone
        });

        res.status(201).json({ success: true, message: 'Alert sent', data: alert });
    } catch (error) {
        res.status(422).json({ success: false, message: 'Missing required data', error: error.message });
    }
};

// @desc    Get all alerts (Admin only)
export const getAlerts = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const alerts = await Alert.find().populate('user');
        res.status(200).json({ success: true, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get specific alert by ID
export const getAlertById = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        if (!alert) {
            return res.status(404).json({ success: false, message: 'Alert not found' });
        }
        res.status(200).json({ success: true, data: alert });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid alert ID', error: error.message });
    }
};

// @desc    Update alert status (Admin only)
export const updateAlertStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const { status } = req.body;
        if (!['active', 'resolved'].includes(status)) {
            return res.status(422).json({ success: false, message: 'Invalid status value' });
        }

        const alert = await Alert.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!alert) {
            return res.status(404).json({ success: false, message: 'Alert not found' });
        }

        res.status(200).json({ success: true, message: 'Status updated', data: alert });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
