from transformers import GPT2Tokenizer, BertTokenizer, BertModel
import torch
# Load a tokenizer
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

def tokenize(text):
    # Tokenize the text
    tokens = tokenizer.encode(text)

    print("Tokens:", tokens)
    print("Token count:", len(tokens))

# Load pre-trained model tokenizer (vocabulary)
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Load pre-trained model
model = BertModel.from_pretrained('bert-base-uncased')

# Encode text
text = "I want a thought-provoking sci-fi movie with elements of time travel"
encoded_input = tokenizer(text, return_tensors='pt')

# Forward pass, get hidden states
with torch.no_grad():
    output = model(**encoded_input)
    
tokenize(text)
print(output)
# Use the output for your specific task (e.g., feature extraction, classification)