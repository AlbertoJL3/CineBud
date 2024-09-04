import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchMovies = () => axiosInstance.get('/movies').then(res => res.data);

export const addMovie = (title, year) => axiosInstance.post('/movies', { title, year }).then(res => res.data);

export const updateMovie = (movieId, updateData) => axiosInstance.put(`/movies/${movieId}`, updateData).then(res => res.data);

export const deleteMovie = (movieId) => axiosInstance.delete(`/movies/${movieId}`).then(res => res.data);

export const submitPrompt = (prompt) => {
  const formData = new FormData();
  formData.append('prompt', prompt);
  return axiosInstance.post('/movie_results', formData).then(res => res.data);
};

export const getPopularMovies = () => axiosInstance.get('/popular_movies').then(res => res.data);

export const registerUser = (username, email, password) => 
  axios.post(`${BASE_URL}/register`, { username, email, password }).then(res => res.data);

export const loginUser = (username, password) => 
  axios.post(`${BASE_URL}/login`, { username, password }).then(res => res.data);

export const getUserProfile = () => axiosInstance.get('/profile').then(res => res.data);

export const updateUserProfile = (updateData) => axiosInstance.put('/profile', updateData).then(res => res.data);

export const logoutUser = () => axiosInstance.post('/logout').then(res => res.data);