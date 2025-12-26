import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FOOD_EMOJIS = ["🍕", "🍔", "🍟", "🌯", "🍛", "🍜", "🥪", "🥗", "🥤", "☕", "🍩", "🧇", "🌮", "🥙", "🥯", "🥘"];

interface RouletteBannerProps {
    onSpinClick: () => void;
}

export const RouletteBanner: React.FC<RouletteBannerProps> = ({ onSpinClick }) => {
    const [emojiSequence, setEmojiSequence] = useState<Array<{ id: string; emoji: string }>>([]);

    useEffect(() => {
        const generateEmoji = () => {
            const randomEmoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)];
            const id = Math.random().toString(36);
            setEmojiSequence(prev => [...prev, { id, emoji: randomEmoji }]);

            setTimeout(() => {
                setEmojiSequence(prev => prev.filter(item => item.id !== id));
            }, 4000);
        };

        const interval = setInterval(generateEmoji, 120);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="rounded-[2rem] bg-gradient-to-br from-background to-muted px-8 py-4 shadow-sm border border-border">
            <div className="flex items-center justify-between gap-6 mb-3">
                <div className="space-y-1.5 flex-1">
                    <h3 className="text-2xl font-semibold text-foreground tracking-tight">Can't decide what to eat?</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Tap to play the roulette and we'll pick something for you.</p>
                </div>

                <div className="relative w-[300px] h-[70px] overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 via-transparent to-neutral-800 pointer-events-none z-10" />
                    <div className="flex items-center h-full gap-3 whitespace-nowrap">
                        {emojiSequence.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-center w-[70px] h-[70px] rounded-lg bg-neutral-800/60 border border-neutral-700/40 shadow-md flex-shrink-0 animate-slide-in"
                            >
                                <span className="text-3xl">{item.emoji}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-xl bg-neutral-800/30 border border-neutral-700/30 p-4 mb-3 overflow-hidden flex items-center justify-between">
                <div className="flex justify-center md:justify-start -ml-9">
                    <img
                        src="/assets/img/3d/slot-machine.png"
                        alt="Slot Machine"
                        className="w-[240px] md:w-[260px] h-auto object-contain transition-transform hover:scale-150 drop-shadow-lg"
                        style={{ transform: 'rotate(9deg)' }}
                    />
                </div>

                <div className="flex flex-col items-center gap-3 pr-4">
                    <button
                        onClick={onSpinClick}
                        className="px-8 py-3 rounded-full bg-primary hover:bg-primary/90 transition-all text-primary-foreground font-semibold text-base shadow-md active:scale-[0.98] whitespace-nowrap"
                    >
                        Spin roulette
                    </button>
                    <Link
                        to="/filters"
                        className="text-sm font-medium hover:opacity-80 underline underline-offset-4 transition-all flex items-center gap-1.5"
                        style={{ color: '#F5FF00' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Adjust filters
                    </Link>
                </div>
            </div>
        </section>
    );
};
