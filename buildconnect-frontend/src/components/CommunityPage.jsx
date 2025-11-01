// src/components/Community.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

// Images
const avatar1 = "/11.png";
const avatar2 = "/12.png";
const avatar3 = "/13.png";

const CommunityPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const authUnsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch community posts
    const postsUnsub = onSnapshot(
      query(collection(db, 'communityPosts'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const postsList = [];
        snapshot.forEach(doc => postsList.push({ id: doc.id, ...doc.data() }));
        setPosts(postsList);
      }
    );

    return () => {
      authUnsub();
      postsUnsub();
    };
  }, []);

  // Mock data if no posts in database
  const communityPosts = posts.length > 0 ? posts : [
    {
      id: 1,
      user: {
        name: "Kabir Sharma",
        avatar: avatar1,
        role: "Architect"
      },
      content: "Just completed an amazing sustainable housing project in Mumbai! Using recycled materials and solar panels to reduce carbon footprint. 🏡🌱",
      image: "/image.png",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 24,
      comments: 8,
      category: "architecture"
    },
    {
      id: 2,
      user: {
        name: "Rahul Mehta",
        avatar: avatar2,
        role: "Interior Designer"
      },
      content: "Transformed this 2BHK apartment with minimalist design and smart storage solutions. The clients are thrilled with the results!",
      image: "/image.png",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      likes: 42,
      comments: 12,
      category: "interior"
    },
    {
      id: 3,
      user: {
        name: "John Doe",
        avatar: avatar3,
        role: "Construction Manager"
      },
      content: "Working on a challenging terrain for a new commercial complex. Innovative foundation techniques are key here. 💪",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      likes: 18,
      comments: 5,
      category: "construction"
    }
  ];

  const filteredPosts = activeFilter === 'all' 
    ? communityPosts 
    : communityPosts.filter(post => post.category === activeFilter);

  // ✅ FIXED: Handles both Firestore Timestamp and JS Date
  const formatTime = (timestamp) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/dashboard')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </BackButton>
        
        <HeaderContent>
          <HeaderTitle>The Community</HeaderTitle>
          <HeaderSubtitle>Connect, share, and learn with construction professionals</HeaderSubtitle>
        </HeaderContent>
      </Header>

      <Filters>
        <FilterButton 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')}
        >
          All Posts
        </FilterButton>
        <FilterButton 
          active={activeFilter === 'architecture'} 
          onClick={() => setActiveFilter('architecture')}
        >
          Architecture
        </FilterButton>
        <FilterButton 
          active={activeFilter === 'interior'} 
          onClick={() => setActiveFilter('interior')}
        >
          Interior Design
        </FilterButton>
        <FilterButton 
          active={activeFilter === 'construction'} 
          onClick={() => setActiveFilter('construction')}
        >
          Construction
        </FilterButton>
      </Filters>

      <Content>
        <PostsGrid>
          {filteredPosts.map((post) => (
            <PostCard key={post.id}>
              <PostHeader>
                <UserInfo>
                  <UserAvatar src={post.user.avatar} alt={post.user.name} />
                  <div>
                    <UserName>{post.user.name}</UserName>
                    <UserRole>{post.user.role}</UserRole>
                  </div>
                </UserInfo>
                <PostTime>{formatTime(post.timestamp)}</PostTime>
              </PostHeader>

              <PostContent>
                <PostText>{post.content}</PostText>
                {post.image && (
                  <PostImage src={post.image} alt="Post content" />
                )}
              </PostContent>

              <PostActions>
                <ActionButton>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {post.likes}
                </ActionButton>
                <ActionButton>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {post.comments}
                </ActionButton>
                <ActionButton>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Share
                </ActionButton>
              </PostActions>
            </PostCard>
          ))}
        </PostsGrid>

        <Sidebar>
          <SidebarCard>
            <SidebarTitle>Community Stats</SidebarTitle>
            <StatItem>
              <StatNumber>1,234</StatNumber>
              <StatLabel>Active Members</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>567</StatNumber>
              <StatLabel>Projects Shared</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>89</StatNumber>
              <StatLabel>Experts Online</StatLabel>
            </StatItem>
          </SidebarCard>

          <SidebarCard>
            <SidebarTitle>Top Contributors</SidebarTitle>
            <Contributor>
              <UserAvatar src={avatar1} alt="Kabir Sharma" />
              <ContributorInfo>
                <ContributorName>Kabir Sharma</ContributorName>
                <ContributorRole>Architect</ContributorRole>
              </ContributorInfo>
              <ContributorPoints>1.2k points</ContributorPoints>
            </Contributor>
            <Contributor>
              <UserAvatar src={avatar2} alt="Rahul Mehta" />
              <ContributorInfo>
                <ContributorName>Rahul Mehta</ContributorName>
                <ContributorRole>Interior Designer</ContributorRole>
              </ContributorInfo>
              <ContributorPoints>980 points</ContributorPoints>
            </Contributor>
            <Contributor>
              <UserAvatar src={avatar3} alt="John Doe" />
              <ContributorInfo>
                <ContributorName>John Doe</ContributorName>
                <ContributorRole>Construction Manager</ContributorRole>
              </ContributorInfo>
              <ContributorPoints>850 points</ContributorPoints>
            </Contributor>
          </SidebarCard>
        </Sidebar>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 30px;
  margin-bottom: 30px;
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
  
  &:hover {
    border-color: #d0d0d0;
    background: #f9f9f9;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1e1e1e;
  margin: 0 0 8px 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? '#000' : '#fff'};
  color: ${props => props.active ? '#fff' : '#555'};
  border: 2px solid ${props => props.active ? '#000' : '#f1f1f1'};
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#000' : '#f9f9f9'};
    border-color: ${props => props.active ? '#000' : '#d0d0d0'};
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PostCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 24px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const UserRole = styled.div`
  font-size: 14px;
  color: #666;
`;

const PostTime = styled.div`
  font-size: 14px;
  color: #999;
`;

const PostContent = styled.div`
  margin-bottom: 20px;
`;

const PostText = styled.p`
  font-size: 15px;
  line-height: 1.5;
  color: #444;
  margin: 0 0 16px 0;
`;

const PostImage = styled.img`
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
`;

const PostActions = styled.div`
  display: flex;
  gap: 20px;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 1200px) {
    display: none;
  }
`;

const SidebarCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 24px;
`;

const SidebarTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatNumber = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #000;
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const Contributor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ContributorInfo = styled.div`
  flex: 1;
`;

const ContributorName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const ContributorRole = styled.div`
  font-size: 12px;
  color: #666;
`;

const ContributorPoints = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #000;
`;

export default CommunityPage;