const express = require('express');
const router = express.Router();
const { authUser, registerUser, forgotPassword, resetPassword, googleLogin, updateUserProfile, saveBuild, getSavedBuilds, deleteSavedBuild } = require('../controllers/authController');

router.post('/login', authUser);
router.post('/google-login', googleLogin);
router.put('/profile', updateUserProfile);
router.post('/save-build', saveBuild);
router.get('/saved-builds/:userId', getSavedBuilds);
router.delete('/saved-builds/:userId/:buildIndex', deleteSavedBuild);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.route('/').post(registerUser);

module.exports = router;
