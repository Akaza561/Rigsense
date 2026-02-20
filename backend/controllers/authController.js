const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const admin = require('../config/firebaseAdmin');

// Generate JWT Helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            hasSetUsername: user.hasSetUsername,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Auth user with Google (Firebase)
// @route   POST /api/users/google-login
// @access  Public
const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Update user info if needed
            user.name = name;
            user.firebaseUid = uid;
            user.picture = picture;
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                username: name,
                email,
                firebaseUid: uid,
                isAdmin: false, // Default
                picture,
                hasSetUsername: false
            });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            picture: user.picture,
            hasSetUsername: user.hasSetUsername,
            token: generateToken(user._id) // Keep JWT for internal session if needed, OR just use Firebase token on frontend. 
            // Better to return our own JWT for MongoDB ID reference if other APIs rely on protect middleware using JWT.
            // BUT wait, I just made authMiddleware use Firebase Token?
            // YES. So I don't need to return a JWT. I should expect the frontend to send the Firebase ID Token.
            // My authMiddleware expects: "req.headers.authorization.split(' ')[1]" which is a token.
            // And it validates using "admin.auth().verifyIdToken(token)".
            // So the frontend MUST send the FIREBASE ID TOKEN.
            // So I don't need to return a JWT here. I just return the user data.
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(401).json({ message: 'Google Login Failed', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    const { _id, username, picture } = req.body;

    const user = await User.findById(_id);

    if (user) {
        user.username = username || user.username;
        user.hasSetUsername = true;
        if (picture !== undefined) user.picture = picture;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            picture: updatedUser.picture,
            hasSetUsername: updatedUser.hasSetUsername,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all saved builds for a user
// @route   GET /api/users/saved-builds/:userId
// @access  Public
const getSavedBuilds = async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (user) {
        res.json({ savedBuilds: user.savedBuilds });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete a saved build from user profile
// @route   DELETE /api/users/saved-builds/:userId/:buildIndex
// @access  Public
const deleteSavedBuild = async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (user) {
        const index = parseInt(req.params.buildIndex);
        user.savedBuilds.splice(index, 1);
        await user.save();
        res.json({ message: 'Build deleted', savedBuilds: user.savedBuilds });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Save a build to user profile
// @route   POST /api/users/save-build
// @access  Public (Should be protected)
const saveBuild = async (req, res) => {
    const { _id, build } = req.body;

    const user = await User.findById(_id);

    if (user) {
        // Add build to savedBuilds array
        // Check for duplicates? Maybe not for now.
        const buildWithDate = { ...build, ksavedAt: new Date() };
        user.savedBuilds.push(buildWithDate);

        await user.save();

        res.json({
            message: 'Build saved successfully',
            savedBuilds: user.savedBuilds
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        username,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    // Get reset token (instance method)
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // In a real app, send email. Here, return token.
    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;
    console.log(`Reset Email Sent to ${email}. Link: ${resetUrl}`);

    res.json({ message: 'Email sent', resetToken });
};

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400).json({ message: 'Invalid token' });
        return;
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
    });
};

module.exports = { authUser, registerUser, forgotPassword, resetPassword, googleLogin, updateUserProfile, saveBuild, getSavedBuilds, deleteSavedBuild };
