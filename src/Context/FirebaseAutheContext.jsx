import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../Firebase/firebase.init';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import useAxios from '../hooks/useAxios';

const googleProvider = new GoogleAuthProvider();
// const BACKEND = "http://localhost:5000";
const axiosInstance = useAxios();

const FirebaseAutheContext = ({ children }) => {

    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Save user to backend
    const saveUserToBackend = async (currentUser) => {
        try {
            const userData = {
                email: currentUser.email,
                displayName: currentUser.displayName || currentUser.email?.split('@')[0],
                photoURL: currentUser.photoURL || null,
                role: 'user' // default role
            };
            await axiosInstance.post(`/users`, userData);
        } catch (error) {
            // User might already exist, which is fine
            console.log('User save to backend:', error.response?.data?.message || error.message);
        }
    };

    // Fetch user role from backend
    const fetchUserRole = async (email) => {
        try {
            const res = await axios.get(`${BACKEND}/users/admin/${email}`);
            if (res.data?.admin) {
                setRole('admin');
            } else {
                setRole('user');
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
            setRole('user'); // default to user if error
        }
    };

    // create user
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    //google sign in
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // log in user
    const logInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // log out user
    const SignOutUser = () => {
        setLoading(true);
        // setUser(null);
        setRole(null);
        return signOut(auth);
    };

    // for monitor
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                await saveUserToBackend(currentUser);
                await fetchUserRole(currentUser.email);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // pass as child
    const authInfo = {
        user,
        role,
        loading,
        createUser,
        googleSignIn,
        logInUser,
        SignOutUser
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default FirebaseAutheContext;