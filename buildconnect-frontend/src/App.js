import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import OnboardingPage from './components/OnboardingPage';
import OnboardingPage2 from './components/OnboardingPage2'; // 👈 Import new page
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/onboarding2" element={<OnboardingPage2 />} /> {/* 👈 New route */}
      </Routes>
    </Router>
  );
}

export default App;