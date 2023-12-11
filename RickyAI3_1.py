import json
import os
import requests

# File paths
json_data_path = "learning_bot_data.json"

# Function to train the bot with user input
def train_bot(input_text, responses):
    response = input(f"Enter the response for '{input_text}': ")
    responses[input_text] = response
    return responses

# Function to save the trained data to a JSON file
def save_bot_data(responses):
    with open(json_data_path, 'w') as file:
        json.dump(responses, file, indent=4)

# Function to load the trained data from a JSON file
def load_bot_data():
    responses = {}
    if os.path.exists(json_data_path):
        with open(json_data_path, 'r') as file:
            responses = json.load(file)
    return responses

# Function to perform a Google search
def google_search(query, api_key, cx):
    base_url = "https://www.googleapis.com/customsearch/v1"
    params = {
        'q': query,
        'key': api_key,
        'cx': cx,
    }

    response = requests.get(base_url, params=params)
    results = response.json()

    if 'items' in results and len(results['items']) > 0:
        top_result = results['items'][0]
        return f"Title: {top_result['title']}\nLink: {top_result['link']}\nSnippet: {top_result.get('snippet', 'N/A')}"
    else:
        return "No results found on Google."

# Load existing responses or start with an empty dictionary
bot_responses = load_bot_data()

# Google API key and custom search engine ID
google_api_key = 'AIzaSyAOll73Mr1n4FjdRKWP0hbNVO3hplCGoXM'
google_cx = '8007ac92de2d449f9'

# Chat with the bot
print("Welcome to RickyAI 3.1 Turbo Fly")
while True:
    user_input = input("You: ")
    if user_input.lower() in ['exit', 'stop']:
        break

    if user_input in bot_responses:
        response = bot_responses[user_input]
    else:
        print("RickyAIFramework: Searching Google")
        response = google_search(user_input, google_api_key, google_cx)
        print(f"Ricky: {response}")
        continue

    print(f"Ricky: {response}")

# Replace 'YOUR_API_KEY' and 'YOUR_CX' with your actual API key and custom search engine ID
api_key = 'AIzaSyAOll73Mr1n4FjdRKWP0hbNVO3hplCGoXM',
cx = '8007ac92de2d449f9'



