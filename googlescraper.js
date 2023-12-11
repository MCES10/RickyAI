const fs = require('fs');
const axios = require('axios');

// File paths
const json_data_path = 'learning_bot_data.json';

// Function to train the bot with user input
function trainBot(inputText, responses) {
    const response = promptSync(`Enter the response for '${inputText}': `);
    responses[inputText] = response;
    return responses;
}

// Function to save the trained data to a JSON file
function saveBotData(responses) {
    fs.writeFileSync(json_data_path, JSON.stringify(responses, null, 4));
}

// Function to load the trained data from a JSON file
function loadBotData() {
    let responses = {};
    if (fs.existsSync(json_data_path)) {
        responses = JSON.parse(fs.readFileSync(json_data_path, 'utf-8'));
    }
    return responses;
}

// Function to perform a Google search
async function googleSearch(query, apiKey, cx) {
    const baseUrl = 'https://www.googleapis.com/customsearch/v1';
    const params = {
        q: query,
        key: apiKey,
        cx: cx,
    };

    try {
        const response = await axios.get(baseUrl, { params });
        const results = response.data;

        if (results.items && results.items.length > 0) {
            const topResult = results.items[0];
            return `Title: ${topResult.title}\nLink: ${topResult.link}\nSnippet: ${topResult.snippet || 'N/A'}`;
        } else {
            return 'No results found on Google.';
        }
    } catch (error) {
        console.error('Error making Google search request:', error.message);
        return 'An error occurred while searching on Google.';
    }
}

// Load existing responses or start with an empty object
let botResponses = loadBotData();

// Google API key and custom search engine ID
const googleApiKey = 'YOUR_GOOGLE_API_KEY';
const googleCx = 'YOUR_GOOGLE_CX';

// Simple synchronous prompt function for the console
function promptSync(question) {
    const readlineSync = require('readline-sync');
    return readlineSync.question(question);
}

// Chat with the bot
while (true) {
    const userInput = promptSync('You: ');
    if (['exit', 'stop'].includes(userInput.toLowerCase())) {
        break;
    }

    if (userInput in botResponses) {
        console.log(`Ricky: ${botResponses[userInput]}`);
    } else {
        console.log("RickyAITrainingNotification: I don't know how to respond to that.");
        const response = await googleSearch(userInput, googleApiKey, googleCx);
        console.log(`Ricky: ${response}`);
        if (promptSync("Type 'Yes' if you would like to train a new response: ").toLowerCase() === 'yes') {
            botResponses = trainBot(userInput, botResponses);
            saveBotData(botResponses);
        }
    }
}
