// src/components/HomePage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// ✅ IMAGES — Place these in public/ folder
const avatar1 = "/11.png";
const avatar2 = "/12.png";
const avatar3 = "/13.png";
const avatarKabir = "/11.png";
const avatarRahul = "/15.png";
const avatarJohn = "/13.png";
const avatarProgress1 = "/11.png";
const avatarProgress2 = "/15.png";

// Mock data for recommended projects
const mockRecommendedProjects = [
  {
    id: '4',
    name: 'Kabir Sharma',
    role: 'Architect',
    avatar: avatarKabir,
    projectImage: '/image.png',
    category: 'Renovation & Remodelling',
    status: 'Ready to work',
    chatIcon: true
  },
  {
    id: '1',
    name: 'Rahul Mehta',
    role: 'Interior Designer',
    avatar: avatarRahul,
    projectImage: '/image-1.png',
    category: 'Interior Design Services',
    status: 'Ready to work',
    chatIcon: true
  },
  {
    id: '2',
    name: 'John Doe',
    role: 'Construction Manager',
    avatar: avatarJohn,
    projectImage: '/image-2.png',
    category: 'Construction Services',
    status: 'Ready to work',
    chatIcon: true
  },
  {
    id: '3',
    name: 'Nikita Desai',
    role: 'Civil Engineer',
    avatar: avatar3,
    projectImage: '/image.png',
    category: 'Structural Engineering',
    status: 'Available',
    chatIcon: false
  },
  {
    id: '5',
    name: 'Priya Nair',
    role: 'Plumbing Engineer',
    avatar: avatar2,
    projectImage: '/image-1.png',
    category: 'Plumbing & Water Systems',
    status: 'Ready to work',
    chatIcon: true
  },
  {
    id: '6',
    name: 'Vikram Singh',
    role: 'Electrical Engineer',
    avatar: avatar1,
    projectImage: '/image-2.png',
    category: 'Electrical Installations',
    status: 'Available',
    chatIcon: false
  }
];

