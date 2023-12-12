const fs = require('fs');
const readline = require('readline');
const axios = require('axios');

// File paths
const json_data_path = 'learning_bot_data.json';

// Function to train the bot with user input
async function trainBot(inputText, responses) {
  const response = await askQuestion(`Enter the response for '${inputText}': `);
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
    const data = fs.readFileSync(json_data_path, 'utf-8');
    responses = JSON.parse(data);
  }
  return responses;
}

// Function to perform a Google search
async function googleSearch(query, apiKey, cx) {
  const base_url = 'https://www.googleapis.com/customsearch/v1';
  const params = {
    q: query,
    key: apiKey,
    cx: cx,
  };

  try {
    const response = await axios.get(base_url, { params });
    const results = response.data;

    if ('items' in results && results.items.length > 0) {
      const topResult = results.items[0];
      return `Title: ${topResult.title}\nLink: ${topResult.link}\nSnippet: ${topResult.snippet || 'N/A'}`;
    } else {
      return 'No results found on Google.';
    }
  } catch (error) {
    console.error('Error during Google search:', error.message);
    return 'Error during Google search.';
  }
}

// Function to ask a question and return the user's input
async function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Load existing responses or start with an empty object
const botResponses = loadBotData();

// Google API key and custom search engine ID
const googleApiKey ='AIzaSyAOll73Mr1n4FjdRKWP0hbNVO3hplCGoXM';
const googleCx = '8007ac92de2d449f9';
// Chat with the bot
console.log('Welcome to RickyAI 3.1 Turbo Fly');
(async () => {
  while (true) {
    const userInput = await askQuestion('You: ');
    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'stop') {
      break;
    }

    let response;
    if (userInput in botResponses) {
      response = botResponses[userInput];
    } else {
      console.log('RickyAIFramework: Searching Google');
      response = await googleSearch(userInput, googleApiKey, googleCx);
      console.log(`Ricky: ${response}`);
      continue;
    }

    console.log(`Ricky: ${response}`);
  }
})();
