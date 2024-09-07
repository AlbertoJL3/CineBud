import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../src/utils/AuthContext';
import Movies from './pages/Movies';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/NavBar';
import GradientBackground from './components/styles/gradient';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/movies" element={<PrivateRoute><Movies /></PrivateRoute>} />
        <Route path="/watchlist" element={<PrivateRoute><Watchlist /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <GradientBackground>
        <AppContent />
      </GradientBackground>
    </AuthProvider>
  );
}

export default App;