import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { topic } = await req.json(); // Extract topic from request body

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
        }

        // Fetch response from Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `
                                    Generate a valid JSON array of flashcards for the topic: "${topic}". 
                                    Each flashcard must follow this format: 
                                    [{"question": "...", "answer": "..."}]. 
                                    Provide **between 15 and 30** high-quality flashcards. 
                                    Output **ONLY raw JSON** (no markdown, no code blocks, no explanations).
                                    Explain in kinda friendly and gen z way please(making it easy to understand and remember.`
                                }
                            ]
                        }
                    ]
                }),
            }
        );

        const data = await response.json();
        console.log("Gemini API Response:", data); // Log the entire response

        if (!data || !data.candidates || data.candidates.length === 0) {
            return NextResponse.json({ error: "No response from AI" }, { status: 500 });
        }

        let generatedText = data.candidates[0]?.content?.parts?.[0]?.text;

        // 🔥 **Fix: Remove code block markers if they exist**
        generatedText = generatedText.replace(/```json|```/g, "").trim();

        let flashcards = [];
        try {
            flashcards = JSON.parse(generatedText);
        } catch (error) {
            console.error("Error parsing flashcards:", error);
            return NextResponse.json({ error: "Failed to parse flashcards" }, { status: 500 });
        }
        return NextResponse.json({ flashcards });
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
