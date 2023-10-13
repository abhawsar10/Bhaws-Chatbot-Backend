import { OpenAI } from "openai";
import { config } from 'dotenv';
import express from "express";
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

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


// Function to fetch the HTML content from the URL
async function fetchHTML(url) {
    
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching the HTML:', error);
        return null;
    }
}

// Function to extract and filter text content from the HTML
async function extractText(html) {
    
    if (!html) return null; 

    try {
        const $ = cheerio.load(html);

        // Remove script tags and their conten
        $('script').remove();
        $('iframe').remove();
        
        const descriptionElement = $('.content-review');
        console.log(descriptionElement)


        let info = {
            "description": descriptionElement.text(),
        }

        return info; 

    } catch (error) {
        console.error('Error extracting text:', error);
        return null;
    }
}

// Main function to fetch and filter text content
async function scrapeWebPage(url) {
    const html = await fetchHTML(url);
    const usefulContent = await extractText(html);
    if (usefulContent) {
        return usefulContent
    } else {
        console.log('No text content found.');
    }
}
  

// ========================================================================================================================
// ========================================================================================================================
// ========================================================================================================================


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.post('/generateChatResponse', async (req, res) => {

    const user_msg = req.body.user_msg || '';
    const bot_msg = await generateChatResponse(user_msg)
    res.json({ message: bot_msg});

});




app.post('/scrape_data', async (req, res) => {

    const url = req.body.url_to_crawl || '';
    let filtered_data = await scrapeWebPage(url)
    res.json({ filtered_data: filtered_data});


});