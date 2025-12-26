import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 2500 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fade in
        setTimeout(() => setIsVisible(true), 10);

        // Fade out and close
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md bg-black/70 border border-white/10 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
            style={{ pointerEvents: 'none' }}
        >
            <p className="text-white font-semibold text-center whitespace-nowrap">{message}</p>
        </div>
    );
};
