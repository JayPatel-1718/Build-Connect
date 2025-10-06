import React from 'react';
import styled from 'styled-components';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // 👈 Added for navigation

const LoginPage = () => {
  const navigate = useNavigate(); // 👈 Initialize navigate

  return (
    <Container>
      <Card>
        {/* 🔧 LOGO SECTION — CHANGE ICON OR TEXT HERE */}
        <LogoSection>
          {/* 👇 LINE 15: CHANGE THIS SVG TO YOUR OWN LOGO (or replace with img tag) */}
          <LogoIcon>
            <img src="/logo.png" alt="BuildConnect" style={{ width: '40px', height: '40px' }} />
          </LogoIcon>
          {/* 👇 LINE 25: CHANGE "BuildConnect" or "by PixelFusion" text here */}
          <LogoText>
            <strong>BuildConnect</strong><br />
            <small>by PixelFusion</small>
          </LogoText>
        </LogoSection>

        {/* 👇 LINE 33: CHANGE HEADING TEXT — "Get started" */}
        <Title>Get started</Title>

        {/* 👇 LINE 37: CHANGE SUBTITLE TEXT — adjust alignment, line break, etc. */}
        <Subtitle>
          Sign up or log in to start browsing the perfect service that suits your need,<br />
          or start finding work by making your portfolio strong.
        </Subtitle>

        {/* 👇 LINE 46: EMAIL LABEL — CHANGE TEXT OR STYLE */}
        <Form>
          <Label>Email :</Label>
          <InputWrapper>
            {/* 👇 LINE 51: PLACEHOLDER TEXT — change "someone@example.com" */}
            <EmailInput placeholder="someone@example.com" />
            {/* 👇 LINE 54: SUBMIT BUTTON — change icon, color, shape */}
            <SubmitButton onClick={() => navigate('/onboarding')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </SubmitButton>
          </InputWrapper>
        </Form>

        {/* 👇 LINE 65: DIVIDER TEXT — change "- Or sign in with -" */}
        <Divider>- Or sign in with -</Divider>

        {/* 👇 LINE 69: SOCIAL BUTTONS — CHANGE ICONS, COLORS, ORDER */}
        <SocialButtons>
          {/* 👇 LINE 72: GOOGLE ICON — change color or replace with FaApple, FaMicrosoft, etc. */}
          <SocialButton>
            <FaGoogle size={20} color="#DB4437" />
          </SocialButton>
          {/* 👇 LINE 76: FACEBOOK ICON */}
          <SocialButton>
            <FaFacebookF size={20} color="#4267B2" />
          </SocialButton>
          {/* 👇 LINE 80: TWITTER ICON */}
          <SocialButton>
            <FaTwitter size={20} color="#1DA1F2" />
          </SocialButton>
        </SocialButtons>

        {/* 👇 LINE 87: SIGN UP LINK — change text or link */}
        <SignupLink>
          New Here ? <a href="/signup">Sign Up Here</a>
        </SignupLink>
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
  background-color: #f9f9f9; /* 👈 LINE 100: CHANGE BACKGROUND COLOR */
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* 👈 LINE 107: CHANGE SHADOW */
  padding: 32px;
  width: 100%;
  max-width: 400px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* 👈 LINE 115: CHANGE SPACING BETWEEN ICON AND TEXT */
  margin-bottom: 24px;
`;

const LogoIcon = styled.div`
  /* No SVG styling needed since we're using <img> */
`;

const LogoText = styled.div`
  strong {
    font-size: 18px;
    font-weight: 600;
    color: #333; /* 👈 LINE 130: CHANGE LOGO TITLE COLOR */
  }
  small {
    font-size: 12px;
    color: #666; /* 👈 LINE 134: CHANGE SUBTITLE COLOR */
    display: block;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333; /* 👈 LINE 142: CHANGE HEADING COLOR */
  margin: 0 0 8px 0;
  text-align: left; /* 👈 LINE 145: CHANGE ALIGNMENT — try "center" or "right" */
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666; /* 👈 LINE 152: CHANGE SUBTITLE TEXT COLOR */
  line-height: 1.5;
  margin: 0 0 24px 0;
  text-align: left; /* 👈 LINE 156: CHANGE ALIGNMENT */
`;

const Form = styled.form`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333; /* 👈 LINE 166: CHANGE LABEL COLOR */
  margin-bottom: 8px;
  text-align: left; /* 👈 LINE 169: CHANGE ALIGNMENT */
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const EmailInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: 50px;
  border: 1px solid #ddd; /* 👈 LINE 181: CHANGE BORDER COLOR */
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  font-family: 'Poppins', sans-serif;

  &:focus {
    border-color: #007bff; /* 👈 LINE 188: CHANGE FOCUS BORDER COLOR */
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
`;

const SubmitButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #000; /* 👈 LINE 199: CHANGE BUTTON BACKGROUND */
  color: white;
  border: none;
  border-radius: 50%; /* 👈 LINE 203: CHANGE SHAPE — try "4px" for square */
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #333; /* 👈 LINE 212: CHANGE HOVER COLOR */
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Divider = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999; /* 👈 LINE 223: CHANGE DIVIDER TEXT COLOR */
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
    background: #ddd; /* 👈 LINE 233: CHANGE LINE COLOR */
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
  gap: 16px; /* 👈 LINE 245: CHANGE SPACING BETWEEN ICONS */
  margin-bottom: 24px;
`;

const SocialButton = styled.button`
  background: #f8f8f8; /* 👈 LINE 250: CHANGE BUTTON BACKGROUND */
  border: 1px solid #ddd; /* 👈 LINE 251: CHANGE BORDER */
  border-radius: 50%; /* 👈 LINE 252: CHANGE SHAPE — try "8px" for rounded squares */
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #eee; /* 👈 LINE 260: CHANGE HOVER COLOR */
  }
`;

const SignupLink = styled.div`
  text-align: center;
  font-size: 14px;
  color: #666; /* 👈 LINE 268: CHANGE TEXT COLOR */

  a {
    color: #007bff; /* 👈 LINE 271: CHANGE LINK COLOR */
    text-decoration: underline;
    font-weight: 500;
    margin-left: 4px;

    &:hover {
      color: #0056b3; /* 👈 LINE 277: CHANGE HOVER LINK COLOR */
    }
  }
`;

export default LoginPage;