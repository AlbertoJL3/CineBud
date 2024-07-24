# RecMe
This repo is for making a movie-recommendation system that leverages ML/AI tools combined with Flask, MongoDB, PyMongo and other python frameworks to deliver movie recommendations based on the user's unique preferences such as moods, movie details like runtime, or general theme of the plot. 

## Overview
This project aims to build a movie recommendation system that fetches movie data from the OMDb API and stores it in a MongoDB database. The data is then used to generate personalized movie recommendations based on user preferences.

## Features
- Fetch movie data from the OMDb API.
- Store movie data in a MongoDB database.
- Avoid duplicate entries in the database.
- Generate movie recommendations based on user preferences.

## Setup

### Prerequisites
- Python 3.x
- MongoDB
- OMDb API Key
- ChatGPT-API

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/AlbertoJL3/RecMe.git
   cd RecMe

2. **Create a venv and activate it**
```bash
   python -m venv venv

   # On Windows:
   venv\Scripts\activate

   # On macOS and Linux:
   source venv/bin/activate`
   ```
3. **Install dependencies**
```bash
   pip install -r requirements.txt
   ```
4. **Run app_routes.py**

#### API Endpoints
```  bash
POST /movies: Add a new movie to the database
GET /movies: Retrieve all movies from the database
GET /movies/<movie_id>: Retrieve a specific movie
PUT /movies/<movie_id>: Update a movies information
DELETE /movies/<movie_id>: Delete a movie from the database
POST /recommendations: Get movie recommendations based on user preferences
```

#### Contributing
- Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.
License
- This project is licensed under the MIT License - see the LICENSE.md file for details.
Acknowledgments
- OMDb API for providing movie data
- Hugging Face for NLP tools (if used)
