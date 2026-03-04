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
                const token = await currentUser.getIdToken();
                try {
                    const res = await fetch('http://localhost:5000/api/users/google-login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);
                        localStorage.setItem('userInfo', JSON.stringify(data));
                    } else {
                        setUser(null);
                    }
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
                localStorage.removeItem('userInfo');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    /* ── Email / Password login ─────────────────── */
    const login = async (email, password) => {
        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                return { success: true };
            }
            return { success: false, message: data.message || 'Login failed' };
        } catch {
            return { success: false, message: 'Server error' };
        }
    };

    /* ── Create new account ─────────────────────── */
    const register = async (username, email, password) => {
        try {
            const res = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                return { success: true };
            }
            return { success: false, message: data.message || 'Registration failed' };
        } catch {
            return { success: false, message: 'Server error' };
        }
    };

    /* ── Google sign-in ─────────────────────────── */
    const googleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('userInfo');
        } catch (error) {
            console.error('Logout Error', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, googleSignIn, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
