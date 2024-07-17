import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust this to match your backend URL


export const fetchMovie = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
}

export const fetchMovies = async () => {
  try {
    const response = await axios.get(`${API_URL}/movies`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}