// Mock data for user projects (fallback)
const getFallbackProjects = () => [
  {
    id: '1',
    title: "Renovation & Remodelling",
    cost: "$1,25,000",
    progress: 80,
    tasks: [
      { name: "Demolition", status: "completed", date: "Oct 5" },
      { name: "Electrical Wiring", status: "completed", date: "Oct 10" },
      { name: "Plumbing", status: "completed", date: "Oct 15" },
      { name: "Wall Painting", status: "completed", date: "Oct 20" },
      { name: "Flooring", status: "in-progress", date: "Oct 25" },
    ]
  },
  {
    id: '2',
    title: "Bathroom Renovation",
    cost: "$1,000",
    progress: 45,
    tasks: [
      { name: "Tile Removal", status: "completed", date: "Oct 8" },
      { name: "Waterproofing", status: "completed", date: "Oct 12" },
      { name: "New Tiling", status: "in-progress", date: "Oct 20" },
      { name: "Sanitary Fittings", status: "pending", date: "Oct 28" },
    ]
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userProjects, setUserProjects] = useState(getFallbackProjects());
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // --- NEWS STATE ---
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);

  // --- CHATBOT STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch user auth state and profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch user projects or set fallback
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setUserProjects(getFallbackProjects());
        setLoadingProjects(false);
        return;
      }

      setLoadingProjects(true);
      try {
        const projectsQuery = query(
          collection(db, 'projects'),
          where('userId', '==', user.uid)
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsList = [];
        projectsSnapshot.forEach((doc) => {
          projectsList.push({ id: doc.id, ...doc.data() });
        });
        setUserProjects(projectsList);
      } catch (error) {
        console.error('Error fetching projects from Firestore:', error);
        setUserProjects(getFallbackProjects());
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [user]);

  // 3. Fetch News
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      setNewsError(null);
      try {
        const API_KEY = "7d53f07fa2ff4613b665ebeb67096b8b"; // 👈 REPLACE THIS
        const queryParam = "construction OR interior design OR civil engineering OR architecture";
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(queryParam)}&sortBy=publishedAt&pageSize=1&apiKey=${API_KEY}`
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const validArticles = data.articles.filter(article => article.urlToImage);
        setNews(validArticles.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setNews([
          {
            title: "Welcome to BuildConnect News!",
            description: "Stay tuned for the latest updates in construction and design.",
            url: "#",
            urlToImage: "/image.png",
            publishedAt: new Date().toISOString(),
            source: { name: "BuildConnect" }
          }
        ]);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  // --- CHATBOT HANDLER ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { text: data.answer || "No response.", isUser: false }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "⚠️ Couldn't reach assistant. Is the Java backend running?", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const displayName = userProfile?.firstName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || 'user@example.com';
  const displayAvatar = user?.photoURL || avatar1;

  const toggleProjectDetails = (projectId) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const handleBrowseMore = () => {
    alert("Browse More clicked! This will open project discovery page.");
  };

  return (
    <Container>
      {/* NAVBAR */}
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
          <SearchBar placeholder="Search projects, professionals, services..." />
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

      {/* MAIN CONTENT */}
      <MainContent>
        {/* COMMUNITY CARD */}
        <CommunityCard>
          <CommunityHeader>
            <CommunityContent>
              <CommunityTitle>The<br /><span>Community</span></CommunityTitle>
              <ExploreButton onClick={() => navigate('/Community')}>
                Explore Now
              </ExploreButton>
            </CommunityContent>
            <CommunityAvatars>
              <Avatar><AvatarImg src={avatar1} alt="1" /></Avatar>
              <Avatar><AvatarImg src={avatar2} alt="2" /></Avatar>
              <Avatar><AvatarImg src={avatar3} alt="3" /></Avatar>
            </CommunityAvatars>
          </CommunityHeader>
        </CommunityCard>

        {/* NEWS SECTION */}
        <NewsSection>
          <SectionTitle>Industry News</SectionTitle>
          {loadingNews ? (
            <NewsLoadingCard><p>Loading latest news...</p></NewsLoadingCard>
          ) : newsError ? (
            <NewsErrorCard><p>{newsError}</p></NewsErrorCard>
          ) : (
            <NewsGrid>
              {news.map((article, index) => (
                <NewsCard key={index} onClick={() => window.open(article.url, '_blank')}>
                  {article.urlToImage && <NewsImage src={article.urlToImage} alt={article.title} />}
                  <NewsContent>
                    <NewsSource>{article.source.name}</NewsSource>
                    <NewsTitle>{article.title}</NewsTitle>
                    <NewsDesc>{article.description}</NewsDesc>
                    <NewsTime>
                      {new Date(article.publishedAt).toLocaleDateString()} • 
                      {" "}{new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </NewsTime>
                  </NewsContent>
                </NewsCard>
              ))}
            </NewsGrid>
          )}
        </NewsSection>
      </MainContent>

      {/* RECOMMENDED PROJECTS */}
      <SectionHeader>
        <SectionTitle>Recommend Projects</SectionTitle>
        <FilterButton onClick={() => setShowFilters(!showFilters)}>Filters</FilterButton>
        {showFilters && (
          <FilterDropdown>
            <FilterItem>All Categories</FilterItem>
            <FilterItem>Interior Design</FilterItem>
            <FilterItem>Construction</FilterItem>
            <FilterItem>Electrical</FilterItem>
            <FilterItem>Plumbing</FilterItem>
          </FilterDropdown>
        )}
      </SectionHeader>
      <ProjectsGrid>
        {mockRecommendedProjects.map((project) => (
          <Link to={`/profile/${project.id}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <ProjectCard>
              <ProjectHeader>
                <UserSection>
                  <UserAvatar src={project.avatar} alt={project.name} />
                  <UserInfo>
                    <UserName>{project.name}</UserName>
                    <Status>🟢 {project.status}</Status>
                  </UserInfo>
                </UserSection>
                {project.chatIcon && (
                  <ChatIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#000" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10H4a2 2 0 0 1-2-2v-8C2 6.477 6.477 2 12 2m0 2a8 8 0 0 0-8 8v8h8a8 8 0 1 0 0-16m0 10a1 1 0 0 1 .117 1.993L12 16H9a1 1 0 0 1-.117-1.993L9 14zm3-4a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2z"/></g></svg>
                  </ChatIcon>
                )}
              </ProjectHeader>
              <ProjectImage src={project.projectImage} alt={project.category} />
              <CategoryLabel>{project.category}</CategoryLabel>
            </ProjectCard>
          </Link>
        ))}
      </ProjectsGrid>

      {/* YOUR PROJECTS */}
      <SectionTitle>Your Projects</SectionTitle>
      <ProgressGrid>
        {loadingProjects ? (
          <NoProjectsCard><p>Loading your projects...</p></NoProjectsCard>
        ) : userProjects.length > 0 ? (
          userProjects.map((project) => (
            <React.Fragment key={project.id}>
              <ProgressCard onClick={() => toggleProjectDetails(project.id)}>
                <ProgressImage 
                  src={project.id === '1' ? avatarProgress1 : avatarProgress2} 
                  alt="Project" 
                />
                <ProgressInfo>
                  <ProgressTitle>{project.title}</ProgressTitle>
                  <ProgressCost>Cost : {project.cost}</ProgressCost>
                  <ProgressBar>
                    <ProgressFill style={{ width: `${project.progress}%` }} />
                    <ProgressText>Progress {project.progress}%</ProgressText>
                  </ProgressBar>
                </ProgressInfo>
              </ProgressCard>

              {expandedProjectId === project.id && (
                <TaskListCard>
                  <TaskSectionTitle>Work Progress</TaskSectionTitle>
                  {project.tasks.map((task, idx) => (
                    <TaskItem key={idx}>
                      <TaskStatus status={task.status}>
                        {task.status === 'completed' ? '✓' : task.status === 'in-progress' ? '⋯' : '○'}
                      </TaskStatus>
                      <TaskName>{task.name}</TaskName>
                      <TaskDate>{task.date}</TaskDate>
                    </TaskItem>
                  ))}
                </TaskListCard>
              )}
            </React.Fragment>
          ))
        ) : (
          <NoProjectsCard>
            <PlusIcon>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4v16m8-8H4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </PlusIcon>
            <p>No projects found. Start a new one!</p>
          </NoProjectsCard>
        )}

        <BrowseMoreCard onClick={handleBrowseMore}>
          <PlusIcon>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4v16m8-8H4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </PlusIcon>
          <BrowseText>Browse More</BrowseText>
        </BrowseMoreCard>
      </ProgressGrid>

      {/* 💬 CHATBOT BUTTON */}
      <ChatbotButton onClick={() => setIsChatOpen(true)}>
        💬
      </ChatbotButton>

      {/* 💬 CHATBOT MODAL */}
      {isChatOpen && (
        <ChatbotModal>
          <ChatbotHeader>
            <h3>BuildBot Assistant</h3>
            <button onClick={() => setIsChatOpen(false)}>×</button>
          </ChatbotHeader>
          <ChatbotMessages>
            {messages.map((msg, i) => (
              <Message key={i} isUser={msg.isUser}>
                {msg.text}
              </Message>
            ))}
            {isLoading && <Message isUser={false}>Thinking...</Message>}
          </ChatbotMessages>
          <ChatbotInput>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about construction, materials, codes..."
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()}>
              Send
            </button>
          </ChatbotInput>
        </ChatbotModal>
      )}
    </Container>
  );
};

