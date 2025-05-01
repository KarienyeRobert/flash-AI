"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFlashcardContext } from '@/context/FlashcardContext';

const Navigation: React.FC = () => {
    const { flashcards, currentIndex, setCurrentIndex, setIsFlipped } = useFlashcardContext();

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex(currentIndex - 1);
            }, 300);
        }
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, 300);
        }
    };

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'ArrowLeft') {
                handlePrev();
            } else if (e.code === 'ArrowRight') {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, flashcards.length]);

    return (
        <motion.div
            className="flex items-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <NavButton
                onClick={handlePrev}
                disabled={currentIndex === 0}
                direction="prev"
            >
                <ChevronLeft size={20} />
                <span className="hidden sm:inline">Previous</span>
            </NavButton>

            <div className="flex items-center">
                <ProgressIndicator
                    total={flashcards.length}
                    current={currentIndex + 1}
                />
            </div>

            <NavButton
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                direction="next"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={20} />
            </NavButton>
        </motion.div>
    );
};

interface NavButtonProps {
    onClick: () => void;
    disabled: boolean;
    direction: 'prev' | 'next';
    children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ onClick, disabled, direction, children }) => {
    const colors = disabled
        ? "bg-white/10 text-white/40"
        : "bg-white/20 text-white hover:bg-white/30";

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-xl flex items-center gap-1 backdrop-blur-md 
        transition-all duration-300 ${colors} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
        >
            {children}
        </motion.button>
    );
};

interface ProgressIndicatorProps {
    total: number;
    current: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ total, current }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="text-white/80 font-medium">
                {current} / {total}
            </div>
            <div className="w-32 sm:w-48 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(current / total) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    );
};

export default Navigation;