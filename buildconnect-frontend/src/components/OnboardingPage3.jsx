import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // 👈 Import useNavigate

const OnboardingPage3 = () => {
  const navigate = useNavigate(); // 👈 Initialize navigate

  // State to track selected project type
  const [selectedProject, setSelectedProject] = useState('');

  // Toggle selection
  const toggleProject = (project) => {
    setSelectedProject(project);
  };

  // List of project types
  const projects = [
    "Home renovation",
    "New construction",
    "Small repairs",
    "Consultation"
  ];

  return (
    <Container>
      <Card>
        <Title>What’s your project type?</Title>
        <Subtitle>Hello User!</Subtitle>

        <ProjectGrid>
          {projects.map((project, index) => (
            <ProjectButton
              key={index}
              onClick={() => toggleProject(project)}
              isSelected={selectedProject === project}
            >
              {project}
            </ProjectButton>
          ))}
        </ProjectGrid>

        <StartButton onClick={() => navigate('/homepage')}>
          Get Started
        </StartButton>
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
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const ProjectButton = styled.button`
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
`;

const StartButton = styled.button`
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

export default OnboardingPage3;