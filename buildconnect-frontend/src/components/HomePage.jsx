import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Placeholder avatars
const avatar1 = "https://via.placeholder.com/80/3498db/ffffff?text=U1";
const avatar2 = "https://via.placeholder.com/80/e74c3c/ffffff?text=U2";
const avatar3 = "https://via.placeholder.com/80/2ecc71/ffffff?text=U3";

const HomePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    alert("You are in Guest Mode. Some features may be limited.");
  }, []);

  return (
    <Container>
      <Header>
        {/* LEFT SIDE: Logo + Search + Filters + Dashboard */}
        <LeftSection>
          <LogoSection>
            <LogoIcon>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="20" height="20" stroke="#000" strokeWidth="2" rx="2"/>
                <line x1="20" y1="10" x2="20" y2="30" stroke="#000" strokeWidth="2"/>
                <line x1="10" y1="20" x2="30" y2="20" stroke="#000" strokeWidth="2"/>
              </svg>
            </LogoIcon>
            <LogoText>
              <strong>BuildConnect</strong><br />
              <small>by PixelFusion</small>
            </LogoText>
          </LogoSection>

          <SearchBar placeholder="Type something here....." />

          <FilterButton>Filters</FilterButton>
          
          {/* 👇 Dashboard Link */}
          <NavButton>Dashboard</NavButton>
        </LeftSection>

        {/* RIGHT SIDE: Messages + Notifications + Settings + Help + Profile */}
        <RightSection>
          {/* Message Icon with Red Dot */}
          <IconCircle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
                <path fill="currentColor" d="M19 3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7.333L4 21.5c-.824.618-2 .03-2-1V6a3 3 0 0 1 3-3zm0 2H5a1 1 0 0 0-1 1v13l2.133-1.6a2 2 0 0 1 1.2-.4H19a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1m-8 7a1 1 0 0 1 .117 1.993L11 14H8a1 1 0 0 1-.117-1.993L8 12zm5-4a1 1 0 1 1 0 2H8a1 1 0 0 1 0-2z"/>
              </g>
            </svg>
            <RedDot />
          </IconCircle>

          {/* Bell Icon with Red Dot */}
          <IconCircle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                <path fill="currentColor" d="M12 3a7 7 0 0 1 7 7v3.764l1.822 3.644A1.1 1.1 0 0 1 19.838 19H4.162a1.1 1.1 0 0 1-.984-1.592L5 13.764V10a7 7 0 0 1 7-7m0 2a5 5 0 0 0-5 5v3.764a2 2 0 0 1-.211.894L5.619 17h12.763l-1.17-2.342a2 2 0 0 1-.212-.894V10a5 5 0 0 0-5-5m4.88-2.63a1 1 0 0 1 1.406-.147a10 10 0 0 1 2.61 3.206a1 1 0 0 1-1.778.915a8 8 0 0 0-2.09-2.567a1 1 0 0 1-.148-1.406Zm-9.76 0a1 1 0 0 1-.148 1.407a8 8 0 0 0-2.084 2.555a1 1 0 1 1-1.776-.918a10 10 0 0 1 2.602-3.191a1 1 0 0 1 1.406.148ZM9 20h6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"/>
              </g>
            </svg>
            <RedDot />
          </IconCircle>

          {/* Settings Icon */}
          <IconCircle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"/>
                <path fill="currentColor" d="M19.433 13a.241.241 0 0 0 .114-.028a.227.227 0 0 0 .103-.177V8.5a.5.5 0 0 0-.5-.5H4.85a.5.5 0 0 0-.5.5v4.295c0 .075.03.147.083.2a.25.25 0 0 0 .177.075H7.5v1a3.5 3.5 0 0 0 7 0v-1h2.933ZM5.85 13h12.3v-3.5H5.85V13Zm8.5 0h-4v-1h4v1Zm-4-2h4v-1h-4v1Zm6.5-4.5H4.35a.5.5 0 0 0-.5-.5V6.5a.5.5 0 0 0 .5-.5h15.3a.5.5 0 0 0 .5.5v2a.5.5 0 0 0-.5.5Z"/>
              </g>
            </svg>
          </IconCircle>

          {/* Help Icon */}
          <IconCircle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Zm6-6v-7c0-3.1-2.5-5.6-5.6-5.6H11.6C8.5 6.8 6 9.3 6 12.4v7l-2 2v1h16v-1l-2-2Z"/>
                <path fill="currentColor" d="M11 16h2v2h-2v-2Zm0-8h2v5h-2V8Zm1-3c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2Z"/>
              </g>
            </svg>
          </IconCircle>

          {/* 👇 UPDATED: User Dropdown with Menu */}
          <UserDropdown onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <UserAvatar src={avatar1} alt="User" />
            <UserName>Shanaya Mehta</UserName>
            <Arrow>▼</Arrow>
            
            {/* 👇 Dropdown Menu */}
            {isDropdownOpen && (
              <DropdownMenu>
                <DropdownItem>Account Settings</DropdownItem>
                <DropdownItem>Saved</DropdownItem>
                <DropdownItem>Support</DropdownItem>
              </DropdownMenu>
            )}
          </UserDropdown>
        </RightSection>
      </Header>

      <MainContent>
        {/* ... rest of your content remains the same ... */}
      </MainContent>
    </Container>
  );
};

