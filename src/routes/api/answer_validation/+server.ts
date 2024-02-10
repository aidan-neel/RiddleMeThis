import { SECRET_CHATGPT_API_KEY } from '$env/static/private';
import OpenAI from "openai";
import Fuse from 'fuse.js';

const openai = new OpenAI({ apiKey: SECRET_CHATGPT_API_KEY });

export async function GET({ url }) {
    const riddle = url.searchParams.get('riddle');
    const answer = url.searchParams.get('answer');
    const riddleAnswers = url.searchParams.get('riddleAnswers')?.split(",") || [];

    // Initialize Fuse.js with the list of possible answers and options for fuzzy matching
    const fuse = new Fuse(riddleAnswers, {
        includeScore: true,
        isCaseSensitive: false,
        // You can adjust these options for better matching performance
        findAllMatches: false,
        threshold: 0.1 // Lower means more strict matching
    });

    // Search for the provided answer within the riddleAnswers
    const fuseSearchResults = fuse.search(answer);

    // Check if a close match was found
    if (fuseSearchResults.length > 0 && fuseSearchResults[0].score <= 0.1) {
        // A match with a high enough score was found, return correct: true
        return new Response(JSON.stringify({ correct: true }), {
            status: 200,
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        });
    } else {
        // Proceed with ChatGPT validation if no close match was found
        const prompt = `Riddle: ${riddle}\nAnswer: ${answer}\nIs this answer similar enough to the answers provided below? It has to be 95% exact. Reply only with YES or NO. The riddle answers are: ${riddleAnswers.join(", ")}`;
        const completions = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
            temperature: 0.3,
        });

        const validation = completions.choices[0].message.content;
        if (validation?.toLowerCase() === 'yes') {
            return new Response(JSON.stringify({ correct: true }), {
                status: 200,
                headers: {
                    "content-type": "application/json; charset=UTF-8",
                },
            });
        } else {
            return new Response(JSON.stringify({ correct: false }), {
                status: 200,
                headers: {
                    "content-type": "application/json; charset=UTF-8",
                },
            });
        }
    }
}
