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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Logout user or handle refresh token failure
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
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

export const getPopularMovies = (page = 1, perPage = 15) => 
  axiosInstance.get(`/popular-movies?page=${page}&per_page=${perPage}`).then(res => res.data);

export const registerUser = (username, email, password) => 
  axios.post(`${BASE_URL}/register`, { username: username.toLowerCase(), email: email.toLowerCase(), password }).then(res => res.data);

export const loginUser = (userInput, password) => 
  axios.post(`${BASE_URL}/login`, { username: userInput, email: userInput, password }).then(res => res.data);

export const getUserProfile = () => axiosInstance.get('/profile').then(res => res.data);

export const updateUserProfile = (updateData) => axiosInstance.put('/profile', updateData).then(res => res.data);

export const logoutUser = () => axiosInstance.post('/logout').then(res => res.data);

export const addToWatchlist = (movieId) => axiosInstance.post('/watchlist', { movieId }).then(res => res.data);

export const removeFromWatchlist = (movieId) => axiosInstance.delete(`/watchlist/${movieId}`).then(res => res.data);

export const getWatchlist = () => axiosInstance.get('/watchlist').then(res => res.data);

export const refreshToken = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  return axios.post(`${BASE_URL}/refresh-token`, { refreshToken }).then(res => {
    localStorage.setItem('token', res.data.access_token);
    return res.data;
  });
};

export const getTopRatedMovies = (page = 1, perPage = 15) => 
  axiosInstance.get(`/top-rated-movies?page=${page}&per_page=${perPage}`)
    .then(res => {
      return res.data;
    })
    .catch(error => {
      throw error;
    });

export const getBestOf70s = () => 
  axiosInstance.get(`/best-of-70s`)
    .then(res => {
      console.log(res.data)
      return res.data;
    })
    .catch(error => {
      return error;
    });

export const getBestOf80s = () => 
  axiosInstance.get(`/best-of-80s`)
    .then(res => {
      console.log(res.data)
      return res.data;
    })
    .catch(error => {
      return error;
    });
export const getBestOf90s = () => 
  axiosInstance.get(`/best-of-90s`)
    .then(res => {
      console.log(res.data)
      return res.data;
    })
    .catch(error => {
      return error;
    });
    
export const savePromptResults = (prompt, movieIds) => 
  axiosInstance.post('/save_prompt_results', { prompt, movie_ids: movieIds }).then(res => res.data);

export const getPromptResults = () => 
  axiosInstance.get('/get_prompt_results').then(res => res.data);