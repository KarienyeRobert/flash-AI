"use client"

import React from 'react';
import Header from './Header';
import FlashcardSection from './FlashcardSection';
import Background from './Background';
import { FlashcardProvider } from '@/context/FlashcardContext';

const FlashcardApp: React.FC = () => {
    return (
        <FlashcardProvider>
            <div className="relative min-h-screen overflow-hidden font-sans text-slate-800">
                <Background />
                <div className="relative z-10 flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
                        <FlashcardSection />
                    </main>
                    <footer className="py-4 text-center text-sm text-slate-500">
                        <p>© 2025 Intelligent Flashcards</p>
                    </footer>
                </div>
            </div>
        </FlashcardProvider>
    );
};

export default FlashcardApp;