// --- STYLED COMPONENTS ---

// --- (Keep all your existing styled components) ---

// --- NEW NEWS STYLED COMPONENTS ---

const NewsSection = styled.div`
  flex: 1; /* Take remaining space */
  min-width: 300px; /* Minimum width for responsiveness */
  margin-left: 20px; /* Space between community card and news */
`;

const NewsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NewsCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0;
`;

const NewsContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const NewsSource = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #007bff;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const NewsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
  flex-grow: 1; /* Pushes description down */
`;

const NewsDesc = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px 0;
`;

const NewsTime = styled.div`
  font-size: 11px;
  color: #999;
  font-weight: 500;
  margin-top: auto; /* Pushes to bottom */
`;

const NewsLoadingCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 30px;
  text-align: center;
  border: 1px solid #eee;

  p {
    margin: 0;
    color: #777;
    font-size: 16px;
  }
`;

const NewsErrorCard = styled.div`
  background: #ffecec;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  text-align: center;
  border: 1px solid #fcc;
  color: #c33;

  p {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
`;

// --- (Keep all other styled components below) ---

const Container = styled.div`
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  padding: 18px 0 0 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 16px;
  padding: 12px 32px 12px 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  margin: 0 0 20px 0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 28px rgba(0,0,0,0.12);
    transform: translateY(-1px);
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoIcon = styled.div`
  svg {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #333 0%, #000 100%);
    border-radius: 10px;
    padding: 6px;
    fill: none;
    stroke: white;
    stroke-width: 2;
  }
