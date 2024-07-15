import openai
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from the .env file
load_dotenv()

client = OpenAI(
  api_key = os.getenv('OPEN_API_KEY')  # this is also the default, it can be omitted
)

def get_chatgpt_response(input_prompt):
    response = client.completions.create(
        model="gpt-3.5-turbo",
        prompt = input_prompt
    )
    return response['choices'][0]['message']['content'].strip()



# Example usage
prompt = "Can you recommend a feel-good comedy movie?"
response = get_chatgpt_response(prompt)
print(response)
