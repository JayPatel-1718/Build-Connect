import React from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom'; // 👈 IMPORT useNavigate

const OnboardingPage = () => {
  const navigate = useNavigate(); // 👈 INITIALIZE navigate

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

        <Title>Sign in as :</Title>

        <ButtonGroup>
          {/* 👇 BLUE BUTTON — As a Client → goes to onboarding2 */}
          <RoleButton
            bg="#007bff"
            color="white"
            onClick={() => navigate('/onboarding2')} // ✅ Now 'navigate' is defined
          >
            <Icon icon="mingcute:user-3-line" width="20" height="20" style={{ marginRight: '8px' }} />
            As a Client
          </RoleButton>

          {/* 👇 RED BUTTON — As a Professional (you can link later) */}
          <RoleButton bg="#dc3545" color="white">
            <Icon icon="mingcute:user-add-line" width="20" height="20" style={{ marginRight: '8px' }} />
            As a Professional
          </RoleButton>
        </ButtonGroup>
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
  margin: 0 0 24px 0;
  text-align: left;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RoleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.bg};
  color: ${(props) => props.color};
  border: none;
  border-radius: 24px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.95;
  }

  svg {
    fill: currentColor;
  }
`;

export default OnboardingPage;