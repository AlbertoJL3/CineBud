import openai
import os
from dotenv import load_dotenv
import json
import re
from unidecode import unidecode

# Load environment variables from the .env file
load_dotenv()

# Set the OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')  # Ensure this matches the key name in your .env file

def clean_text(text):
    # Remove accents and convert to ASCII
    text = unidecode(text)
    # Keep only alphanumeric characters
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text

def get_chatgpt_response(input_prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a movie recommender. Only reply movie title and year in csv format (movie title as title and year as year, strip commas from the titles). Always recommend 100 titles. Include titles with quotations. Don't recommend duplicates."},
            {"role": "user", "content": input_prompt}
        ]
    )
    print(response['usage'])
    return response['choices'][0]['message']['content']

def handle_prompt(prompt):
# Parse the string into a Python dictionary
    content = get_chatgpt_response(prompt)
   
    print(content)
    
     # Process the content and write to JSON file    
    # Write to JSON file
    with open('movies.csv', 'w', newline='', encoding='utf-8') as f:
        f.write('title,year\n')
        f.write(content)
    return content

def load_movies_from_json(filename='movies.json'):
    try:
        with open(filename, 'r') as file:
            movies = json.load(file)
            print('Movies from load_movies function: ', movies)
        return movies
    except FileNotFoundError:
        print(f"Error: {filename} not found.")
        return {}
    except json.JSONDecodeError:
        print(f"Error: {filename} is not a valid JSON file.")
        return {}
    except Exception as e:
        print(f"An unexpected error occurred while reading {filename}: {str(e)}")
        return {}
    