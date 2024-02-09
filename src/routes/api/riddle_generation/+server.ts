import { SECRET_CHATGPT_API_KEY } from '$env/static/private';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: SECRET_CHATGPT_API_KEY });

function generateRandomString() {
    const length = 48;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export async function GET({  }) {
    const prompt = `Generate a riddle about anything, make it difficult and clever. Make it unique each time. Don't make it super long. Only send the text, no images or links, and nothing but just the riddle question. Then, add a - at the end and then the answer(s), max 3 answers seperated by a comma with no spaces between and no other unnneceessary strings. ${generateRandomString()}`;
    const completions = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
        temperature: 1,
    })
    const riddle = completions.choices[0].message.content;
    const answers = riddle?.split('-')[1].split(',');
    const riddleMessage = riddle?.split('-')[0];
    const data = {
        riddle: riddleMessage,
        answers: [answers]
    }
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=UTF-8",
        },
    }) as Response;
}       