import React from 'react';
import { Link } from 'react-router-dom';

interface RouletteBannerProps {
    onSpinClick: () => void;
}

export const RouletteBanner: React.FC<RouletteBannerProps> = ({ onSpinClick }) => {

    return (
        <section className="relative rounded-[2rem] bg-gradient-to-b from-neutral-850 via-neutral-825 to-neutral-800 px-4 sm:px-8 py-4 shadow-sm border border-white/5 overflow-hidden backdrop-blur-sm">
            {/* outer grey sheen, less black */}
            <div className="pointer-events-none absolute inset-px rounded-[1.9rem] bg-gradient-to-b from-white/4 via-transparent to-black/10" />

            <div className="relative z-10">
                <div className="flex items-center justify-between gap-6 mb-3">
                    <div className="space-y-1.5 flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground tracking-tight">
                            Can't decide what to eat?
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                            Tap to play the roulette and we'll pick something for you.
                        </p>
                    </div>
                </div>

                {/* inner frame */}
                <div className="relative rounded-xl bg-gradient-to-b from-neutral-825 via-neutral-800 to-neutral-775 border border-neutral-700/40 p-3 sm:p-4 mb-2 sm:mb-3 overflow-hidden">
                    {/* warm base glows */}
                    <div className="pointer-events-none absolute -left-20 top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,140,0,0.22),_transparent_65%)]" />
                    <div className="pointer-events-none absolute left-10 bottom-0 h-40 w-56 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.16),_transparent_60%)]" />
                    {/* wider purple + red near knob */}
                    <div className="pointer-events-none absolute left-40 top-6 h-40 w-52 rounded-full bg-[radial-gradient(circle_at_center,_rgba(186,104,255,0.26),_transparent_65%)]" />
                    <div className="pointer-events-none absolute left-52 bottom-4 h-40 w-56 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,80,80,0.22),_transparent_65%)]" />
                    {/* soft wash */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20" />

                    <div className="relative flex items-center justify-start gap-12 md:gap-48">
                        {/* slot machine – smaller on mobile, shifted left */}
                        <div className="flex justify-start w-auto -ml-4 sm:-ml-6 md:-ml-10">
                            <img
                                src="/assets/img/3d/slot-machine.png"
                                alt="Slot Machine"
                                className="w-[140px] sm:w-[160px] md:w-[220px] lg:w-[250px] h-auto object-contain transition-transform hover:scale-110 md:hover:scale-120 drop-shadow-lg"
                                style={{ transform: 'rotate(9deg)' }}
                            />
                        </div>

                        {/* buttons – much closer to slot machine, responsive sizing */}
                        <div className="flex flex-col items-center gap-5 w-auto pr-2 sm:pr-4">
                            <button
                                onClick={onSpinClick}
                                className="px-3 py-2.5 sm:px-8 sm:py-3 rounded-full bg-primary hover:bg-primary/90 transition-all text-primary-foreground font-semibold text-sm sm:text-base shadow-md active:scale-[0.98] whitespace-nowrap"
                            >
                                Spin roulette
                            </button>

                            <Link
                                to="/filters"
                                className="text-xs sm:text-sm font-medium hover:opacity-80 underline underline-offset-4 transition-all flex items-center gap-1.5 whitespace-nowrap text-[#F5FF00]"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                </svg>
                                Adjust filters
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
