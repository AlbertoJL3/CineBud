import pandas as pd
from backend.controllers import process_movies

# Load and clean the data
movies_data = pd.read_csv('top_rated_movies.csv')
movies_data = movies_data.drop_duplicates(subset=['title'])
movies_data['year'] = pd.to_datetime(movies_data['release_date']).dt.year
movies_data = movies_data[['title', 'year']]

# Calculate the total number of movies
total_movies = len(movies_data)
print(f"Total movies to process: {total_movies}")

movies = []
# Iterate over the dataframe rows with a progress counter
for idx, row in enumerate(movies_data.iterrows(), 1):
    print(f"Processing {idx}/{total_movies} ({(idx / total_movies) * 100:.2f}%) - {row[1]['title']} ({row[1]['year']})")
    try: 
        movie_data = process_movies(row[1]['title'], str(row[1]['year']))
        movies.append(movie_data)
    except KeyError: 
        print(f"Error processing: {row[1]['title']} ({row[1]['year']})")

print("Processing complete.")