`;

const LogoText = styled.div`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;

  strong {
    color: #222;
    letter-spacing: -0.2px;
  }

  small {
    font-size: 12px;
    color: #7a7a7a;
    display: block;
  }
`;

const SearchBar = styled.input`
  max-width: 280px;
  height: 36px;
  font-size: 14px;
  padding: 0 20px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  color: #444;
  background: #f9f9f9;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    background: white;
  }

  &:hover {
    border-color: #b0b0b0;
  }
`;

const FilterButton = styled.button`
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid #e0e0e0;
  padding: 9px 24px;
  color: #555;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  &:hover {
    background: #ebebeb;
    border-color: #d0d0d0;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  }
`;

const IconCircle = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #fff;
  border: 2.3px solid #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);

  &:hover {
    border-color: #d0d0d0;
    background: #f9f9f9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const RedDot = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #e74c3c;
  border-radius: 50%;
  border: 1.5px solid white;
  box-shadow: 0 0 0 2px #fff;
`;

const UserDropdown = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 24px;
  border: 2.3px solid #f1f1f1;
  padding: 5px 14px 5px 9px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);

  &:hover {
    border-color: #d0d0d0;
    background: #f9f9f9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
`;

const UserName = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #222;
  display: block;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #666;
  display: block;
  margin-top: 1px;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Arrow = styled.span`
  font-size: 14px;
  color: #888;
  margin-left: 4px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  padding: 10px 0;
  min-width: 180px;
  z-index: 1000;
  margin-top: 8px;
  transform: translateY(4px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;

  ${UserDropdown}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const DropdownItem = styled.div`
  padding: 12px 18px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f5f5f5;
    color: #222;
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 26px;
  padding-left: 14px;
  margin-top: 6px;
`;

const CommunityCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  min-width: 620px;
  max-width: 840px;
  height: 200px;
  padding: 28px 36px;
  display: flex;
  align-items: center;
  position: relative;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  }
`;

const CommunityTitle = styled.div`
  font-size: 40px;
  font-weight: 800;
  line-height: 42px;
  color: #1e1e1e;
  text-align: left;
  letter-spacing: -0.5px;

  span { 
    font-size: 32px; 
    letter-spacing: 0px; 
    font-weight: 600;
    color: #555;
  }
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
  gap: 10px;
`;

const CommunityAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: -14px;
`;

const ExploreButton = styled.button`
  background: linear-gradient(135deg, #000 0%, #333 100%);
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 18px;
  font-weight: 600;
  padding: 11px 36px;
  margin-bottom: 11px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.11);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #232323 0%, #444 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }
`;

const Avatars = styled.div`
  display: flex;
  margin-top: 6px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0 16px 12px;
  position: relative; /* For dropdown positioning */
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 36px 0 18px 14px;
  letter-spacing: -0.2px;
`;

const FilterDropdown = styled.div`
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

const FilterItem = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 26px;
  padding: 0 14px 26px 14px;
`;

const ProjectCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Status = styled.span`
  font-size: 13px;
  color: #27ae60;
  font-weight: 500;
`;

const ChatIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    background: #e0e0e0;
    transform: scale(1.05);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ProjectCard}:hover & {
    transform: scale(1.02);
  }
