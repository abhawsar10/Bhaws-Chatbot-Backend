import { OpenAI } from "openai";
import { config } from 'dotenv';
import express from "express";
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

export async function generateChatResponse(message){
    
    config()
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

    const chatcompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message}]
    });
    
    return chatcompletion.choices[0].message.content
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.get('/', async (req, res) => {
    res.json({ message: "these are not the pages you're looking for"});
});



app.post('/generateChatResponse', async (req, res) => {

    const user_msg = req.body.user_msg || '';
    const bot_msg = await generateChatResponse(user_msg)
    res.json({ message: bot_msg});

});
