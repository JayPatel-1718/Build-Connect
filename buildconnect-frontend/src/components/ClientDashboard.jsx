// src/components/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom'; // ✅ Added

// ✅ IMAGES — Place these in public/ folder
const avatar1 = "/11.png";
const avatar2 = "/12.png";
const avatar3 = "/13.png";
const avatarKabir = "/11.png";
const avatarRahul = "/15.png";
const avatarJohn = "/13.png";
const avatarProgress1 = "/11.png";
const avatarProgress2 = "/15.png";

const ClientDashboard = () => {
  const navigate = useNavigate(); // ✅ Added
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [progressItems, setProgressItems] = useState([]);

  useEffect(() => {
    const authUnsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    let projectsUnsub = () => {};
    let progressUnsub = () => {};

    if (user) {
      projectsUnsub = onSnapshot(
        query(collection(db, 'projects'), where('clientId', '==', user.uid)),
        (snapshot) => {
          const projList = [];
          snapshot.forEach(doc => projList.push({ id: doc.id, ...doc.data() }));
          setProjects(projList);
        }
      );

      progressUnsub = onSnapshot(
        query(collection(db, 'progress'), where('clientId', '==', user.uid)),
        (snapshot) => {
          const progList = [];
          snapshot.forEach(doc => progList.push({ id: doc.id, ...doc.data() }));
          setProgressItems(progList);
        }
      );
    }

    return () => {
      authUnsub();
      projectsUnsub();
      progressUnsub();
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return <LoadingScreen>Please log in...</LoadingScreen>;
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const displayEmail = user.email || 'user@example.com';
  const displayAvatar = user.photoURL || avatar1;

  const projectList = projects.length > 0 ? projects : [
    { id: 1, title: "Renovation & Remodelling", user: "Kabir Sharma", avatar: avatarKabir },
    { id: 2, title: "Interior Design Services", user: "Rahul Mehta", avatar: avatarRahul },
    { id: 3, title: "Construction Services", user: "John Doe", avatar: avatarJohn },
  ];

  const progressList = progressItems.length > 0 ? progressItems : [
    { id: 1, title: "Renovation & Remodelling", cost: "$1,25,000", percent: 80, avatar: avatarProgress1 },
    { id: 2, title: "Bathroom Renovation", cost: "$1,000", percent: 45, avatar: avatarProgress2 },
  ];

  return (
    <Container>
      <Header>
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
        </LeftSection>

        <RightSection>
          <IconCircle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
                <path fill="currentColor" d="M19 3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7.333L4 21.5c-.824.618-2 .03-2-1V6a3 3 0 0 1 3-3zm0 2H5a1 1 0 0 0-1 1v13l2.133-1.6a2 2 0 0 1 1.2-.4H19a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1m-8 7a1 1 0 0 1 .117 1.993L11 14H8a1 1 0 0 1-.117-1.993L8 12zm5-4a1 1 0 1 1 0 2H8a1 1 0 0 1 0-2z"/>
              </g>
            </svg>
            <RedDot />
          </IconCircle>

          <IconCircle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                <path fill="currentColor" d="M12 3a7 7 0 0 1 7 7v3.764l1.822 3.644A1.1 1.1 0 0 1 19.838 19H4.162a1.1 1.1 0 0 1-.984-1.592L5 13.764V10a7 7 0 0 1 7-7m0 2a5 5 0 0 0-5 5v3.764a2 2 0 0 1-.211.894L5.619 17h12.763l-1.17-2.342a2 2 0 0 1-.212-.894V10a5 5 0 0 0-5-5m4.88-2.63a1 1 0 0 1 1.406-.147a10 10 0 0 1 2.61 3.206a1 1 0 0 1-1.778.915a8 8 0 0 0-2.09-2.567a1 1 0 0 1-.148-1.406Zm-9.76 0a1 1 0 0 1-.148 1.407a8 8 0 0 0-2.084 2.555a1 1 0 1 1-1.776-.918a10 10 0 0 1 2.602-3.191a1 1 0 0 1 1.406.148ZM9 20h6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"/>
              </g>
            </svg>
            <RedDot />
          </IconCircle>

          <UserDropdown onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <UserAvatar src={displayAvatar} alt="User" />
            <div>
              <UserName>{displayName}</UserName>
              <UserEmail>{displayEmail}</UserEmail>
            </div>
            <Arrow>▼</Arrow>
            
            {isDropdownOpen && (
              <DropdownMenu>
                <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
                <DropdownItem>Account Settings</DropdownItem>
                <DropdownItem>Saved</DropdownItem>
                <DropdownItem>Support</DropdownItem>
              </DropdownMenu>
            )}
          </UserDropdown>
        </RightSection>
      </Header>

      <MainContent>
        <CommunityCard>
          <CommunityHeader>
            <CommunityContent>
              <CommunityTitle>The<br /><span>Community</span></CommunityTitle>
              {/* ✅ UPDATED: Navigate to Community Page */}
              <ExploreButton onClick={() => navigate('/community')}>
                Explore Now
              </ExploreButton>
            </CommunityContent>
            <CommunityAvatars>
              <Avatar><AvatarImg src={avatar1} alt="Avatar1" /></Avatar>
              <Avatar><AvatarImg src={avatar2} alt="Avatar2" /></Avatar>
              <Avatar><AvatarImg src={avatar3} alt="Avatar3" /></Avatar>
            </CommunityAvatars>
          </CommunityHeader>
        </CommunityCard>

        <FeedCard>
          <FeedIcon>
            <img src="/image.png" alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </FeedIcon>
          <FeedBody>
            <FeedTitle>World of Concrete India 2025</FeedTitle>
            <FeedDesc>
              Scheduled from October 8–10, 2025, at the Bombay Exhibition Centre in Mumbai, this event will showcase advancements in waterproofing technologies and other construction innovations.
            </FeedDesc>
            <FeedTime>58s ago</FeedTime>
          </FeedBody>
        </FeedCard>
      </MainContent>

      <SectionTitle>Recommend Projects</SectionTitle>
      <ProjectsGrid>
        {projectList.map((proj) => (
          <ProjectCard key={proj.id}>
            <ProjectHeader>
              <UserSection>
                <UserAvatar src={proj.avatar} alt={proj.user} />
                <UserInfo>
                  <UserName>{proj.user}</UserName>
                  <Status>🟢 Ready to work</Status>
                </UserInfo>
              </UserSection>
              <ChatIcon>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5h3v-3h4v3h3l-5 5z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ChatIcon>
            </ProjectHeader>
            <ProjectImage src="/image.png" alt="Project" />
            <CategoryLabel>{proj.title}</CategoryLabel>
          </ProjectCard>
        ))}
      </ProjectsGrid>

      <SectionTitle>Your Project Progress</SectionTitle>
      <ProgressGrid>
        {progressList.map((prog) => (
          <ProgressCard key={prog.id}>
            <ProgressImage src={prog.avatar} alt="Project" />
            <ProgressInfo>
              <ProgressTitle>{prog.title}</ProgressTitle>
              <ProgressCost>Cost : {prog.cost}</ProgressCost>
              <ProgressBar>
                <ProgressFill style={{ width: `${prog.percent}%` }} />
                <ProgressText>Progress {prog.percent}%</ProgressText>
              </ProgressBar>
            </ProgressInfo>
          </ProgressCard>
        ))}

        <BrowseMoreCard>
          <PlusIcon>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4v16m8-8H4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </PlusIcon>
          <BrowseText>Browse More</BrowseText>
        </BrowseMoreCard>
      </ProgressGrid>
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
  &:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
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
  strong { color: #333; }
  small { font-size: 12px; color: #7a7a7a; display: block; }
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
  &::placeholder { color: #bbb; }
  &:focus { border-color: #007bff; box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); }
  &:hover { border-color: #b0b0b0; }
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
  &:hover { background: #ebebeb; border-color: #d0d0d0; }
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
  &:hover { border-color: #d0d0d0; background: #f9f9f9; transform: translateY(-1px); }
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  border-radius: 22px;
  border: 2.3px solid #f1f1f1;
  padding: 4px 12px 4px 7px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #d0d0d0; background: #f9f9f9; }
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
  display: block;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #666;
  display: block;
  margin-top: 2px;
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
  margin-top: 8px;
`;

const DropdownItem = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #f5f5f5; }
`;

const MainContent = styled.div`
  display: flex;
  gap: 22px;
  padding-left: 12px;
  margin-top: 4px;
`;

const CommunityCard = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  min-width: 600px;
  max-width: 800px;
  height: 180px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  position: relative;
`;

const CommunityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const CommunityContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const CommunityTitle = styled.div`
  font-size: 36px;
  font-weight: 700;
  line-height: 38px;
  color: #1e1e1e;
  text-align: left;
  span { font-size: 28px; letter-spacing: 0px; }
`;

const CommunityAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: -12px;
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
  &:hover { background: #232323; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.10);
  margin-left: -12px;
  &:first-child { margin-left: 0; }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 32px 0 16px 12px;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 22px;
  padding: 0 12px 22px 12px;
`;

const ProjectCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Status = styled.span`
  font-size: 12px;
  color: #27ae60;
`;

const ChatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #e0e0e0; }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CategoryLabel = styled.div`
  background: #f0f0f0;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #333;
  border-top: 1px solid #eee;
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 22px;
  padding: 0 12px 32px 12px;
`;

const ProgressCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
`;

const ProgressImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProgressInfo = styled.div`
  flex: 1;
`;

const ProgressTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ProgressCost = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  background: #f0f0f0;
  border-radius: 20px;
  height: 12px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background: #27ae60;
  height: 100%;
  transition: width 0.4s ease;
`;

const ProgressText = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: white;
  font-weight: 500;
`;

const BrowseMoreCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
`;

const PlusIcon = styled.div`
  width: 64px;
  height: 64px;
  border: 2px solid #000;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const BrowseText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  color: #555;
  font-size: 18px;
`;

export default ClientDashboard;