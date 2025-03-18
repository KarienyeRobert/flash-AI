"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Flashcard {
    question: string;
    answer: string;
}

export default function Home() {
    const [topic, setTopic] = useState("");
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [flippedCards, setFlippedCards] = useState(new Set<number>());

    const fetchFlashcards = async () => {
        if (!topic) return;
        setLoading(true);
        setFlashcards([]); // Clear existing cards
        try {
            const response = await fetch("/api/generate-flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });
            const data = await response.json();
            setFlashcards(data.flashcards);
        } catch (error) {
            console.error("Error fetching flashcards:", error);
        }
        setLoading(false);
    };

    const toggleCard = (index: number) => {
        const newFlipped = new Set(flippedCards);
        if (newFlipped.has(index)) {
            newFlipped.delete(index);
        } else {
            newFlipped.add(index);
        }
        setFlippedCards(newFlipped);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            fetchFlashcards();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-4xl mx-auto">
                <motion.h1
                    className="text-4xl font-bold text-center text-blue-800 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    AI Flashcards
                </motion.h1>

                <div className="flex gap-2 justify-center mb-8">
                    <motion.input
                        type="text"
                        placeholder="Enter a topic to study..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-96 px-4 py-2 text-lg rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:outline-none shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    />
                    <motion.button
                        onClick={fetchFlashcards}
                        disabled={loading}
                        className={`px-6 py-2 text-lg font-semibold text-white rounded-lg shadow-md transition-all
              ${loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                                Generating...
                            </div>
                        ) : (
                            "Generate Flashcards"
                        )}
                    </motion.button>
                </div>

                <AnimatePresence>
                    {flashcards.length > 0 && (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {flashcards.map((card, index) => (
                                <motion.div
                                    key={index}
                                    className="relative"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <div
                                        className={`cursor-pointer transition-all duration-500 transform perspective-1000
                      ${flippedCards.has(index) ? "[transform:rotateY(180deg)]" : ""}`}
                                        onClick={() => toggleCard(index)}
                                    >
                                        <div className="bg-white rounded-xl p-6 shadow-lg min-h-[200px] flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-semibold text-blue-900">
                                                    {flippedCards.has(index) ? "Answer" : "Question"}
                                                </h3>
                                                <span className="text-sm text-blue-400">
                          Card {index + 1}/{flashcards.length}
                        </span>
                                            </div>
                                            <p className="text-gray-700 mt-4">
                                                {flippedCards.has(index) ? card.answer : card.question}
                                            </p>
                                            <p className="text-sm text-blue-400 mt-4 text-center">
                                                Click to flip
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}