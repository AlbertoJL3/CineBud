import openai
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Set the OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')  # Ensure this matches the key name in your .env file

def get_chatgpt_response(input_prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a movie recommender. Recommend 40 movies at a time. Only recommend movie title and year in json format."},
            {"role": "user", "content": input_prompt}
        ]
    )
    print(response['usage'])
    return response['choices'][0]['message']['content']

print(get_chatgpt_response('I feel like a happy ending.'))