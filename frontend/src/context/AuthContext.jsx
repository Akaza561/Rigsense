import { createContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // User is signed in to Firebase
                // Get ID token
                const token = await currentUser.getIdToken();

                // Verify with backend and get user data
                try {
                    const res = await fetch('http://localhost:5000/api/users/google-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setUser(data); // Set user data from backend (includes isAdmin, etc.)
                        localStorage.setItem('userInfo', JSON.stringify(data));
                    } else {
                        console.error('Backend Login Failed');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Backend Connection Error', error);
                    setUser(null);
                }
            } else {
                // User is signed out
                setUser(null);
                localStorage.removeItem('userInfo');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const googleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            return { success: true };
        } catch (error) {
            console.error("Google Sign In Error", error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('userInfo');
        } catch (error) {
            console.error("Logout Error", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, googleSignIn, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
