import React from 'react';

interface SlotMachineGraphicProps {
  reels: [string, string, string];
  isSpinning: boolean;
}

/**
 * A world-class 3D slot machine graphic with a minimalist Apple-like aesthetic.
 * Featuring enlarged reels, right-side handle, and smooth cubic-bezier animations.
 */
export function SlotMachineGraphic({ reels, isSpinning }: SlotMachineGraphicProps) {
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto p-2 flex items-center justify-center select-none">
      <style>{`
        /* Realistic Decelerating Spin Animation */
        @keyframes spin-emoji-premium {
          0% { transform: translateY(0); filter: blur(0px); opacity: 1; }
          20% { transform: translateY(-30px); filter: blur(4px); opacity: 0.7; }
          50% { transform: translateY(30px); filter: blur(8px); opacity: 0.4; }
          100% { transform: translateY(0); filter: blur(0px); opacity: 1; }
        }
        
        /* Realistic Knob Pull Animation (Down and Back) */
        @keyframes pull-handle-premium {
          0% { transform: rotate(0deg); }
          30% { transform: rotate(45deg); }
          50% { transform: rotate(50deg); }
          100% { transform: rotate(0deg); }
        }

        .animate-spin-reel-premium {
          animation: spin-emoji-premium 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }

        .animate-lever-premium {
          animation: pull-handle-premium 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          /* Pivot point on the right edge of the machine */
          transform-origin: 370px 180px;
        }

        .machine-wrapper {
          filter: drop-shadow(0 25px 40px rgba(0,0,0,0.15));
          transition: transform 0.3s ease;
        }
      `}</style>
      
      <div className="machine-wrapper w-full h-auto">
        {/* Enlarged viewBox to 480x360 for more breathing room */}
        <svg 
          viewBox="0 0 480 360" 
          className="w-full h-auto overflow-visible" 
          role="img" 
          aria-label="Canteen Roulette Slot Machine"
        >
          <defs>
            {/* 1. Dome Gradient (Golden/Orange) - Softer blends */}
            <radialGradient id="domeGradient" cx="50%" cy="30%">
              <stop offset="0%" style={{ stopColor: '#ffeb3b', stopOpacity: 1 }} />
              <stop offset="70%" style={{ stopColor: '#ffa500', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ff8c00', stopOpacity: 1 }} />
            </radialGradient>

            {/* 2. Metallic Frame Gradient - Cleaner, less harsh */}
            <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#fdfdfd', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#f2f2f2', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#e0e0e0', stopOpacity: 1 }} />
            </linearGradient>

            {/* 3. Knob/Ball Gradient (Glossy Golden) */}
            <radialGradient id="knobGradient" cx="30%" cy="30%">
              <stop offset="0%" style={{ stopColor: '#ffec4d', stopOpacity: 1 }} />
              <stop offset="70%" style={{ stopColor: '#ffa000', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#cc8000', stopOpacity: 1 }} />
            </radialGradient>

            {/* 4. Handle Arm Gradient */}
            <linearGradient id="handleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ffa500', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#e69500', stopOpacity: 1 }} />
            </linearGradient>

            {/* 5. Base Tray Gradient */}
            <linearGradient id="baseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#e5e5e5', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#cccccc', stopOpacity: 1 }} />
            </linearGradient>

            {/* 6. Soft Inner Reel Shadow */}
            <filter id="reelInnerShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
              <feOffset dx="0" dy="2" result="offset" />
              <feFlood floodColor="#000000" floodOpacity="0.08" />
              <feComposite in2="offset" operator="in" result="shadow" />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>
          </defs>

          {/* --- Dome Top --- */}
          <g transform="translate(0, 10)">
            <path 
              d="M70 80 C 70 10, 350 10, 350 80" 
              fill="url(#domeGradient)" 
              stroke="#d9d9d9" 
              strokeWidth="0.5" 
              opacity="0.9"
            />
            <path 
              d="M100 45 C 100 25, 320 25, 320 45" 
              fill="none" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeOpacity="0.3" 
            />
          </g>

          {/* --- Main Machine Body --- */}
          <g>
            {/* Base Tray */}
            <rect x="40" y="260" width="340" height="50" rx="16" fill="url(#baseGradient)" stroke="#d9d9d9" strokeWidth="0.5" />
            
            {/* Main Body Frame - No harsh black strokes */}
            <rect x="40" y="80" width="340" height="200" rx="20" fill="url(#frameGradient)" stroke="#d9d9d9" strokeWidth="0.5" />
            
            {/* Subtle Inner Bevel */}
            <rect x="42" y="82" width="336" height="196" rx="18" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
          </g>

          {/* --- Lever / Handle (Positioned on the Right Side) --- */}
          <g className={isSpinning ? "animate-lever-premium" : ""}>
            {/* Handle Pivot - Hidden slightly behind frame edge */}
            <circle cx="380" cy="180" r="12" fill="#d1d1d1" stroke="#bfbfbf" strokeWidth="0.5" />
            
            {/* Lever Arm Arm extending from right edge */}
            <rect 
              x="374" y="85" width="12" height="100" rx="6" 
              fill="url(#handleGradient)" 
              stroke="#cc8000" 
              strokeWidth="0.5" 
              opacity="0.9"
            />
            {/* Arm Highlight */}
            <rect 
              x="376" y="87" width="2" height="96" rx="1" 
              fill="white" opacity="0.3"
            />
            
            {/* Knob Ball - Enlarged and glossy */}
            <g>
              <circle cx="380" cy="75" r="24" fill="url(#knobGradient)" stroke="#cc8000" strokeWidth="0.5" />
              {/* Highlight */}
              <circle cx="372" cy="67" r="8" fill="white" opacity="0.35" />
            </g>
          </g>

          {/* --- Recessed Reel Area --- */}
          <rect x="65" y="110" width="290" height="140" rx="14" fill="#f8f9fa" stroke="#e0e0e0" strokeWidth="1" />
          
          {/* --- Enlarged Reels --- */}
          {[
            { x: 75, delay: '0s' },
            { x: 172, delay: '0.05s' },
            { x: 269, delay: '0.1s' }
          ].map((slot, i) => (
            <g key={i} filter="url(#reelInnerShadow)">
              {/* White Reel Face */}
              <rect 
                x={slot.x} y="115" width="86" height="130" rx="12" 
                fill="#ffffff" 
                stroke="#e5e5e5" 
                strokeWidth="0.8" 
              />

              {/* Emoji Content - Enlarged font size */}
              <text 
                x={slot.x + 43} y="185" 
                fontSize="84" 
                textAnchor="middle" 
                dominantBaseline="middle"
                className={isSpinning ? "animate-spin-reel-premium" : ""}
                style={{ animationDelay: slot.delay, fontFamily: 'sans-serif' }}
              >
                {reels[i]}
              </text>

              {/* Subtle Depth Gradients */}
              <rect x={slot.x} y="115" width="86" height="15" fill="url(#reelGradTop)" opacity="0.05" />
              <rect x={slot.x} y="230" width="86" height="15" fill="url(#reelGradBot)" opacity="0.05" />
            </g>
          ))}

          {/* Gradients for Depth */}
          <linearGradient id="reelGradTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="reelGradBot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
        </svg>
      </div>
    </div>
  );
}
