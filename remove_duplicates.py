import pandas as pd
from backend.controllers import process_movies


movies_data = pd.read_csv('popularity_movies.csv')
# Remove duplicates and extract the year from the release_date
movies_data = movies_data.drop_duplicates(subset=['title'])
movies_data['year'] = pd.to_datetime(movies_data['release_date']).dt.year
movies_data = movies_data[['title', 'year']]
print(movies_data)

movies = []
for _, row in movies_data.iterrows():
# Fetch detailed movie data using the fetch_movie_data function
    print('processing: ', row)
    try: 
        movie_data = process_movies(row['title'], str(row['year']))
        # Delete row after reading
        movies_data = movies_data.drop(index=row)
    except KeyError: 
        print('error: ', row)
   