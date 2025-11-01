// src/components/ProjectComparison.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components'; // ✅ Added missing import

// Keyframe for fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

function ProjectComparison() {
  console.log("✅ ProjectComparison component is rendering"); // 👈 DEBUG

  const navigate = useNavigate();

  // Mock data for the two projects in the screenshot
  const projectLeft = {
    image: "/image.png", // ✅ Make sure this exists in public/
    cost: "$1,25,000",
    timeline: "Time Consuming",
    materialQuality: "Standard materials",
    durability: "Standard materials"
  };

  const projectRight = {
    image: "/image-1.png", // ✅ Make sure this exists in public/
    cost: "$1,35,000",
    timeline: "Quick Progress",
    materialQuality: "Premium Quality",
    durability: "Premium Quality"
  };

  // ✅ Fallback if images not found
  if (!projectLeft.image || !projectRight.image) {
    return (
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </BackButton>
        <ErrorMessage>
          ⚠️ Images not found. Please check paths in `public/` folder:<br/>
          - `/image.png`<br/>
          - `/image-1.png`
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      {/* Back Button */}
      <BackButton onClick={() => navigate(-1)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </BackButton>

      {/* Two Project Images */}
      <ProjectsGrid>
        <ProjectImage src={projectLeft.image} alt="Project 1" />
        <ProjectImage src={projectRight.image} alt="Project 2" />
      </ProjectsGrid>

      {/* Comparison Card */}
      <ComparisonCard>
        <ComparisonColumn>
          <Label>Cost</Label>
          <Value className="green">{projectLeft.cost}</Value>
          <Label>Timeline</Label>
          <Value>{projectLeft.timeline}</Value>
          <Label>Material Quality</Label>
          <Value>{projectLeft.materialQuality}</Value>
          <Label>Durability</Label>
          <Value>{projectLeft.durability}</Value>
        </ComparisonColumn>
        <Divider />
        <ComparisonColumn>
          <Label>Cost</Label>
          <Value>{projectRight.cost}</Value>
          <Label>Timeline</Label>
          <Value className="green">{projectRight.timeline}</Value>
          <Label>Material Quality</Label>
          <Value className="green">{projectRight.materialQuality}</Value>
          <Label>Durability</Label>
          <Value className="green">{projectRight.durability}</Value>
        </ComparisonColumn>
      </ComparisonCard>

      {/* Compare Button */}
      <CompareButton onClick={() => alert("Comparing with others...")}>
        Compare with Others
      </CompareButton>
    </Container>
  );
}

export default ProjectComparison;

// --- STYLED COMPONENTS ---

const Container = styled.div`
  background: #f9f9f9; /* ✅ Changed from yellow to gray */
  min-height: 100vh;
  padding: 20px;
  padding-top: 24px;
  animation: ${fadeIn} 0.6s ease-out;
  font-family: 'Poppins', sans-serif;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 2px solid #f1f1f1;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  outline: none;
  margin-bottom: 24px;

  &:hover {
    border-color: #d0d0d0;
    background: #f9f9f9;
  }
`;

const ErrorMessage = styled.div`
  background: #ffecec;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 20px;
  text-align: center;
  border: 1px solid #fcc;
  color: #c33;
  font-weight: 500;
  line-height: 1.5;

  br {
    margin-bottom: 8px;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 128px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const ComparisonCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const ComparisonColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Divider = styled.div`
  width: 1px;
  background: #e0e0e0;
  height: 100%;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 6px 0;
`;

const Value = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding: 4px 8px;
  border-radius: 6px;

  &.green {
    background: #2ecc71;
    color: white;
  }

  &.gray {
    background: #e0e0e0;
    color: #333;
  }
`;

const CompareButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  font-weight: 600;
  border-radius: 24px;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3);
  transition: background 0.3s;
  animation: ${fadeIn} 0.8s ease-out;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;