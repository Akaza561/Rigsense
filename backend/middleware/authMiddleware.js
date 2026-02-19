const admin = require('../config/firebaseAdmin');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify the token with Firebase Admin
            const decodedToken = await admin.auth().verifyIdToken(token);

            // Attach user info to request
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name || decodedToken.email.split('@')[0],
                picture: decodedToken.picture
            };

            next();
        } catch (error) {
            console.error('Firebase Auth Error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
