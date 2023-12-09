const fs = require('fs');
const readline = require('readline');

// File paths
const json_data_path = "learning_bot_data.json";

// Function to train the bot with user input
function trainBot(inputText, responses, rl) {
    return new Promise((resolve) => {
        rl.question(`Enter the response for '${inputText}': `, (response) => {
            responses[inputText] = response;
            resolve(responses);
        });
    });
}

// Function to save the trained data to a JSON file
function saveBotData(responses) {
    const jsonData = JSON.stringify(responses, null, 4);
    fs.writeFileSync(json_data_path, jsonData);
}

// Function to load the trained data from a JSON file
function loadBotData() {
    let responses = {};
    if (fs.existsSync(json_data_path)) {
        const jsonData = fs.readFileSync(json_data_path, 'utf8');
        responses = JSON.parse(jsonData);
    }
    return responses;
}

// Load existing responses or start with an empty object
let botResponses = loadBotData();

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Chat with the bot
async function chatWithBot() {
    while (true) {
        const userInput = await getUserInput(rl, "You: ");
        if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'stop') {
            rl.close();
            break;
        } else if (userInput in botResponses) {
            const response = botResponses[userInput];
            console.log(`Ricky: ${response}`);
        } else {
            console.log("RickyAITrainingNotification: I don't know how to respond to that. Please provide a response. Type 'Yes' if you would like to train a new response.");
            const newResponse = await getUserInput(rl, "You: ");
            if (newResponse.toLowerCase() === 'yes') {
                botResponses = await trainBot(userInput, botResponses, rl);
                saveBotData(botResponses);
            }
        }
    }
}

// Function to get user input
function getUserInput(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

// Start the conversation
chatWithBot();
