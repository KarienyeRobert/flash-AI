"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Flashcard {
    question: string;
    answer: string;
}

export default function Home() {
    const [topic, setTopic] = useState("");
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const fetchFlashcards = async () => {
        if (!topic) return;
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
            const data = await response.json();
            setFlashcards(data.flashcards);
        } catch (error) {
            console.error("Error fetching flashcards:", error);
        }
        setLoading(false);
    };

    const nextCard = () => {
        if (currentIndex < flashcards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
            }, 300);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex((prev) => prev - 1);
            }, 300);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            fetchFlashcards();
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
            <motion.h1
                className="text-4xl font-bold text-blue-800 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                AI Flashcards
            </motion.h1>

            <div className="flex gap-2 justify-center mb-6">
                <motion.input
                    type="text"
                    placeholder="Enter a topic..."
                    value={topic}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-96 px-4 py-2 text-lg rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                />
                <motion.button
                    onClick={fetchFlashcards}
                    disabled={loading}
                    className={`px-6 py-2 text-lg font-semibold text-white rounded-lg shadow-md transition-all ${
                        loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                    }`}
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

            <div className="relative w-[350px] h-[450px]">
                {flashcards.length > 0 && (
                    <motion.div
                        className="absolute w-full h-full flex items-center justify-center rounded-xl p-6 shadow-xl"
                        style={{
                            transformStyle: "preserve-3d",
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                            transition: "transform 0.5s",
                        }}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        {/* FRONT */}
                        <div
                            className="absolute w-full h-full flex flex-col justify-center items-center bg-white rounded-xl p-6 shadow-lg"
                            style={{ backfaceVisibility: "hidden" }}
                        >
                            <h3 className="text-lg font-semibold text-blue-900">Question</h3>
                            <p className="text-gray-700 mt-4 text-center">
                                {flashcards[currentIndex].question}
                            </p>
                            <p className="text-sm text-blue-400 mt-4">Click to flip</p>
                        </div>

                        {/* BACK */}
                        <div
                            className="absolute w-full h-full flex flex-col justify-center items-center bg-white rounded-xl p-6 shadow-lg"
                            style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                            }}
                        >
                            <h3 className="text-lg font-semibold text-blue-900">Answer</h3>
                            <p className="text-gray-700 mt-4 text-center">
                                {flashcards[currentIndex].answer}
                            </p>
                            <p className="text-sm text-blue-400 mt-4">Click to flip</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {flashcards.length > 0 && (
                <div className="mt-6 flex items-center gap-4">
                    <button
                        onClick={prevCard}
                        disabled={currentIndex === 0}
                        className="px-6 py-2 text-lg font-semibold text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>

                    <p className="text-lg font-semibold text-blue-700">
                        {currentIndex + 1}/{flashcards.length}
                    </p>

                    <button
                        onClick={nextCard}
                        disabled={currentIndex === flashcards.length - 1}
                        className="px-6 py-2 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
