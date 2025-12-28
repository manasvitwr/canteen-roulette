
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Hero Card */}
      <div className="flex flex-col items-center gap-8 rounded-[2rem] bg-card/80 backdrop-blur-xl border border-border px-8 sm:px-12 py-12 sm:py-16 shadow-soft-md max-w-md w-full text-center animate-in fade-in zoom-in duration-700">

        {/* Logo SVG */}
        <div className="relative">
          <svg className="w-20 h-20 sm:w-24 sm:h-24 mx-auto drop-shadow-lg" viewBox="0 0 371 352" xmlns="http://www.w3.org/2000/svg">
            {/* Background */}
            <rect width="371" height="352" fill="#F5FF00" />

            {/* Everything shifted slightly down */}
            <g transform="translate(0,10)">
              {/* LEFT CLUSTER */}
              {/* Column 1 */}
              <rect x="54" y="72" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="58" y="76" width="46" height="46" rx="8" fill="#FF4A1F" />

              <rect x="54" y="134" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="58" y="138" width="46" height="46" rx="8" fill="#FF4A1F" />

              <rect x="54" y="196" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="58" y="200" width="46" height="46" rx="8" fill="#FF4A1F" />

              {/* Column 2 */}
              <rect x="114" y="72" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="118" y="76" width="46" height="46" rx="8" fill="#FF4A1F" />

              <rect x="114" y="196" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="118" y="200" width="46" height="46" rx="8" fill="#FF4A1F" />

              {/* RIGHT CLUSTER */}
              {/* Row 1 */}
              <rect x="200" y="72" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="204" y="76" width="46" height="46" rx="8" fill="#FF4A1F" />

              <rect x="260" y="72" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="264" y="76" width="46" height="46" rx="8" fill="#FF4A1F" />

              {/* Row 2 */}
              <rect x="200" y="134" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="204" y="138" width="46" height="46" rx="8" fill="#FF4A1F" />

              <rect x="260" y="134" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="264" y="138" width="46" height="46" rx="8" fill="#FF4A1F" />

              {/* Row 3 */}
              <rect x="200" y="196" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="204" y="200" width="46" height="46" rx="8" fill="#FF4A1F" />

              {/* 6th R box */}
              <rect x="292" y="196" width="54" height="54" rx="10" fill="#FF9A73" />
              <rect x="296" y="200" width="46" height="46" rx="8" fill="#FF4A1F" />

              {/* CONNECTOR (ends at center of 6th box) */}
              <path
                d="
                  M227 99
                  H295
                  V161
                  H227
                  L319 223
                "
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-sans text-foreground tracking-tight">
            Canteen Roulette
          </h1>
          <p className="text-muted-foreground font-sans text-sm sm:text-base leading-relaxed max-w-[300px] mx-auto">
            Fastest way to decide what to eat on campus
          </p>
        </div>

        <div className="w-full space-y-4 mt-2">
          {/* Primary Action: Google Sign In */}
          <div className="relative">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-4 px-6 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground rounded-xl shadow-md flex items-center justify-center gap-3 font-semibold font-sans transition-all active:scale-[0.98] text-sm sm:text-base"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
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
              <p className="text-xs text-destructive font-semibold font-sans mt-3 animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-[10px] font-bold font-sans text-muted-foreground uppercase tracking-widest">Or</span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          {/* Secondary Action: Guest Mode */}
          <button
            onClick={handleGuestContinue}
            className="w-full py-4 px-6 border-2 border-border text-foreground hover:bg-secondary hover:border-border/80 rounded-xl font-semibold font-sans transition-all active:scale-[0.98] text-sm sm:text-base"
          >
            Continue as Guest
          </button>
        </div>

        <p className="mt-4 text-[10px] font-bold font-sans text-muted-foreground uppercase tracking-[0.3em]">
          Somaiya Vidyavihar University
        </p>
      </div>
    </div>
  );
};

export default Login;
