import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

// Firebase Configuration from Environment Variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBhjFt-G2tmdW-21NkFz0ziNf4Y-Xf4Zfo",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bandhu-ai-566ed.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bandhu-ai-566ed",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bandhu-ai-566ed.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "102282366085",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:102282366085:web:eca159d753005d55b66dec",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5F3LM7ZGWX"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Analytics (Client-safe)
let analyticsInstance = null;
isSupported().then((supported) => {
    if (supported) {
        analyticsInstance = getAnalytics(app);
        console.log("%c📊 [Firebase] Google Analytics (GA4) initialized successfully: G-5F3LM7ZGWX", "color: #2E7D32; font-weight: bold;");
    } else {
        console.warn("[Firebase] Analytics is not supported in this browser environment.");
    }
}).catch((err) => {
    console.warn("[Firebase] Analytics initialization warning:", err);
});

// ==============================================================================
// ANALYTICS TRACKING HELPERS
// ==============================================================================

/**
 * Logs page view events to Google Analytics
 */
export const logPageView = (pagePath, pageTitle) => {
    console.log(`%c📊 [Firebase Analytics] Page View: ${pagePath} (${pageTitle || ''})`, "color: #E65100; font-weight: bold;");
    
    // 1. Direct gtag dispatch (Instant GA4 verification)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'page_view', {
                page_path: pagePath,
                page_title: pageTitle || pagePath,
                page_location: window.location.href
            });
        } catch (e) {
            console.warn("[gtag] Page view error:", e);
        }
    }

    // 2. Firebase SDK dispatch
    if (analyticsInstance) {
        try {
            logEvent(analyticsInstance, 'page_view', {
                page_path: pagePath,
                page_title: pageTitle || pagePath,
                page_location: window.location.href
            });
        } catch (e) {
            console.warn("[Firebase Analytics] Page view logging error:", e);
        }
    }
};

/**
 * Logs custom user interaction events (e.g. mic click, language change)
 */
export const logCustomEvent = (eventName, params = {}) => {
    console.log(`%c⚡ [Firebase Event] ${eventName}:`, "color: #1565C0; font-weight: bold;", params);
    
    // 1. Direct gtag dispatch
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        try {
            window.gtag('event', eventName, params);
        } catch (e) {
            console.warn("[gtag] Event error:", e);
        }
    }

    // 2. Firebase SDK dispatch
    if (analyticsInstance) {
        try {
            logEvent(analyticsInstance, eventName, {
                ...params,
                timestamp: new Date().toISOString()
            });
        } catch (e) {
            console.warn("[Firebase Analytics] Event logging error:", e);
        }
    }
};

// ==============================================================================
// AUTHENTICATION HELPERS
// ==============================================================================

/**
 * Signs in user with Google popup
 */
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Automatically create or update user profile document in Firestore
        try {
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName: user.displayName || 'बंधू वापरकर्ता',
                email: user.email,
                photoURL: user.photoURL,
                lastLoginAt: serverTimestamp()
            }, { merge: true });
        } catch (dbErr) {
            console.warn("[Firestore] User document save skipped (check Firestore database rules):", dbErr);
        }

        logCustomEvent('user_login', { method: 'google', uid: user.uid, email: user.email });
        return { success: true, user };
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        let friendlyMessage = error.message;
        if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
            friendlyMessage = "Google Sign-In चालू करण्यासाठी: Firebase Console > Authentication > Sign-in method मध्ये जाऊन 'Google' Enable करा.";
        } else if (error.code === 'auth/popup-closed-by-user') {
            friendlyMessage = "लॉगिन पॉपअप बंद केले गेले.";
        }
        return { success: false, error: friendlyMessage, code: error.code };
    }
};

/**
 * Updates user's mobile number in their Firestore profile
 */
export const updateUserPhoneNumber = async (userId, phoneNumber) => {
    if (!userId || !phoneNumber) return;
    try {
        await setDoc(doc(db, 'users', userId), {
            phoneNumber: phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (e) {
        console.warn("[Firestore] Phone number update skipped:", e);
    }
};

/**
 * Signs out current user
 */
export const signOutUser = async () => {
    try {
        await signOut(auth);
        logCustomEvent('user_logout');
        return { success: true };
    } catch (error) {
        console.error('Sign-Out Error:', error);
        return { success: false, error: error.message };
    }
};

// ==============================================================================
// FIRESTORE DATABASE HELPERS (User Profiles & Chat Logs)
// ==============================================================================

/**
 * Saves or updates user preference settings in Firestore
 */
export const saveUserSettingsToFirestore = async (userId, settings) => {
    if (!userId) return;
    try {
        await setDoc(doc(db, 'users', userId, 'preferences', 'settings'), {
            ...settings,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error saving settings to Firestore:', error);
    }
};

/**
 * Loads user preference settings from Firestore
 */
export const loadUserSettingsFromFirestore = async (userId) => {
    if (!userId) return null;
    try {
        const snap = await getDoc(doc(db, 'users', userId, 'preferences', 'settings'));
        if (snap.exists()) {
            return snap.data();
        }
    } catch (error) {
        console.error('Error loading settings from Firestore:', error);
    }
    return null;
};

/**
 * Saves a completed chat exchange turn to Cloud Firestore
 */
export const saveChatTurnToFirestore = async (userId, { userMessage, aiResponse, category, language }) => {
    if (!userId) return;
    try {
        await addDoc(collection(db, 'users', userId, 'chat_history'), {
            userMessage,
            aiResponse,
            category: category || 'general',
            language: language || 'mr',
            createdAt: serverTimestamp()
        });
        console.log("%c💾 [Firestore] Chat turn saved to Cloud Database", "color: #2E7D32;");
    } catch (error) {
        console.error('Error saving chat to Firestore:', error);
    }
};

export default app;
