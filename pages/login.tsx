
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase.ts';
import { useAuth } from '../App.tsx';
import { UserDoc } from '../types';

const Login: React.FC = () => {
  const { login, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email?.endsWith('@somaiya.edu')) {
        await signOut(auth);
        setError('Please use your @somaiya.edu student account to continue.');
        setLoading(false);
        return;
      }

      // Create or update user doc in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const userData: UserDoc = {
        id: user.uid,
        email: user.email,
        displayName: user.displayName || 'Somaiya Student',
        photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'S')}&background=random`,
        vegPreference: userSnap.exists() ? userSnap.data().vegPreference : 'veg',
        createdAt: userSnap.exists() ? userSnap.data().createdAt : Date.now(),
        lastLogin: Date.now(),
        spinsCount: userSnap.exists() ? userSnap.data().spinsCount : 0
      };

      await setDoc(userRef, userData, { merge: true });
      login(userData);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign in. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center px-4 py-12">
      {/* Hero Card */}
      <div className="flex flex-col items-center gap-6 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/30 px-8 py-12 shadow-2xl max-w-md w-full text-center animate-in fade-in zoom-in duration-700">

        {/* Slot Machine Icon */}
        <div className="relative mb-2">
          <div className="text-7xl drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] animate-bounce">🎰</div>
          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full -z-10"></div>
        </div>

        <div>
          <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight mb-3">
            Canteen Roulette
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm leading-relaxed max-w-[280px] mx-auto">
            An unofficial Somaiya food decision helper for hungry students.
          </p>
        </div>

        <div className="w-full space-y-4 mt-4">
          {/* Primary Action: Google Sign In */}
          <div className="relative group">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-4 px-6 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 disabled:bg-neutral-100 disabled:text-neutral-400 text-neutral-900 dark:text-white rounded-2xl shadow-lg flex items-center justify-center gap-3 font-bold transition-all active:scale-[0.98] relative overflow-hidden ring-1 ring-neutral-200 dark:ring-neutral-700"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
            {error && (
              <p className="text-[11px] text-destructive font-bold mt-3 animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1"></div>
            <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">Or</span>
            <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1"></div>
          </div>

          {/* Secondary Action: Guest Mode */}
          <button
            onClick={handleGuestContinue}
            className="w-full py-4 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white rounded-2xl font-bold transition-all active:scale-[0.98]"
          >
            Continue as Guest
          </button>
        </div>

        <p className="mt-6 text-[10px] font-black text-neutral-300 dark:text-neutral-700 uppercase tracking-[0.3em]">
          Somaiya Vidyavihar University
        </p>
      </div>
    </div>
  );
};

export default Login;
