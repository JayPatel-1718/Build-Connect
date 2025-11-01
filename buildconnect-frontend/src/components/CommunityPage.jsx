// src/components/CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

// ✅ Keyframe Animations
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

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// ✅ IMAGES — Place these in public/ folder
const avatar1 = "/11.png";
const avatar2 = "/12.png";
const avatar3 = "/13.png";
const avatarKabir = "/11.png";
const avatarRahul = "/15.png";
const avatarJohn = "/13.png";
const avatarNikita = "/13.png";
const avatarPriya = "/12.png";
const avatarVikram = "/11.png";
const avatarMeera = "/15.png";

const CommunityPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(6); // ✅ Load 6 posts initially

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
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching community posts:", error);
        setLoading(false);
      }
    );

    return () => {
      authUnsub();
      postsUnsub();
    };
  }, []);

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

  // ✅ Mock data for 20+ posts
  const mockPosts = [
    {
      id: '1',
      user: {
        name: "Kabir Sharma",
        avatar: avatarKabir,
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
      id: '2',
      user: {
        name: "Rahul Mehta",
        avatar: avatarRahul,
        role: "Interior Designer"
      },
      content: "Transformed this 2BHK apartment with minimalist design and smart storage solutions. The clients are thrilled with the results!",
      image: "/image-1.png",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      likes: 42,
      comments: 12,
      category: "interior"
    },
    {
      id: '3',
      user: {
        name: "John Doe",
        avatar: avatarJohn,
        role: "Construction Manager"
      },
      content: "Working on a challenging terrain for a new commercial complex. Innovative foundation techniques are key here. 💪",
      image:"/terrace.jpg",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      likes: 18,
      comments: 5,
      category: "construction"
    },
    {
      id: '4',
      user: {
        name: "Nikita Desai",
        avatar: avatarNikita,
        role: "Civil Engineer"
      },
      content: "Finalizing structural design for a 35-story residential tower. Wind load analysis is crucial for tall buildings. 🌬️",
      image:"flat.jpeg",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      likes: 31,
      comments: 9,
      category: "civil"
    },
    {
      id: '5',
      user: {
        name: "Priya Nair",
        avatar: avatarPriya,
        role: "Plumbing Engineer"
      },
      content: "Installed a greywater recycling system in this eco-friendly office. Water conservation is the future! 💧",
      image: "/image-2.png",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      likes: 27,
      comments: 6,
      category: "plumbing"
    },
    {
      id: '6',
      user: {
        name: "Vikram Singh",
        avatar: avatarVikram,
        role: "Electrical Engineer"
      },
      content: "Designed energy-efficient lighting for a 500-seat auditorium. LED arrays with dimming controls for maximum flexibility. 💡",
      image:"audi.jpeg",
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      likes: 39,
      comments: 11,
      category: "electrical"
    },
    {
      id: '7',
      user: {
        name: "Meera Patel",
        avatar: avatarMeera,
        role: "Landscape Architect"
      },
      content: "Created a rooftop garden oasis in the heart of the city. Native plants and rainwater harvesting make it sustainable. 🌿",
      image: "/image.png",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      likes: 45,
      comments: 14,
      category: "landscape"
    },
    {
      id: '8',
      user: {
        name: "Kabir Sharma",
        avatar: avatarKabir,
        role: "Architect"
      },
      content: "Presenting the blueprint for a zero-energy home. Solar panels, geothermal heating, and smart insulation. 🌞",
      image: "/image-1.png",
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      likes: 52,
      comments: 16,
      category: "architecture"
    },
    {
      id: '9',
      user: {
        name: "Rahul Mehta",
        avatar: avatarRahul,
        role: "Interior Designer"
      },
      content: "Revamped this office space with biophilic design principles. Plants, natural light, and earth tones boost productivity. 🌳",
      image:"renovation.jpeg",
      timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
      likes: 38,
      comments: 10,
      category: "interior"
    },
    {
      id: '10',
      user: {
        name: "John Doe",
        avatar: avatarJohn,
        role: "Construction Manager"
      },
      content: "Breaking ground on a new smart city district. Prefabricated modules speed up construction. 🏗️",
      image: "/image-2.png",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      likes: 61,
      comments: 20,
      category: "construction"
    },
    {
      id: '11',
      user: {
        name: "Nikita Desai",
        avatar: avatarNikita,
        role: "Civil Engineer"
      },
      content: "Analyzing soil samples for a new bridge foundation. Ensuring stability on soft clay. 🧪",
      image:"soil.jpeg",
      timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 days ago
      likes: 29,
      comments: 7,
      category: "civil"
    },
    {
      id: '12',
      user: {
        name: "Priya Nair",
        avatar: avatarPriya,
        role: "Plumbing Engineer"
      },
      content: "Designing a rainwater harvesting system for a 10-acre campus. Collecting 500,000 liters annually. 🌧️",
      image: "/image.png",
      timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      likes: 33,
      comments: 9,
      category: "plumbing"
    },
    {
      id: '13',
      user: {
        name: "Vikram Singh",
        avatar: avatarVikram,
        role: "Electrical Engineer"
      },
      content: "Installing EV charging stations in a residential complex. Future-proofing for electric vehicles. ⚡",
      image:"ev.jpeg",
      timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), // 13 days ago
      likes: 47,
      comments: 13,
      category: "electrical"
    },
    {
      id: '14',
      user: {
        name: "Meera Patel",
        avatar: avatarMeera,
        role: "Landscape Architect"
      },
      content: "Planning a therapeutic garden for a senior care facility. Calming spaces with sensory plants. 🌸",
      image: "/image-1.png",
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      likes: 41,
      comments: 11,
      category: "landscape"
    },
    {
      id: '15',
      user: {
        name: "Kabir Sharma",
        avatar: avatarKabir,
        role: "Architect"
      },
      content: "Sketching ideas for a mixed-use skyscraper. Retail on the ground, offices mid-level, residences at the top. 🏢",
      image: "/image-2.png",
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      likes: 55,
      comments: 18,
      category: "architecture"
    },
    {
      id: '16',
      user: {
        name: "Rahul Mehta",
        avatar: avatarRahul,
        role: "Interior Designer"
      },
      content: "Curating a gallery wall for a modern loft. Artwork placement is key to visual balance. 🎨",
      image:"gallery.jpeg",
      timestamp: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), // 16 days ago
      likes: 36,
      comments: 8,
      category: "interior"
    },
    {
      id: '17',
      user: {
        name: "John Doe",
        avatar: avatarJohn,
        role: "Construction Manager"
      },
      content: "Managing logistics for material delivery to a remote site. Drones help monitor progress. 🚁",
      image: "/image.png",
      timestamp: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000), // 17 days ago
      likes: 49,
      comments: 15,
      category: "construction"
    },
    {
      id: '18',
      user: {
        name: "Nikita Desai",
        avatar: avatarNikita,
        role: "Civil Engineer"
      },
      content: "Calculating load distribution for a stadium roof. Ensuring safety for 50,000 spectators. 🏟️",
      image:"stadium.jpeg",
      timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
      likes: 53,
      comments: 17,
      category: "civil"
    },
    {
      id: '19',
      user: {
        name: "Priya Nair",
        avatar: avatarPriya,
        role: "Plumbing Engineer"
      },
      content: "Upgrading water pipes in an old apartment block. Replacing galvanized steel with PEX. 🚰",
      image: "/image-1.png",
      timestamp: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000), // 19 days ago
      likes: 30,
      comments: 6,
      category: "plumbing"
    },
    {
      id: '20',
      user: {
        name: "Vikram Singh",
        avatar: avatarVikram,
        role: "Electrical Engineer"
      },
      content: "Implementing smart grid technology in a new neighborhood. Balancing supply and demand. ⚙️",
      image:"grid.jpeg",
      timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      likes: 44,
      comments: 12,
      category: "electrical"
    }
  ];

  // Use real posts or fallback
  const displayPosts = posts.length > 0 ? posts : mockPosts;
  const filteredPosts = activeFilter === 'all' 
    ? displayPosts 
    : displayPosts.filter(post => post.category === activeFilter);

  // ✅ Load more posts
  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 6);
  };

  // Get posts to show based on visibility
  const postsToShow = filteredPosts.slice(0, visiblePosts);

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

        <FilterSection>
          <FilterButton onClick={() => setShowFilters(!showFilters)}>
            Filters
          </FilterButton>
          
          {/* Simple Filter Dropdown */}
          {showFilters && (
            <FilterDropdown>
              <FilterItem onClick={() => { setActiveFilter('all'); setShowFilters(false); }}>
                All Posts
              </FilterItem>
              <FilterItem onClick={() => { setActiveFilter('architecture'); setShowFilters(false); }}>
                Architecture
              </FilterItem>
              <FilterItem onClick={() => { setActiveFilter('interior'); setShowFilters(false); }}>
                Interior Design
              </FilterItem>
              <FilterItem onClick={() => { setActiveFilter('construction'); setShowFilters(false); }}>
                Construction
              </FilterItem>
              <FilterItem onClick={() => { setActiveFilter('civil'); setShowFilters(false); }}>
                Civil Engineering
              </FilterItem>
              <FilterItem onClick={() => { setActiveFilter('plumbing'); setShowFilters(false); }}>
                Plumbing
              </FilterItem>
              <FilterItem onClick={() => { setActiveFilter('electrical'); setShowFilters(false); }}>
                Electrical
              </FilterItem>
              <FilterItem onClick={() => { setActiveFilter('landscape'); setShowFilters(false); }}>
                Landscape Architecture
              </FilterItem>
            </FilterDropdown>
          )}
        </FilterSection>
      </Header>

      <MainContent>
        <PostsGrid>
          {loading ? (
            <LoadingCard>
              <p>Loading community posts...</p>
            </LoadingCard>
          ) : postsToShow.length > 0 ? (
            postsToShow.map((post) => (
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
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21.5c-.824.618-2 .03-2-1V6a3 3 0 0 1 3-3zm0 2H5a1 1 0 0 0-1 1v13l2.133-1.6a2 2 0 0 1 1.2-.4H19a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1m-8 7a1 1 0 0 1 .117 1.993L11 14H8a1 1 0 0 1-.117-1.993L8 12zm5-4a1 1 0 1 1 0 2H8a1 1 0 0 1 0-2z"/>
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
            ))
          ) : (
            <NoPostsCard>
              <p>No posts found. Be the first to share something!</p>
            </NoPostsCard>
          )}
        </PostsGrid>

        {/* Load More Button */}
        {visiblePosts < filteredPosts.length && (
          <LoadMoreButton onClick={loadMorePosts}>
            Load More
          </LoadMoreButton>
        )}
      </MainContent>
    </Container>
  );
};

