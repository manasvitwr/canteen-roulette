import React, { useState, useEffect } from 'react';
import { SlotMachineGraphic } from './SlotMachineGraphic.tsx';

const FOOD_EMOJIS = ["🍕", "🍔", "🍟", "🌯", "🍛", "🍜", "🥪", "🥗", "🥤", "☕", "🍩", "🧇", "🌮", "🥙", "🥯", "🥘"];

interface RouletteProps {
  isSpinning: boolean;
  onFinished: () => void;
  resultEmoji?: string;
}

const Roulette: React.FC<RouletteProps> = ({ isSpinning, onFinished, resultEmoji }) => {
  const getRandomReels = (): [string, string, string] => {
    const shuffled = [...FOOD_EMOJIS].sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1], shuffled[2]];
  };

  const [reels, setReels] = useState<[string, string, string]>(getRandomReels());

  useEffect(() => {
    let interval: number;
    if (isSpinning) {
      interval = window.setInterval(() => {
        setReels(getRandomReels());
      }, 70); 
    } else if (resultEmoji) {
      setReels([resultEmoji, resultEmoji, resultEmoji]);
      onFinished();
    } else {
      // Idle randomization to keep UI fresh
      if (reels[0] === reels[1]) {
        setReels(getRandomReels());
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpinning, resultEmoji, onFinished]);

  return (
    <div className="w-full flex justify-center items-center">
      <SlotMachineGraphic reels={reels} isSpinning={isSpinning} />
    </div>
  );
};

export default Roulette;
