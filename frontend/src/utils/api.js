const BASE_URL = 'http://localhost:5001';

export const fetchMovies = async () => {
  const response = await fetch(`${BASE_URL}/movies`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const addMovie = async (title, year) => {
  const response = await fetch(`${BASE_URL}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, year }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateMovie = async (movieId, updateData) => {
  const response = await fetch(`${BASE_URL}/movies/${movieId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const deleteMovie = async (movieId) => {
  const response = await fetch(`${BASE_URL}/movies/${movieId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const submitPrompt = async (prompt) => {
  const formData = new FormData();
  formData.append('prompt', prompt);
  
  const response = await fetch(`${BASE_URL}/movie_results`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to process prompt');
  }

  const data = await response.json();
  console.log('submitPrompt response:', data);
  return data;
};

export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/popular_movies`, {
    method: 'GET'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
export const registerUser = async (username, email, password) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
};

export const loginUser = async (username, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
};

export const getUserProfile = async () => {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  return response.json();
};

export const updateUserProfile = async (updateData) => {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  return response.json();
};