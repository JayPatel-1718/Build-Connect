// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import OnboardingPage from './components/OnboardingPage';
import OnboardingPage2 from './components/OnboardingPage2';
import Footer from './components/Footer'; // 👈 Import footer
import styled from 'styled-components';
import OnboardingPage3 from './components/OnboardingPage3';
import HomePage from './components/HomePage';

// Wrapper to add padding for fixed footer
const PageWrapper = styled.div`
  padding-bottom: 60px; /* Make space for fixed footer */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <PageWrapper><LoginPage /></PageWrapper>
            <Footer />
          </>
        } />
        <Route path="/onboarding" element={
          <>
            <PageWrapper><OnboardingPage /></PageWrapper>
            <Footer />
          </>
        } />
        <Route path="/onboarding2" element={
          <>
            <PageWrapper><OnboardingPage2 /></PageWrapper>
            <Footer />
          </>
        } />
                <Route path="/onboarding3" element={
          <>
            <PageWrapper><OnboardingPage3 /></PageWrapper>
            <Footer />
          </>
                } />
          <Route path="/homepage" element={
          <>
            <PageWrapper><HomePage /></PageWrapper>
            <Footer />
          </>
                } />
      </Routes>
    </Router>
  );
}

export default App;