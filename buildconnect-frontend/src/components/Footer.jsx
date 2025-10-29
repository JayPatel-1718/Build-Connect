import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>
        <MadeByText></MadeByText>
        <BrandName></BrandName>
      </FooterText> 
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  padding: 12px 0;
  text-align: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
`;

const FooterText = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: baseline; /* 👈 Key: align to text baseline */
  gap: 6px;
  margin: 0;
`;

const MadeByText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #666;
`;

const BrandName = styled.span`
  font-family: 'Anek Devanagari', sans-serif;
  font-weight: 600;
  color: #333;
  /* Optional: fine-tune vertical position if needed */
  /* transform: translateY(-0.5px); */
`;

export default Footer;