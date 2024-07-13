from transformers import GPT2Tokenizer

# Load a tokenizer
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

def tokenize(text):
    # Tokenize the text
    tokens = tokenizer.encode(text)

    print("Tokens:", tokens)
    print("Token count:", len(tokens))

