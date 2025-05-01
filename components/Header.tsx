"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
    return (
        <header className="w-full pt-8 pb-4 px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="flex flex-col items-center justify-center gap-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Sparkles className="text-yellow-300" size={28} />
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                            Intelligent Flashcards
                        </h1>
                        <Sparkles className="text-yellow-300" size={28} />
                    </motion.div>
                    <SearchBar />
                </motion.div>
            </div>
        </header>
    );
};

export default Header;