// src/components/GradientBackground.js
// Gradient Background for the App
import React from 'react';
import '../../styles/gradient.css';

function GradientBackground({ children }) {
  return (
    <div className="gradient-background">
      {children}
    </div>
  );
}

export default GradientBackground;