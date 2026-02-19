const express = require('express');
const router = express.Router();
const { authUser, registerUser, forgotPassword, resetPassword, googleLogin, updateUserProfile, saveBuild } = require('../controllers/authController');

router.post('/login', authUser);
router.post('/google-login', googleLogin);
router.put('/profile', updateUserProfile);
router.post('/save-build', saveBuild);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.route('/').post(registerUser);

module.exports = router;
