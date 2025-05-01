import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useFlashcardContext } from '@/context/FlashcardContext';

const SearchBar: React.FC = () => {
    const { topic, setTopic, fetchFlashcards, loading } = useFlashcardContext();
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            fetchFlashcards();
        }
    };

    return (
        <motion.div
            className="flex items-center gap-2 w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <motion.div
                className={`relative flex-grow transition-all duration-300 ${
                    isFocused ? 'scale-105' : 'scale-100'
                }`}
                whileHover={{ scale: 1.02 }}
            >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Enter a topic to study..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full pl-10 pr-4 py-3 text-base rounded-xl border-0
            bg-white/10 backdrop-blur-md text-white placeholder-slate-300
            shadow-lg ring-1 ring-white/20 focus:ring-2 focus:ring-indigo-400
            focus:outline-none transition-all duration-300"
                />
            </motion.div>
            <motion.button
                onClick={fetchFlashcards}
                disabled={loading || !topic.trim()}
                className={`px-6 py-3 text-base font-medium rounded-xl shadow-lg
          transition-all duration-300 ${
                    loading || !topic.trim()
                        ? 'bg-indigo-400/50 text-white/70 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 active:scale-95'
                }`}
                whileHover={{ scale: !loading && topic.trim() ? 1.03 : 1 }}
                whileTap={{ scale: !loading && topic.trim() ? 0.97 : 1 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                {loading ? <LoadingIndicator /> : 'Generate'}
            </motion.button>
        </motion.div>
    );
};

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <span>Loading...</span>
    </div>
);

export default SearchBar;