// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import OnboardingPage from './components/OnboardingPage';
import OnboardingPage2 from './components/OnboardingPage2';
import OnboardingPage3 from './components/OnboardingPage3';
import HomePage from './components/HomePage';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import ProfilePage from './components/ProfilePage';
import CommunityPage from './components/CommunityPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/onboarding2" element={<OnboardingPage2 />} />
        <Route path="/onboarding3" element={<OnboardingPage3 />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/dashboard" element={< ProfessionalDashboard/>} />
        <Route path="/profile/:userId" element={<ProfilePage />} /> 
     <Route path="/community" element={<CommunityPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;