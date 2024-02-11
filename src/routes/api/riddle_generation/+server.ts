import { SECRET_CHATGPT_API_KEY, SECRET_WEBHOOK_URL, SECRET_ASSISTANT_ID } from '$env/static/private';
import OpenAI from "openai";
import fs from 'fs';

const openai = new OpenAI({ apiKey: SECRET_CHATGPT_API_KEY });
const webhook_url = SECRET_WEBHOOK_URL;

function generateRandomString() {
    const length = 48;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function sendWebhookEmbedToDiscord(riddle, answers, riddleHint) {
    const data = {
        content: '',
        embeds: [
            {
                title: 'Riddle Generation',
                description: `**Riddle:** ${riddle}\n**Answers:** ${answers}`,
                color: 16777215,
                timestamp: new Date().toISOString(),
            },
        ],
    };

    await fetch(webhook_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export async function GET({ url }) {
    const file_url = "/riddles.json"; // path to the riddle file
    let file

    // read the file
    let data
    if (fs.existsSync(file_url)) {
        data = fs.readFileSync(file_url, 'utf8');
    }
    else {
        data = "";
    }

    // parse the data
    const riddles = JSON.parse(data);
    const random_number = Math.floor(Math.random() * Object.keys(riddles).length);
    const riddle = riddles[random_number];
    const riddleData = riddle[0]

    const returnedRiddleObject = {
        "riddle": riddleData.question,
        "answer": riddleData.answer,
        "hint": undefined,
    }

    sendWebhookEmbedToDiscord(riddleData.question, riddleData.answer);

    return new Response(JSON.stringify(returnedRiddleObject), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=UTF-8",
        },
    });
}

/*
let threadId = url.searchParams.get('thread') || "null";
    let thread;
    if(threadId === "null" || undefined) {
        thread = await openai.beta.threads.create();
        const message = await openai.beta.threads.messages.create(
            "thread_JHhiwt4w8yrEudm6iGcL3dFu",
            {
                role: "user",
                content: "GENERATE A NEW AND UNIQUE RIDDLE BASED OFF YOUR DATA. DO NOT COPY YOUR DATA, ONLY USE IT AS A BASIS TO GENERATE NEW RIDDLES. RETURN A JSON OBJECT WITH THE 3 KEY VALUE PAIRS."
            }
        );
    } else {
        console.log('Thread ID:', threadId);
        thread = await openai.beta.threads.retrieve(threadId);
    }
    if(!thread) {
        return new Response(JSON.stringify({ error: 'Thread creation failed' }), {
            status: 500,
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        }) as Response;
    }

    try {    
        const run = await openai.beta.threads.runs.create(
            "thread_JHhiwt4w8yrEudm6iGcL3dFu",
            {
                assistant_id: "asst_Enw6qs4nOzkUXMd3FnslZy19",
                tools: [{ type: "retrieval" }],
                model: "gpt-3.5-turbo-0125",
            }
        )   
    
        let runData = await openai.beta.threads.runs.retrieve(
            "thread_JHhiwt4w8yrEudm6iGcL3dFu",
            run.id
        );
    
        while(runData.status === 'in_progress') {
            console.log('Waiting for completion...');
            await new Promise(r => setTimeout(r, 500));
            runData = await openai.beta.threads.runs.retrieve(
                "thread_JHhiwt4w8yrEudm6iGcL3dFu",
                run.id
            );
        }
    
        const messages = await openai.beta.threads.messages.list(
            "thread_JHhiwt4w8yrEudm6iGcL3dFu"
        );
    
        const messagesData = messages.data;
        // Get latest message by the timestamp instead of using length - 1
        const latestMessage = messagesData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
        const riddle = latestMessage;
        const riddleValue = riddle.content[0].text.value
        const riddleObject = JSON.parse(riddleValue);
        const returnedRiddleObject = {
            "riddle": riddleObject.riddle.split('-')[0], // We split so we don't get the weird dash at the end.
            "answer": riddleObject.answer,
            "hint": riddleObject.hint,
            "threadId": thread.id,
        }

        console.log(riddleValue)
    
        return new Response(JSON.stringify(returnedRiddleObject), {
            status: 200,
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Riddle generation failed' }), {
            status: 500,
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        }) as Response;
    }
*/

/*
export async function GET({  }) {
    const prompt = `Craft a super short, concise, clever riddle that engages and puzzles me. The riddle should be original, unexpected, and showcase creativity in its construction. Aim for something that challenges my thinking, with a twist or clever insight that requires a moment of reflection to solve. The tone can be whimsical or intriguing, but the riddle should be memorable for its cleverness and ingenuity. After presenting the riddle, add a newline, followed by a dash. Then, after the answer, followed by another dash, send a clear and concise hint for the riddle that doesn't reveal the answer completely. Make sure the riddle and its solution are concise, engaging, and leave a lasting impression. You MUST seperate them by a dash, if you don't, the riddle will not work.`;
    const completions = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
        temperature: 1.3,
    })
    const riddle = completions.choices[0].message.content;  
    console.log(riddle);
    if(riddle?.includes('-')) {
        let answers = riddle?.split('-')[1]
        if(answers?.length > 1) {
            answers = answers?.split(',')
        }   
        const riddleMessage = riddle?.split('-')[0];
        const riddleHint = riddle?.split('-')[1];
        console.log(riddle?.split('-'));
        console.log(riddleHint);
        const data = {
            riddle: riddleMessage,
            answers: [answers],
            hint: riddleHint,
        }

        sendWebhookEmbedToDiscord(riddleMessage, answers, riddleHint);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        }) as Response;
    } else {
        return new Response(JSON.stringify({ error: 'Riddle generation failed' }), {
            status: 500,
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        }) as Response;
    }
}       
*/