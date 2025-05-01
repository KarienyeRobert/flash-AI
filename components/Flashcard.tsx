"use client"

import React, {  useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useFlashcardContext } from '@/context/FlashcardContext';

interface FlashcardProps {
    flashcard: {
        question: string;
        answer: string;
    };
}

const Flashcard: React.FC<FlashcardProps> = ({ flashcard }) => {
    const { isFlipped, setIsFlipped, currentIndex } = useFlashcardContext();
    const controls = useAnimation();

    useEffect(() => {
        // Reset animation when currentIndex changes
        setIsFlipped(false);
        controls.set({ rotateY: 0 });
    }, [currentIndex, controls, setIsFlipped]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        controls.start({
            rotateY: isFlipped ? 0 : 180,
            transition: { duration: 0.6, type: "spring", stiffness: 300 }
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                handleFlip();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFlipped]);

    return (
        <div className="relative w-full max-w-md aspect-[3/4] sm:w-[380px] sm:h-[500px] my-6">
            <motion.div
                className="absolute w-full h-full cursor-pointer perspective-1000"
                whileHover={{ scale: 1.02 }}
                onClick={handleFlip}
                animate={controls}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <CardSide
                    type="front"
                    content={flashcard.question}
                    isVisible={!isFlipped}
                />
                <CardSide
                    type="back"
                    content={flashcard.answer}
                    isVisible={isFlipped}
                />
            </motion.div>
        </div>
    );
};

interface CardSideProps {
    type: 'front' | 'back';
    content: string;
    isVisible: boolean;
}

const CardSide: React.FC<CardSideProps> = ({ type, content, isVisible }) => {
    const colors = {
        front: "from-indigo-500/20 to-purple-600/20",
        back: "from-emerald-500/20 to-teal-600/20"
    };

    const title = type === 'front' ? 'Question' : 'Answer';

    return (
        <div
            className={`absolute w-full h-full rounded-2xl p-6 shadow-xl
        bg-gradient-to-br ${colors[type]} backdrop-blur-md
        border border-white/20 flex flex-col
        ${type === 'front' ? 'rotateY-0' : 'rotateY-180'}`}
            style={{
                backfaceVisibility: 'hidden',
                transform: type === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
        >
            <div className="flex flex-col h-full">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 inline-block self-start mb-4">
                    <h3 className="text-lg font-medium text-white">{title}</h3>
                </div>

                <div className="flex-grow flex items-center justify-center">
                    <p className="text-white text-lg sm:text-xl text-center leading-relaxed">
                        {content}
                    </p>
                </div>

                <div className="mt-auto flex justify-center">
                    <motion.div
                        className="text-sm text-white/60 flex items-center gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">
                            ⎵
                        </div>
                        <span>Space to flip</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;