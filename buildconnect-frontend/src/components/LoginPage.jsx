import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGoogle } from 'react-icons/fa';  
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optional: Save user to Firestore
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        email: user.email,
        createdAt: new Date(),
      }, { merge: true });

      navigate('/onboarding');
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. ';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      }
      
      alert(errorMessage + '\nError: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  setLoading(true);

  try {
    console.log('Google sign-in starting...');
    const result = await signInWithPopup(auth, provider);
    console.log('Google sign-in successful:', result.user.uid);

    // Skip Firestore save temporarily to test navigation
    console.log('Skipping Firestore save for now...');
    
    console.log('Navigating to /onboarding...');
    navigate('/onboarding');
    console.log('Navigation completed!');
    
  } catch (error) {
    console.error('Google login error:', error);
    alert('Google login failed: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  const saveUserToFirestore = async (user) => {
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date(),
    }, { merge: true });
  };

  return (
    <Container>
      <Card>
        <LogoSection>
          <LogoIcon>
            <img src="/logo.png" alt="BuildConnect" style={{ width: '40px', height: '40px' }} />
          </LogoIcon>
          <LogoText>
            <strong>BuildConnect</strong><br />
            <small>by PixelFusion</small>
          </LogoText>
        </LogoSection>

        <Title>Get started</Title>

        <Subtitle>
          Sign up or log in to start browsing the perfect service that suits your need,<br />
          or start finding work by making your portfolio strong.
        </Subtitle>

        <Form onSubmit={handleLogin}>
          <Label>Email :</Label>
          <InputWrapper>
            <EmailInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="someone@example.com"
              required
            />
          </InputWrapper>

          <Label>Password :</Label>
          <InputWrapper>
            <EmailInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </InputWrapper>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Logging in...' : (
              <>
                Login
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </SubmitButton>
        </Form>

        <Divider>- Or sign in with -</Divider>

        <SocialButtons>
          <SocialButton onClick={signInWithGoogle} disabled={loading}>
            <FaGoogle size={20} color="#DB4437" />
          </SocialButton>
        </SocialButtons>

        <SignupLink>
          New Here? <a href="/signup">Sign Up Here</a>
        </SignupLink>
      </Card>
    </Container>
  );
};

// --- STYLED COMPONENTS (Keep your existing ones) ---
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

const LogoIcon = styled.div``;

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
  line-height: 1.5;
  margin: 0 0 24px 0;
  text-align: left;
`;

const Form = styled.form`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  text-align: left;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const EmailInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
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
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #333;
  }

  svg {
    margin-left: 8px;
  }
`;

const Divider = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999;
  margin: 24px 0;
  position: relative;
  line-height: 1;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 30%;
    height: 1px;
    background: #ddd;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const SocialButton = styled.button`
  background: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #eee;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SignupLink = styled.div`
  text-align: center;
  font-size: 14px;
  color: #666;

  a {
    color: #007bff;
    text-decoration: underline;
    font-weight: 500;
    margin-left: 4px;

    &:hover {
      color: #0056b3;
    }
  }
`;

export default LoginPage;