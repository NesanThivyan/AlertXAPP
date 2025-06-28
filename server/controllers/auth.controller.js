import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Input validation: Check for missing fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter all fields.' });
        }

        // Check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

        // Create the new user
        const user = await User.create({ name, email, password, role });

        // Send a successful token response (status 201 Created)
        sendTokenResponse(user, 201, res);

    } catch (error) {
        // Log the server error for debugging
        console.error('Signup error:', error);
        // Send a 500 Internal Server Error for unexpected issues
        res.status(500).json({ success: false, message: 'Server Error during registration', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation: Check for missing email or password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter email and password' });
        }

        // Find user by email and include password for comparison
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            // User not found
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if the provided password matches the stored hashed password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            // Passwords do not match
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Send a successful token response (status 200 OK)
        sendTokenResponse(user, 200, res);

    } catch (error) {
        // Log and send 500 for server errors during login
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server Error during login', error: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
    // Check if token cookie exists
    if (!req.cookies.token) {
        return res.status(401).json({ success: false, message: 'Not logged in' });
    }

    // Clear the token cookie by setting its expiration to a past date
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0) // Immediately expire the cookie
    });

    // Send successful logout response
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        // Find user by ID from the authenticated request (assuming req.user is set by middleware)
        const user = await User.findById(req.user.id);
        if (!user) {
            // User not found (shouldn't happen if authentication is correct)
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Send successful response with user data
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        // Log and send 500 for server errors
        console.error('GetMe error:', error);
        res.status(500).json({ success: false, message: 'Server Error getting user data', error: error.message });
    }
};

// @desc    Helper function to send JWT token in cookie and response body
const sendTokenResponse = (user, statusCode, res) => {
    // Get token from model method
    const token = user.getSignedJwtToken();

    // Set cookie options
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Token expires in 7 days
        httpOnly: true // Makes cookie inaccessible to client-side JavaScript
    };

    // Send response with status code, cookie, and JSON data
    res
        .status(statusCode) // Set the HTTP status code (e.g., 201 for signup, 200 for login)
        .cookie('token', token, options) // Set the JWT as an HTTP-only cookie
        .json({
            success: true, // Indicate success in the response body
            token,         // Include token in the response body
            role: user.role, // Include user role
            user: {        // Include basic user details
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};
