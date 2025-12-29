import React, { useState, useEffect } from 'react';

interface SlotMachineGraphicProps {
  reels: [string, string, string];
  isSpinning: boolean;
}

/**
 * A modern, animated SVG slot machine with smooth CSS animations.
 * Features realistic reel spinning, lever pull, and premium aesthetics.
 */
export function SlotMachineGraphic({ reels, isSpinning }: SlotMachineGraphicProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isSpinning]);
  return (
    <div className="slot-machine-container">
      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className="slot-machine-svg"
        role="img"
        aria-label="Canteen Roulette Slot Machine"
      >

        <defs>
          {/* Chrome body with more metallic depth */}
          <linearGradient id="chromeBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d8d8d8" />
            <stop offset="15%" stopColor="#fafafa" />
            <stop offset="35%" stopColor="#e5e5e5" />
            <stop offset="60%" stopColor="#c2c2c2" />
            <stop offset="85%" stopColor="#9a9a9a" />
            <stop offset="100%" stopColor="#707070" />
          </linearGradient>

          <linearGradient id="chromeDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b5b5b5" />
            <stop offset="50%" stopColor="#858585" />
            <stop offset="100%" stopColor="#555555" />
          </linearGradient>

          {/* Reel gradient with better metallic sheen */}
          <linearGradient id="reelCylinder" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a5a59a" />
            <stop offset="8%" stopColor="#d8d8cc" />
            <stop offset="25%" stopColor="#f5f5ee" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#f2f2eb" />
            <stop offset="92%" stopColor="#d5d5ca" />
            <stop offset="100%" stopColor="#9d9d92" />
          </linearGradient>

          {/* Improved lever ball with glossy highlight */}
          <radialGradient id="leverBall" cx="0.35" cy="0.35">
            <stop offset="0%" stopColor="#ffb5b5" />
            <stop offset="25%" stopColor="#ff5555" />
            <stop offset="70%" stopColor="#dd0000" />
            <stop offset="100%" stopColor="#aa0000" />
          </radialGradient>

          {/* Softer shadow */}
          <radialGradient id="shadow">
            <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>

          {/* Orange dome gradient */}
          <linearGradient id="domeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffaa55" />
            <stop offset="50%" stopColor="#ff9944" />
            <stop offset="100%" stopColor="#ee7722" />
          </linearGradient>

          {/* Clipping paths for precise edge alignment */}
          <clipPath id="clipBody">
            <rect x="88" y="172" width="336" height="256" rx="42" />
          </clipPath>

          <clipPath id="clipRoof">
            <rect x="104" y="145" width="304" height="40" rx="20" />
          </clipPath>

          <clipPath id="clipDisplay">
            <rect x="120" y="207" width="272" height="156" rx="20" />
          </clipPath>

          <clipPath id="clipBasePlatform">
            <path d="M 70 428 L 70 452 Q 70 462 82 462 L 430 462 Q 442 462 442 452 L 442 428 Z" />
          </clipPath>

          <clipPath id="clipLever">
            <rect x="-6" y="-108" width="10" height="108" rx="5" />
          </clipPath>

          <clipPath id="clipBall">
            <circle cx="0" cy="-115" r="28" />
          </clipPath>

          <clipPath id="clipBeacon">
            <ellipse cx="0" cy="-6" rx="42" ry="6" />
            <rect x="-42" y="-6" width="84" height="14" />
            <ellipse cx="0" cy="8" rx="42" ry="6" />
          </clipPath>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="256" cy="468" rx="155" ry="15" fill="url(#shadow)" />

        {/* Base platform with clipped highlights */}
        <path d="M 70 428 L 70 452 Q 70 462 82 462 L 430 462 Q 442 462 442 452 L 442 428 Z" fill="url(#chromeBody)" />
        <g clipPath="url(#clipBasePlatform)">
          <rect x="75" y="453" width="362" height="9" rx="4" fill="#000" opacity="0.18" />
          <rect x="75" y="448" width="362" height="3" fill="#fff" opacity="0.3" />
        </g>

        {/* Main body with clipped highlights */}
        <rect x="88" y="172" width="336" height="256" rx="42" fill="url(#chromeBody)" />
        <g clipPath="url(#clipBody)">
          <rect x="88" y="395" width="336" height="33" fill="#000" opacity="0.1" />
          <rect x="88" y="172" width="336" height="5" fill="#fff" opacity="0.5" />
          <rect x="88" y="172" width="10" height="256" fill="#fff" opacity="0.25" />
        </g>

        {/* Chrome roof piece with clipped highlights */}
        <rect x="104" y="145" width="304" height="40" rx="20" fill="url(#chromeBody)" />
        <g clipPath="url(#clipRoof)">
          <rect x="104" y="145" width="304" height="5" fill="#fff" opacity="0.4" />
        </g>

        {/* Black strip under dome */}
        <rect x="114" y="145" width="284" height="10" rx="5" fill="#1a1a1a" />

        {/* Orange dome with gradient */}
        <path d="M 114 155 Q 256 78 398 155 Z" fill="url(#domeGradient)" />

        {/* Dome highlights (contained within dome path) */}
        <path d="M 140 155 Q 256 95 372 155" fill="none" stroke="#ffcc88" strokeWidth="2" opacity="0.6" />
        <path d="M 114 155 Q 256 78 398 155" fill="none" stroke="#dd6611" strokeWidth="1.5" />

        {/* Display window frame */}
        <rect x="108" y="195" width="296" height="180" rx="24" fill="#1a1a1a" />
        <rect x="112" y="199" width="288" height="172" rx="22" fill="#2a2a2a" />

        {/* Inner cream display with clipped texture */}
        <rect x="120" y="207" width="272" height="156" rx="20" fill="#fffef8" />
        <g clipPath="url(#clipDisplay)">
          <rect x="120" y="207" width="272" height="4" fill="#f5f5e8" />
          <rect x="385" y="207" width="7" height="156" fill="#e8e8dc" />
        </g>

        {/* Three refined cylindrical reels */}
        <g>
          {/* Left reel */}
          <g transform="translate(132, 238)">
            <ellipse cx="40" cy="0" rx="40" ry="11" fill="#d0d0c5" />
            <ellipse cx="40" cy="0" rx="38" ry="9" fill="#e5e5dc" />
            <rect x="0" y="0" width="80" height="112" fill="url(#reelCylinder)" />
            <ellipse cx="40" cy="112" rx="40" ry="11" fill="#959588" />
            <path d="M 0 112 Q 40 123 80 112" fill="none" stroke="#4a4a42" strokeWidth="2" />
            <text
              x="40"
              y="72"
              fontFamily="sans-serif"
              fontSize="62"
              fontWeight="900"
              fill="#333"
              textAnchor="middle"
              className={isSpinning ? "slot-reel-emoji slot-reel-spinning slot-reel-0" : "slot-reel-emoji"}
            >
              {reels[0]}
            </text>
          </g>

          {/* Middle reel */}
          <g transform="translate(216, 238)">
            <ellipse cx="40" cy="0" rx="40" ry="11" fill="#d0d0c5" />
            <ellipse cx="40" cy="0" rx="38" ry="9" fill="#e5e5dc" />
            <rect x="0" y="0" width="80" height="112" fill="url(#reelCylinder)" />
            <ellipse cx="40" cy="112" rx="40" ry="11" fill="#959588" />
            <path d="M 0 112 Q 40 123 80 112" fill="none" stroke="#4a4a42" strokeWidth="2" />
            <text
              x="40"
              y="72"
              fontFamily="sans-serif"
              fontSize="62"
              fontWeight="900"
              fill="#333"
              textAnchor="middle"
              className={isSpinning ? "slot-reel-emoji slot-reel-spinning slot-reel-1" : "slot-reel-emoji"}
            >
              {reels[1]}
            </text>
          </g>

          {/* Right reel */}
          <g transform="translate(300, 238)">
            <ellipse cx="40" cy="0" rx="40" ry="11" fill="#d0d0c5" />
            <ellipse cx="40" cy="0" rx="38" ry="9" fill="#e5e5dc" />
            <rect x="0" y="0" width="80" height="112" fill="url(#reelCylinder)" />
            <ellipse cx="40" cy="112" rx="40" ry="11" fill="#959588" />
            <path d="M 0 112 Q 40 123 80 112" fill="none" stroke="#4a4a42" strokeWidth="2" />
            <text
              x="40"
              y="72"
              fontFamily="sans-serif"
              fontSize="62"
              fontWeight="900"
              fill="#333"
              textAnchor="middle"
              className={isSpinning ? "slot-reel-emoji slot-reel-spinning slot-reel-2" : "slot-reel-emoji"}
            >
              {reels[2]}
            </text>
          </g>
        </g>

        {/* Coin slot with polished details */}
        <g transform="translate(256, 218)">
          <ellipse cx="0" cy="0" rx="22" ry="15" fill="#0a0a0a" />
          <ellipse cx="0" cy="-1" rx="19" ry="12" fill="#1a1a1a" />
          <ellipse cx="0" cy="-2" rx="17" ry="10" fill="#2a2a2a" />
          <ellipse cx="0" cy="-1" rx="21" ry="14" fill="none" stroke="#d4af37" strokeWidth="2.5" />
          <ellipse cx="0" cy="-1.5" rx="21" ry="14" fill="none" stroke="#f5d76e" strokeWidth="0.8" opacity="0.5" />
        </g>

        {/* Right side lever mechanism */}
        <g transform="translate(440, 305)">
          {/* Mounting block */}
          <rect x="-22" y="-30" width="44" height="60" rx="12" fill="url(#chromeDark)" />
          <rect x="-18" y="-26" width="36" height="52" rx="10" fill="url(#chromeBody)" />
          <circle cx="0" cy="0" r="8" fill="#3a3a3a" />

          {/* Animated lever arm and ball */}
          <g className={isAnimating ? "slot-lever-arm slot-lever-arm-pulled" : "slot-lever-arm"}>
            {/* Lever arm with clipped highlights */}
            <rect x="-7" y="-108" width="14" height="108" rx="7" fill="#909090" />
            <rect x="-6" y="-108" width="10" height="108" rx="5" fill="#d8d8d8" />
            <g clipPath="url(#clipLever)">
              <rect x="-5" y="-108" width="3" height="108" fill="#f5f5f5" opacity="0.7" />
            </g>

            <circle cx="0" cy="-115" r="28" fill="url(#leverBall)" />
            <g clipPath="url(#clipBall)">
              <circle cx="-8" cy="-123" r="11" fill="#ffcccc" opacity="0.6" />
              <circle cx="-10" cy="-125" r="6" fill="#fff" opacity="0.8" />
            </g>
          </g>
        </g>
        <g transform="translate(260, 110)">
          <ellipse cx="0" cy="-15" rx="42" ry="6" fill="#990000" />
          <rect x="-42" y="-15" width="84" height="20" fill="#cc0000" />
          <ellipse cx="0" cy="8" rx="42" ry="6" fill="#ff3333" />

          <g clipPath="url(#clipBeacon)">
            <ellipse cx="0" cy="-2" rx="38" ry="4" fill="#ff5555" opacity="0.5" />
            <ellipse cx="0" cy="2" rx="34" ry="3" fill="#ff7777" opacity="0.6" />
            <ellipse cx="-12" cy="0" rx="14" ry="3" fill="#ffaaaa" opacity="0.7" />
            <ellipse cx="16" cy="3" rx="10" ry="2" fill="#ff8888" opacity="0.5" />
          </g>

          <ellipse cx="0" cy="8" rx="42" ry="6" fill="none" stroke="#888" strokeWidth="1.5" />
        </g>

      </svg>

      <style jsx>{`
        .slot-machine-container {
          width: 100%;
          max-width: 512px;
          margin: 0 auto;
        }

        .slot-machine-svg {
          width: 100%;
          height: auto;
        }

        /* Lever arm pull animation - moves down and up */
        .slot-lever-arm {
          transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slot-lever-arm-pulled {
          animation: leverPull 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes leverPull {
          0% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(12px);
          }
          50% {
            transform: translateY(12px) scaleY(1.02);
          }
          80% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(0);
          }
        }

        /* Reel spinning animation */
        .slot-reel-emoji {
          transition: opacity 0.2s ease;
        }

        .slot-reel-spinning {
          animation: reelSpin 0.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .slot-reel-0 {
          animation-delay: 0s;
        }

        .slot-reel-1 {
          animation-delay: 0.1s;
        }

        .slot-reel-2 {
          animation-delay: 0.2s;
        }

        @keyframes reelSpin {
          0%, 100% {
            opacity: 1;
            transform: translateY(0);
          }
          50% {
            opacity: 0.3;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}