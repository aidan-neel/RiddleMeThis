import { SECRET_CHATGPT_API_KEY } from '$env/static/private';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: SECRET_CHATGPT_API_KEY });

export async function GET({ url }) {
    const riddle = url.searchParams.get('riddle');
    const answer = url.searchParams.get('answer');
    const riddleAnswers = url.searchParams.get('riddleAnswers');
    const prompt = `Riddle: ${riddle}\nAnswer: ${answer}\n Is this answer similar enough to the answers provided below? It has to be 95% exact. Reply only with YES or NO. The riddle answers are: ${riddleAnswers}`;
    const completions = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
        temperature: 0.1,
    })

    const validation = completions.choices[0].message.content;
    console.log(validation);
    if (validation?.toLowerCase() === 'yes') {
        const data = {
            correct: true
        }
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        }) as Response;
    } else {
        const data = {
            correct: false
        }
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        }) as Response;
    }
}