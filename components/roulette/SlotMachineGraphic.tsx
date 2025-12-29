import React from 'react';

interface SlotMachineGraphicProps {
  reels: [string, string, string];
  isSpinning: boolean;
}

/**
 * A modern, animated SVG slot machine with smooth CSS animations.
 * Features realistic reel spinning, lever pull, and premium aesthetics.
 */
export function SlotMachineGraphic({ reels, isSpinning }: SlotMachineGraphicProps) {
  return (
    <div className="slot-machine-container">
      <svg
        viewBox="0 0 480 360"
        className="slot-machine-svg"
        role="img"
        aria-label="Canteen Roulette Slot Machine"
      >
        <defs>
          {/* Dome Gradient (Golden/Orange) */}
          <radialGradient id="domeGradient" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#ffeb3b" stopOpacity={1} />
            <stop offset="70%" stopColor="#ffa500" stopOpacity={1} />
            <stop offset="100%" stopColor="#ff8c00" stopOpacity={1} />
          </radialGradient>

          {/* Metallic Frame Gradient */}
          <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fdfdfd" stopOpacity={1} />
            <stop offset="50%" stopColor="#f2f2f2" stopOpacity={1} />
            <stop offset="100%" stopColor="#e0e0e0" stopOpacity={1} />
          </linearGradient>

          {/* Knob/Ball Gradient (Glossy Golden) */}
          <radialGradient id="knobGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#ffec4d" stopOpacity={1} />
            <stop offset="70%" stopColor="#ffa000" stopOpacity={1} />
            <stop offset="100%" stopColor="#cc8000" stopOpacity={1} />
          </radialGradient>

          {/* Handle Arm Gradient */}
          <linearGradient id="handleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffa500" stopOpacity={1} />
            <stop offset="100%" stopColor="#e69500" stopOpacity={1} />
          </linearGradient>

          {/* Base Tray Gradient */}
          <linearGradient id="baseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5e5e5" stopOpacity={1} />
            <stop offset="100%" stopColor="#cccccc" stopOpacity={1} />
          </linearGradient>

          {/* Reel Depth Gradients */}
          <linearGradient id="reelGradTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="reelGradBot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>

          {/* Soft Inner Reel Shadow */}
          <filter id="reelInnerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
            <feOffset dx="0" dy="2" result="offset" />
            <feFlood floodColor="#000000" floodOpacity="0.08" />
            <feComposite in2="offset" operator="in" result="shadow" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>

          {/* Glow effect for knob */}
          <filter id="knobGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dome Top */}
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

        {/* Main Machine Body */}
        <g>
          {/* Base Tray */}
          <rect
            x="40" y="260" width="340" height="50"
            rx="16"
            fill="url(#baseGradient)"
            stroke="#d9d9d9"
            strokeWidth="0.5"
          />

          {/* Main Body Frame */}
          <rect
            x="40" y="80" width="340" height="200"
            rx="20"
            fill="url(#frameGradient)"
            stroke="#d9d9d9"
            strokeWidth="0.5"
          />

          {/* Subtle Inner Bevel */}
          <rect
            x="42" y="82" width="336" height="196"
            rx="18"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>

        {/* Lever / Handle (Right Side) */}
        <g className={isSpinning ? "slot-lever slot-lever-pulled" : "slot-lever"}>
          {/* Handle Pivot */}
          <circle
            cx="380" cy="180" r="12"
            fill="#d1d1d1"
            stroke="#bfbfbf"
            strokeWidth="0.5"
          />

          {/* Lever Arm */}
          <rect
            x="374" y="85" width="12" height="100"
            rx="6"
            fill="url(#handleGradient)"
            stroke="#cc8000"
            strokeWidth="0.5"
            opacity="0.9"
          />

          {/* Arm Highlight */}
          <rect
            x="376" y="87" width="2" height="96"
            rx="1"
            fill="white"
            opacity="0.3"
          />

          {/* Knob Ball */}
          <g filter="url(#knobGlow)">
            <circle
              cx="380" cy="75" r="24"
              fill="url(#knobGradient)"
              stroke="#cc8000"
              strokeWidth="0.5"
            />
            {/* Highlight */}
            <circle
              cx="372" cy="67" r="8"
              fill="white"
              opacity="0.35"
            />
          </g>
        </g>

        {/* Recessed Reel Area */}
        <rect
          x="65" y="110" width="290" height="140"
          rx="14"
          fill="#f8f9fa"
          stroke="#e0e0e0"
          strokeWidth="1"
        />

        {/* Reels */}
        {[
          { x: 75, delay: 0 },
          { x: 172, delay: 1 },
          { x: 269, delay: 2 }
        ].map((slot, i) => (
          <g key={i} filter="url(#reelInnerShadow)">
            {/* White Reel Face */}
            <rect
              x={slot.x} y="115" width="86" height="130"
              rx="12"
              fill="#ffffff"
              stroke="#e5e5e5"
              strokeWidth="0.8"
            />

            {/* Emoji Content */}
            <text
              x={slot.x + 43}
              y="185"
              fontSize="84"
              textAnchor="middle"
              dominantBaseline="middle"
              className={isSpinning ? `slot-reel-emoji slot-reel-spinning slot-reel-${slot.delay}` : "slot-reel-emoji"}
              style={{ fontFamily: 'sans-serif' }}
            >
              {reels[i]}
            </text>

            {/* Subtle Depth Gradients */}
            <rect x={slot.x} y="115" width="86" height="15" fill="url(#reelGradTop)" opacity="0.05" />
            <rect x={slot.x} y="230" width="86" height="15" fill="url(#reelGradBot)" opacity="0.05" />
          </g>
        ))}
      </svg>
    </div>
  );
}