// --- STYLED COMPONENTS ---

const Container = styled.div`
  background: #fff;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  padding: 18px 0 0 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 10px 30px 10px 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin: 0 0 16px 0;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 19px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  svg {
    width: 34px;
    height: 34px;
    background: #333;
    border-radius: 8px;
    padding: 5px;
    fill: none;
    stroke: white;
    stroke-width: 2;
  }
`;

const LogoText = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;

  strong {
    color: #333;
  }

  small {
    font-size: 12px;
    color: #7a7a7a;
    display: block;
  }
`;

const SearchBar = styled.input`
  max-width: 250px;
  height: 32px;
  font-size: 14px;
  padding: 0 18px;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
  color: #444;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &:hover {
    border-color: #b0b0b0;
  }
`;

const FilterButton = styled.button`
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 400;
  border: 1px solid #e0e0e0;
  padding: 8px 21px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ebebeb;
    border-color: #d0d0d0;
  }
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const IconCircle = styled.div`
  width: 39px;
  height: 39px;
  border-radius: 50%;
  background: #fff;
  border: 2.3px solid #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d0d0d0;
    background: #f9f9f9;
    transform: translateY(-1px);
  }
`;

const RedDot = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  border: 1px solid white;
`;

const UserDropdown = styled.div`
  position: relative; /* 👈 Important for dropdown positioning */
  display: flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  border-radius: 22px;
  border: 2.3px solid #f1f1f1;
  padding: 4px 12px 4px 7px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d0d0d0;
    background: #f9f9f9;
  }
`;

const UserAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #222;
`;

const Arrow = styled.span`
  font-size: 13px;
  color: #888;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1000;
  margin-top: 8px; /* 👈 Space from dropdown button */
`;

const DropdownItem = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 22px;
  padding-left: 12px;
  margin-top: 4px;
`;

const LeftCard = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  min-width: 420px;
  max-width: 445px;
  height: 220px;
  padding: 37px 20px 23px 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
`;

const BigText = styled.div`
  font-size: 36px;
  font-weight: 700;
  line-height: 38px;
  color: #1e1e1e;
  margin-bottom: 15px;
  span { 
    font-size: 28px; 
    letter-spacing: 0px; 
  }
`;

const ExploreButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 500;
  padding: 9px 31px;
  margin-bottom: 9px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.11);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #232323;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const Avatars = styled.div`
  display: flex;
  margin-top: 6px;
`;

const Avatar = styled.div`
  width: 82px;
  height: 82px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.10);
  margin-left: -29px;
  &:first-child {
    margin-left: 0;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RightFeed = styled.div`
  flex: 1;
`;

const FeedCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.09);
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 22px 28px 19px 15px;
  min-width: 390px;
  margin-bottom: 16px;
`;

const FeedIcon = styled.div`
  width: 64px;
  height: 64px;
  background: none;
  border-radius: 11px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeedBody = styled.div`
  flex: 1;
`;

const FeedTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const FeedDesc = styled.div`
  font-size: 13px;
  color: #555;
  margin-bottom: 7px;
  line-height: 1.4;
  max-width: 450px;
`;

const FeedTime = styled.div`
  font-size: 13px;
  color: #bbb;
  font-weight: 500;
`;

const FeedCardBlur = styled.div`
  background: #fff;
  opacity: 0.77;
  border-radius: 13px;
  height: 36px;
  margin-top: -14px;
  filter: blur(3.2px);
`;

export default HomePage;