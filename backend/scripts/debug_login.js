const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const debugLogin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const email = 'admin@rigsense.com';
        let user = await User.findOne({ email });

        if (user) {
            console.log('User found:', user.email);
            console.log('Stored hashed password:', user.password);

            const isMatch = await bcrypt.compare('password123', user.password);
            console.log('Password match test (password123):', isMatch);

            if (!isMatch) {
                console.log('Password mismatch! Resetting password...');
                user.password = 'password123';
                await user.save();
                console.log('Password reset successfully.');
            }
        } else {
            console.log('User not found. Creating user...');
            user = await User.create({
                username: 'admin',
                email: email,
                password: 'password123',
                isAdmin: true
            });
            console.log('User created:', user);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

debugLogin();
