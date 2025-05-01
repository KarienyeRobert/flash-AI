import React from 'react'
import {ThemeProvider} from "@/context/ThemeContext";
import FlashcardApp from "@/components/FlashcardApp";

function App(){
    return(
        <ThemeProvider>
            <FlashcardApp/>
        </ThemeProvider>
    )
}

export default App