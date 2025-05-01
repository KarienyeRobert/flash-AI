"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Flashcard {
    question: string;
    answer: string;
}

interface FlashcardContextType {
    topic: string;
    setTopic: React.Dispatch<React.SetStateAction<string>>;
    flashcards: Flashcard[];
    loading: boolean;
    currentIndex: number;
    isFlipped: boolean;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
    fetchFlashcards: () => Promise<void>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const useFlashcardContext = () => {
    const context = useContext(FlashcardContext);
    if (!context) {
        throw new Error('useFlashcardContext must be used within a FlashcardProvider');
    }
    return context;
}

interface FlashcardProviderProps {
    children: ReactNode;
}

export const FlashcardProvider: React.FC<FlashcardProviderProps> = ({ children }) => {
    const [topic, setTopic] = useState('');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const fetchFlashcards = async () => {
        if (!topic.trim()) return;

        setLoading(true);
        setFlashcards([]);
        setCurrentIndex(0);
        setIsFlipped(false);
        try {
            const response = await fetch("/api/generate-flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });

            // Check if the response is valid and contains the expected data
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            // Ensure the response data has flashcards and is of the expected structure
            if (data && Array.isArray(data.flashcards)) {
                setFlashcards(data.flashcards);
            } else {
                throw new Error("Invalid response data format");
            }
        } catch (error) {
            console.error("Error fetching flashcards:", error);
        } finally {
            setLoading(false);
        }
    }

    const value = {
        topic,
        setTopic,
        flashcards,
        loading,
        currentIndex,
        isFlipped,
        setCurrentIndex,
        setIsFlipped,
        fetchFlashcards
    };

    return (
        <FlashcardContext.Provider value={value}>
            {children}
        </FlashcardContext.Provider>
    );
};