import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const OnboardingPage1 = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const user = auth.currentUser;
      if (!user) {
        alert('User not authenticated. Please log in again.');
        navigate('/');
        return;
      }

      console.log('Saving user data...'); // 👈 DEBUG: Log start

      // Store name in Firestore
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        userId: user.uid,
        email: user.email,
        createdAt: new Date(),
      }, { merge: true });

      console.log('User name saved:', { firstName, lastName }); // 👈 DEBUG: Log success
      
      // Navigate to Onboarding 2
      console.log('Navigating to /onboarding2...'); // 👈 DEBUG: Log navigation
      navigate('/onboarding2');
      console.log('Navigation completed!'); // 👈 DEBUG: Log completion
      
    } catch (error) {
      console.error('Error saving name:', error); // 👈 DEBUG: Log error
      alert('Failed to save your information. Please try again.\nError: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <LogoSection>
          <LogoIcon>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="20" height="20" stroke="black" strokeWidth="2" rx="2"/>
              <line x1="20" y1="10" x2="20" y2="30" stroke="black" strokeWidth="2"/>
              <line x1="10" y1="20" x2="30" y2="20" stroke="black" strokeWidth="2"/>
            </svg>
          </LogoIcon>
          <LogoText>
            <strong>BuildConnect</strong><br />
            <small>by PixelFusion</small>
          </LogoText>
        </LogoSection>

        <Title>Let's get to know you!</Title>
        <Subtitle>Please enter your name to personalize your experience.</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Label>First Name</Label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </InputWrapper>

          <InputWrapper>
            <Label>Last Name</Label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </InputWrapper>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Next Step →'}
          </SubmitButton>
        </Form>
      </Card>
    </Container>
  );
};

// --- STYLED COMPONENTS ---
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  width: 100%;
  max-width: 400px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const LogoIcon = styled.div`
  svg {
    fill: none;
    stroke: black;
    stroke-width: 2;
  }
`;

const LogoText = styled.div`
  strong {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  small {
    font-size: 12px;
    color: #666;
    display: block;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  text-align: left;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  text-align: left;
`;

const Form = styled.form`
  margin-top: 16px;
`;

const InputWrapper = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: 'Poppins', sans-serif;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: #000;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  width: 100%;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.95;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default OnboardingPage1;