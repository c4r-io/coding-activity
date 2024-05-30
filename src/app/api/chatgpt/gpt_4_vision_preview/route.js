import OpenAI from "openai";
const apiKey = process.env.OPENAI_API_KEY;
// Pass the API key when creating the OpenAI object
export async function GET(req, context) {
    const openai = new OpenAI({
        apiKey,
    });
    const models = await openai.models.list();
    // start if
    if(models){
        return Response.json(models, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        }
        );
    }
    return Response.json(
        { models: [], message: 'No models found'},
        { status: 400 },
    );
}
export async function POST(req, context) {
    const body = await req.json();
    // console.log(req)
    // start if
    const messages = body['messages']
    const model = body['model'] || "gpt-4-turbo-2024-04-09"
    if (messages) {
        const openai = new OpenAI({
            apiKey,
        });
        const openAi = await openai.chat.completions.create({
            model: model,
            messages,
        });
        const message = openAi.choices[0];
        return Response.json(message, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        }
        );
        // end if
    } else {
        return Response.json(
            { message: 'messages required' },
            { status: 400 },
        );
    }
}
