import Hospital from '../models/hospital.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';

// @desc    Create a new hospital
// @route   POST /api/hospitals
// @access  Admin
export const createHospital = async (req, res) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.status(201).json({ success: true, data: hospital });
    } catch (error) {
        res.status(422).json({ success: false, message: 'Validation failed', error: error.message });
    }
};

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
export const getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json({ success: true, data: hospitals });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get single hospital
// @route   GET /api/hospitals/:id
// @access  Public
export const getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }
        res.status(200).json({ success: true, data: hospital });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid hospital ID', error: error.message });
    }
};

// @desc    Update hospital
// @route   PUT /api/hospitals/:id
// @access  Admin
export const updateHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }

        res.status(200).json({ success: true, message: 'Hospital updated', data: hospital });
    } catch (error) {
        res.status(422).json({ success: false, message: 'Validation failed', error: error.message });
    }
};

// @desc    Delete hospital
// @route   DELETE /api/hospitals/:id
// @access  Admin
export const deleteHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }
        res.status(200).json({ success: true, message: 'Hospital deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Change hospital role
// @route   PUT /api/hospitals/:id/role
// @access  Admin
export const changeHospitalRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['hospital', 'admin'].includes(role)) {
            return res.status(422).json({ success: false, message: 'Invalid role value' });
        }

        const hospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        );

        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }

        const token = jwt.sign({ id: hospital._id, role: hospital.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            success: true,
            message: 'Hospital role updated',
            token,
            data: hospital
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Hospital signup
// @route   POST /api/hospitals/signup
// @access  Public
export const hospitalSignup = async (req, res) => {
    try {
        const { name, address, phone, email, password, location } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const hospital = await Hospital.create({
            name,
            address,
            phone,
            email,
            password: hashedPassword,
            location,
            role: 'hospital'
        });

        const token = jwt.sign({ id: hospital._id, role: hospital.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ success: true, token, data: hospital });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Hospital signin
// @route   POST /api/hospitals/signin
// @access  Public
export const hospitalSignin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const hospital = await Hospital.findOne({ email }).select('+password');
        if (!hospital) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, hospital.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is missing from environment variables');
        }

        const token = jwt.sign({ id: hospital._id, role: hospital.role }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        const { password: _, ...hospitalData } = hospital._doc;

        res.status(200).json({
            success: true,
            message: 'Signin successful',
            token,
            data: hospitalData
        });

    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