// --- STYLED COMPONENTS ---

const Container = styled.div`
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  padding: 18px 0 0 0;
  animation: ${fadeIn} 0.6s ease-out;
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
    transform: translateX(-2px);
  }

  &:active {
    transform: translateX(0);
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  text-align: center;
`;

const HeaderTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1e1e1e;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const HeaderSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

const FilterSection = styled.div`
  position: relative;
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

const FilterDropdown = styled.div`
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

  ${FilterButton}:hover &, ${FilterButton}:focus & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const FilterItem = styled.div`
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
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;
`;

const PostCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  animation: ${fadeIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const UserRole = styled.div`
  font-size: 13px;
  color: #666;
`;

const PostTime = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 500;
`;

const PostContent = styled.div`
  padding: 16px;
`;

const PostText = styled.p`
  font-size: 15px;
  color: #444;
  line-height: 1.5;
  margin: 0 0 16px 0;
`;

const PostImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;

  ${PostCard}:hover & {
    transform: scale(1.02);
  }
`;

const PostActions = styled.div`
  display: flex;
  gap: 20px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
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
    transform: translateY(-1px);
  }
`;

const LoadingCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  padding: 40px;
  text-align: center;
  border: 1px solid #f0f0f0;
  grid-column: 1 / -1;
  animation: ${fadeIn} 0.5s ease-out;

  p {
    margin: 0;
    color: #777;
    font-size: 16px;
    font-weight: 500;
  }
`;

const NoPostsCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  padding: 40px;
  text-align: center;
  border: 1px solid #f0f0f0;
  grid-column: 1 / -1;
  animation: ${fadeIn} 0.5s ease-out;

  p {
    margin: 0;
    color: #777;
    font-size: 16px;
    font-weight: 500;
  }
`;

const LoadMoreButton = styled.button`
  background: #000;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 40px;

  &:hover {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }
`;

export default CommunityPage;