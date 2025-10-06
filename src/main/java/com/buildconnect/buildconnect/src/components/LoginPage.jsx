import React from 'react';
import styled from 'styled-components';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';

const LoginPage = () => {
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
            <strong>BuildConnect</strong>
            <br />
            <small>by PixelFusion</small>
          </LogoText>
        </LogoSection>

        <Title>Get started</Title>
        <Subtitle>
          Sign up or log in to start browsing the perfect service that suits your need,
          or start finding work by making your portfolio strong.
        </Subtitle>

        <Form>
          <Label>Email:</Label>
          <InputWrapper>
            <EmailInput type="email" placeholder="someone@example.com" />
            <SubmitButton type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </SubmitButton>
          </InputWrapper>
        </Form>

        <Divider>- Or sign in with -</Divider>

        <SocialButtons>
          <SocialButton>
            <FaGoogle size={20} />
          </SocialButton>
          <SocialButton>
            <FaFacebookF size={20} />
          </SocialButton>
          <SocialButton>
            <FaTwitter size={20} />
          </SocialButton>
        </SocialButtons>

        <SignupLink>
          New Here? <a href="/signup">Sign Up Here</a>
        </SignupLink>
      </Card>
    </Container>
  );
};

// Styled Components
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
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 24px 0;
`;

const Form = styled.form`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
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
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #333;
  }

  svg {
    width: 16px;
    height: 16px;
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