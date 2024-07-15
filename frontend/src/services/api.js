import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Adjust this to match your backend URL

export const fetchMovies = async () => {
  try {
    const response = await axios.get(`${API_URL}/movies`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};