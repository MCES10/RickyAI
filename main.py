import json
import os

# File paths
json_data_path = "learning_bot_data.json"

# Function to train the bot with user input
def train_bot(input_text, responses):
    response = input("Enter the response for '{}': ".format(input_text))
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

# Load existing responses or start with an empty dictionary
bot_responses = load_bot_data()

# Chat with the bot
while True:
    user_input = input("You: ")
    if user_input.lower() == 'exit' + 'stop':
        break
    if user_input in bot_responses:
        response = bot_responses[user_input]
    else:
        print("RickyAITrainingNotification: I don't know how to respond to that. Please provide a response. Type Yes if you would like to train a new response.")
        response = input("You: ")
        bot_responses = train_bot(user_input, bot_responses)
        save_bot_data(bot_responses)
       
    print("Ricky:", response)
