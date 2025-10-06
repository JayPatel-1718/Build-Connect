import React, { useState } from 'react';
import styled from 'styled-components';

const OnboardingPage2 = () => {
  // State to track selected services
  const [selectedServices, setSelectedServices] = useState([]);

  // Toggle selection
  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // List of services
  const services = [
    "Interior Design Services",
    "Electrical Services",
    "Plumbing Services",
    "Painting & Decorating",
    "Painting & Decorating", // Note: duplicate in your image — we’ll keep it as-is
    "Others"
  ];

  return (
    <Container>
      <Card>
        <Title>What brings you here?</Title>
        <Subtitle>"What are you looking for today?"</Subtitle>

        <ServiceGrid>
          {services.map((service, index) => (
            <ServiceButton
              key={index}
              onClick={() => toggleService(service)}
              isSelected={selectedServices.includes(service)}
            >
              {service}
            </ServiceButton>
          ))}
        </ServiceGrid>

        <NextButton>
          Next Step →
        </NextButton>
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
  max-width: 500px;
  text-align: center;
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
  margin: 0 0 24px 0;
  font-style: italic;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const ServiceButton = styled.button`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  /* Selected state */
  background: ${(props) => (props.isSelected ? '#000' : '#5DADE2')};
  color: white;

  &:hover {
    opacity: 0.9;
  }

  /* For the duplicate "Painting & Decorating" — same styling */
`;

const NextButton = styled.button`
  background: #000;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.95;
  }
`;

export default OnboardingPage2;