`;

const CategoryLabel = styled.div`
  background: #f0f0f0;
  padding: 8px 14px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  color: #333;
  border-top: 1px solid #eee;
  transition: background 0.3s ease;

  ${ProjectCard}:hover & {
    background: #e8e8e8;
  }
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 26px;
  padding: 0 14px 36px 14px;
`;

const ProgressCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  padding: 18px;
  gap: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  }
`;

const ProgressImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;

  ${ProgressCard}:hover & {
    border-color: #007bff;
    transform: scale(1.05);
  }
`;

const ProgressInfo = styled.div`
  flex: 1;
`;

const ProgressTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
`;

const ProgressCost = styled.div`
  font-size: 15px;
  color: #555;
  margin-bottom: 9px;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  background: #f0f0f0;
  border-radius: 20px;
  height: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
`;

const ProgressFill = styled.div`
  background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
  height: 100%;
  transition: width 0.6s ease;
  box-shadow: 0 2px 4px rgba(39, 174, 96, 0.3);
`;

const ProgressText = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
`;

const BrowseMoreCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  }
`;

const PlusIcon = styled.div`
  width: 68px;
  height: 68px;
  border: 2px solid #000;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #222;
    transform: scale(1.05);
  }
`;

const BrowseText = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;

  &:hover {
    color: #000;
  }
`;

const NoProjectsCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 18px;
  grid-column: 1 / -1;
  text-align: center;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  }

  p {
    margin-top: 14px;
    color: #777;
    font-size: 17px;
    font-weight: 500;
  }
`;

const TaskListCard = styled.div`
  background: #f9f9f9;
  border-radius: 16px;
  padding: 20px;
  margin: 0 14px 26px 14px;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);
  grid-column: 1 / -1;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: inset 0 2px 12px rgba(0,0,0,0.08);
  }
`;

const TaskSectionTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;

  &:hover {
    background: #f5f5f5;
    border-radius: 8px;
    padding-left: 8px;
    padding-right: 8px;
  }
`;

const TaskStatus = styled.div`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
  color: ${props =>
    props.status === 'completed' ? '#27ae60' :
    props.status === 'in-progress' ? '#f2994a' : '#ccc'};
  margin-right: 14px;
  border-radius: 50%;
  background: ${props =>
    props.status === 'completed' ? '#e8f5e9' :
    props.status === 'in-progress' ? '#fff8e1' : '#f5f5f5'};
  border: 1px solid ${props =>
    props.status === 'completed' ? '#c8e6c9' :
    props.status === 'in-progress' ? '#ffecb3' : '#e0e0e0'};
`;

const TaskName = styled.div`
  flex: 1;
  font-size: 15px;
  color: #333;
  font-weight: 500;
`;

const TaskDate = styled.div`
  font-size: 13px;
  color: #777;
  white-space: nowrap;
  font-weight: 500;
`;

const ChatbotButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #000;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 1000;
  &:hover {
    background: #333;
  }
`;

const ChatbotModal = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const ChatbotHeader = styled.div`
  padding: 16px;
  background: #000;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 { margin: 0; font-size: 16px; }
  button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
`;

const ChatbotMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  ${props => props.isUser ? `
    background: #e0f7fa;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  ` : `
    background: #f1f1f1;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  `}
`;

const ChatbotInput = styled.div`
  display: flex;
  padding: 12px;
  border-top: 1px solid #eee;
  gap: 8px;
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
  }
  button {
    padding: 10px 16px;
    background: #000;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    &:disabled {
      opacity: 0.5;
    }
  }
`;

export default HomePage;