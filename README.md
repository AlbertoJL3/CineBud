# CineBud

CineBud is an AI-powered movie recommendation system that leverages ML/AI tools combined with Flask, MongoDB, PyMongo, and other Python frameworks to deliver personalized movie recommendations based on the user's unique preferences such as moods, movie details like runtime, or general theme of the plot.

## Overview

This project aims to build a sophisticated movie recommendation system that fetches movie data from the OMDb API, stores it in a MongoDB database, and uses AI to generate personalized movie recommendations. The system includes a React-based frontend for an intuitive user interface.
## UI 
![imagen](https://github.com/user-attachments/assets/62218823-4fde-4bab-bfb1-e54bcf2f76b5)

## Features

- Fetch and store movie data from the OMDb API in a MongoDB database
- AI-powered movie recommendations based on user prompts and preferences
- React-based frontend with a modern, responsive design
- User authentication and watchlist functionality
- Avoidance of duplicate entries in the database
- RESTful API for seamless frontend-backend communication

## Tech Stack

- **Backend**: Flask, PyMongo, ChatGPT API
- **Frontend**: React, React Router
- **Database**: MongoDB
- **APIs**: OMDb API, ChatGPT API

## Setup

### Prerequisites

- Python 3.x
- Node.js and npm
- MongoDB
- OMDb API Key
- ChatGPT API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AlbertoJL3/CineBud.git
   cd CineBud
2. **Set up the backend:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```
3. **Set up the frontend:**
   ```bash
   cd frontend
   npm install
   ```
4. **Environment Variables:**

   Create a .env file in the root directory and add your API keys
   ```
   OMDB_API_KEY=your_omdb_api_key
   CHATGPT_API_KEY=your_chatgpt_api_key
   MONGO_URI=your_mongodb_connection_string
   ```
5. Run the application:
   ```bash
   # Start the Flask backend
   python app_routes.py

   # In a new terminal, start the React frontend
   cd frontend
   npm start
   ```
### API Endpoints
```
POST /movies: Add a new movie to the database
GET /movies: Retrieve all movies from the database
GET /movies/<movie_id>: Retrieve a specific movie
PUT /movies/<movie_id>: Update a movie's information
DELETE /movies/<movie_id>: Delete a movie from the database
POST /movie_results: Get AI-generated movie recommendations based on user prompts
GET /popular_movies: Retrieve popular movies
```
### Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
License

This project is licensed under the MIT License - see the LICENSE.md file for details.
Acknowledgments
