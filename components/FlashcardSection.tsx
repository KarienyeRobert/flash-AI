"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Flashcard from './Flashcard';
import Navigation from './Navigation';
import { useFlashcardContext } from '@/context/FlashcardContext';

const FlashcardSection: React.FC = () => {
    const { flashcards, loading, currentIndex } = useFlashcardContext();

    if (loading) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center w-full py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-20 h-20 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                <p className="mt-6 text-xl font-medium text-white/90">
                    Crafting your flashcards...
                </p>
                <p className="mt-2 text-white/60 max-w-md text-center">
                    Our AI is creating personalized flashcards for your topic. This may take a moment.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="flex flex-col items-center justify-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <AnimatePresence mode="wait">
                {flashcards.length > 0 ? (
                    <motion.div
                        key="flashcard-content"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="w-full flex flex-col items-center"
                    >
                        <Flashcard flashcard={flashcards[currentIndex]} />
                        <Navigation />
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="py-10 flex flex-col items-center max-w-md text-center"
                    >
                        <div className="w-72 h-72 flex items-center justify-center mb-6">
                            <motion.div
                                className="w-full h-full bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Sparkles className="text-yellow-300 opacity-60" size={80} />
                            </motion.div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Ready to start learning?</h2>
                        <p className="text-white/70">
                            Enter any topic above and we&#39;ll generate personalized flashcards to help you study effectively.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Sparkles = ({ className, size }: { className?: string, size: number }) => (
    <motion.div
        className={className}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L13.9389 8.95492H20.0933L15.0772 12.5701L17.0162 18.525L12 14.9099L6.98385 18.525L8.92282 12.5701L3.90675 8.95492H10.0611L12 3Z" fill="currentColor" />
        </svg>
    </motion.div>
);

export default FlashcardSection;