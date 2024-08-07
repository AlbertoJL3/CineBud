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