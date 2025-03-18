import {NextApiRequest, NextApiResponse} from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    const { topic } = req.body;

    try {
        const geminiApiKey = process.env.GEMINI_API_KEY;
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `
                    You are an experienced university STEM tutor specializing in Computer Science and Information Technology. 
                    Generate a JSON array of flashcards on the topic: "${topic}". 
                    Each flashcard should have a "question" and "answer" field. Example format: [{"question": "What is an algorithm?", "answer": "A step-by-step procedure for solving a problem."}]
                    You are to provide detailed answers and steps  to each question.
                    Be friendly and engaging in your explanations in a gen z kinda way and use appropriate emojis.
                    Produce 30 questions per topic including codes and calculations.`,
                }),
            }
        );

        const data = await response.json();
        const generatedText = data?.candidates?.[0]?.content || "";

        let flashcards = [];
        try {
            flashcards = JSON.parse(generatedText);
        } catch (error) {
            console.error("Error parsing flashcards:", error);
        }

        res.status(200).json({ flashcards });
    } catch (error) {
        console.error("Error fetching flashcards:", error);
        res.status(500).json({ error: "Failed to generate flashcards" });
    }
}
