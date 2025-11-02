// src/components/EnhancedHomePage.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// ✅ IMAGES — Place these in public/ folder
const avatar1 = "/vikram-singh.jpg";
const avatar2 = "/priya-nair.jpg";
const avatar3 = "/nikita-desai.jpg";
const avatarKabir = "/11.png";
const avatarRahul = "/rahul-mehta.png";
const avatarJohn = "/aarav-khanna.jpg";
const avatarProgress1 = "/11.png";
const avatarProgress2 = "/15.png";

// 🎨 Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Enhanced mock data with more information
const mockRecommendedProjects = [
  {
    id: '4',
    name: 'Kabir Sharma',
    role: 'Architect',
    avatar: avatarKabir,
    projectImage: '/image.png',
    category: 'Renovation & Remodelling',
    status: 'Ready to work',
    chatIcon: true,
    rating: 4.8,
    completedProjects: 127,
    responseTime: '< 2 hours',
    location: 'Mumbai, MH',
    priceRange: '₹150K - ₹500K'
  },
  {
    id: '1',
    name: 'Rahul Mehta',
    role: 'Interior Designer',
    avatar: avatarRahul,
    projectImage: '/image-1.png',
    category: 'Interior Design Services',
    status: 'Ready to work',
    chatIcon: true,
    rating: 4.9,
    completedProjects: 203,
    responseTime: '< 1 hour',
    location: 'Delhi, DL',
    priceRange: '₹80K - ₹300K'
  },
  {
    id: '2',
    name: 'Aarav Khanna',
    role: 'Construction Manager',
    avatar: avatarJohn,
    projectImage: '/image-2.png',
    category: 'Construction Services',
    status: 'Ready to work',
    chatIcon: true,
    rating: 4.7,
    completedProjects: 89,
    responseTime: '< 3 hours',
    location: 'Bangalore, KA',
    priceRange: '₹200K - ₹800K'
  },
  {
    id: '3',
    name: 'Nikita Desai',
    role: 'Civil Engineer',
    avatar: avatar3,
    projectImage: '/image.png',
    category: 'Structural Engineering',
    status: 'Available',
    chatIcon: false,
    rating: 4.6,
    completedProjects: 156,
    responseTime: '< 4 hours',
    location: 'Pune, MH',
    priceRange: '₹100K - ₹400K'
  },
  {
    id: '5',
    name: 'Priya Nair',
    role: 'Plumbing Engineer',
    avatar: avatar2,
    projectImage: '/image-1.png',
    category: 'Plumbing & Water Systems',
    status: 'Ready to work',
    chatIcon: true,
    rating: 4.8,
    completedProjects: 178,
    responseTime: '< 2 hours',
    location: 'Chennai, TN',
    priceRange: '₹50K - ₹200K'
  },
  {
    id: '6',
    name: 'Vikram Singh',
    role: 'Electrical Engineer',
    avatar: avatar1,
    projectImage: '/image-1.png',
    category: 'Electrical Installations',
    status: 'Available',
    chatIcon: false,
    rating: 4.5,
    completedProjects: 94,
    responseTime: '< 5 hours',
    location: 'Hyderabad, TS',
    priceRange: '₹60K - ₹250K'
  }
];

// Enhanced fallback projects with more details
const getFallbackProjects = () => [
  {
    id: '1',
    title: "Modern Kitchen Renovation",
    cost: "₹1,25,000",
    progress: 80,
    status: 'in-progress',
    priority: 'high',
    estimatedCompletion: 'Dec 15, 2024',
    team: [
      { name: 'Rahul Mehta', role: 'Designer', avatar: avatarRahul },
      { name: 'Priya Nair', role: 'Plumber', avatar: avatar2 }
    ],
    tasks: [
      { name: "Design Finalization", status: "completed", date: "Oct 5", priority: 'high' },
      { name: "Demolition", status: "completed", date: "Oct 10", priority: 'medium' },
      { name: "Electrical Wiring", status: "completed", date: "Oct 15", priority: 'high' },
      { name: "Plumbing", status: "completed", date: "Oct 20", priority: 'high' },
      { name: "Cabinet Installation", status: "in-progress", date: "Oct 25", priority: 'high' },
      { name: "Tile Work", status: "pending", date: "Nov 1", priority: 'medium' },
      { name: "Painting", status: "pending", date: "Nov 8", priority: 'low' },
    ]
  },
  {
    id: '2',
    title: "Bathroom Renovation",
    cost: "₹85,000",
    progress: 45,
    status: 'in-progress',
    priority: 'medium',
    estimatedCompletion: 'Nov 30, 2024',
    team: [
      { name: 'Priya Nair', role: 'Plumber', avatar: avatar2 },
      { name: 'Vikram Singh', role: 'Electrician', avatar: avatar1 }
    ],
    tasks: [
      { name: "Planning & Permits", status: "completed", date: "Oct 8", priority: 'high' },
      { name: "Tile Removal", status: "completed", date: "Oct 12", priority: 'medium' },
      { name: "Waterproofing", status: "completed", date: "Oct 15", priority: 'high' },
      { name: "New Tiling", status: "in-progress", date: "Oct 20", priority: 'high' },
      { name: "Sanitary Fittings", status: "pending", date: "Oct 28", priority: 'medium' },
      { name: "Final Inspection", status: "pending", date: "Nov 5", priority: 'high' },
    ]
  },
  {
    id: '3',
    title: "Living Room Extension",
    cost: "₹2,40,000",
    progress: 25,
    status: 'planning',
    priority: 'low',
    estimatedCompletion: 'Jan 15, 2025',
    team: [
      { name: 'Kabir Sharma', role: 'Architect', avatar: avatarKabir },
      { name: 'Aarav Khanna', role: 'Construction Manager', avatar: avatarJohn }
    ],
    tasks: [
      { name: "Architectural Plans", status: "completed", date: "Sep 20", priority: 'high' },
      { name: "Permits Approval", status: "in-progress", date: "Oct 15", priority: 'high' },
      { name: "Foundation Work", status: "pending", date: "Nov 1", priority: 'high' },
      { name: "Framing", status: "pending", date: "Nov 15", priority: 'high' },
      { name: "Roofing", status: "pending", date: "Dec 1", priority: 'medium' },
      { name: "Interior Finishing", status: "pending", date: "Dec 20", priority: 'low' },
    ]
  }
];

// Mock recent activity data
const mockRecentActivity = [
  {
    id: 1,
    type: 'task_completed',
    message: 'Cabinet Installation started in Modern Kitchen Renovation',
    time: '2 hours ago',
    icon: '🔨',
    color: '#4CAF50'
  },
  {
    id: 2,
    type: 'message',
    message: 'New message from Rahul Mehta about design changes',
    time: '4 hours ago',
    icon: '💬',
    color: '#2196F3'
  },
  {
    id: 3,
    type: 'milestone',
    message: 'Bathroom Renovation reached 50% completion milestone',
    time: '1 day ago',
    icon: '🎯',
    color: '#FF9800'
  },
  {
    id: 4,
    type: 'payment',
    message: 'Payment processed for Plumbing services',
    time: '2 days ago',
    icon: '💳',
    color: '#9C27B0'
  },
  {
    id: 5,
    type: 'project_added',
    message: 'New project "Living Room Extension" added to your portfolio',
    time: '3 days ago',
    icon: '📋',
    color: '#607D8B'
  }
];

// Quick actions data
const quickActions = [
  {
    id: 1,
    title: 'Create Project',
    description: 'Start a new construction project',
    icon: '➕',
    color: '#4CAF50',
    action: 'create_project'
  },
  {
    id: 2,
    title: 'Find Professionals',
    description: 'Browse and connect with experts',
    icon: '👥',
    color: '#2196F3',
    action: 'find_professionals'
  },
  {
    id: 3,
    title: 'Project Timeline',
    description: 'View project schedules and deadlines',
    icon: '📅',
    color: '#FF9800',
    action: 'view_timeline'
  },
  {
    id: 4,
    title: 'Cost Estimator',
    description: 'Calculate project costs and budgets',
    icon: '💰',
    color: '#9C27B0',
    action: 'cost_estimator'
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userProjects, setUserProjects] = useState(getFallbackProjects());
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // State for enhanced features
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Project milestone reached', time: '10 min ago', read: false },
    { id: 2, message: 'New message from contractor', time: '1 hour ago', read: false },
    { id: 3, message: 'Payment reminder due', time: '2 hours ago', read: true },
  ]);

  // --- NEWS STATE ---
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);

  // --- CHATBOT STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('start');
  const [awaitingFreeText, setAwaitingFreeText] = useState(false);

  // Calculate project statistics
  const projectStats = {
    total: userProjects.length,
    completed: userProjects.filter(p => p.progress === 100).length,
    inProgress: userProjects.filter(p => p.status === 'in-progress').length,
    planning: userProjects.filter(p => p.status === 'planning').length,
    totalBudget: userProjects.reduce((sum, p) => {
      const cost = parseInt(p.cost.replace(/[₹,]/g, '')) || 0;
      return sum + cost;
    }, 0)
  };

  // Filter projects based on search and category
  const filteredProjects = userProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'completed' && project.progress === 100) ||
      (selectedCategory === 'active' && project.status === 'in-progress') ||
      (selectedCategory === 'planning' && project.status === 'planning');
    return matchesSearch && matchesCategory;
  });

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
        const API_KEY = "7d53f07fa2ff4613b665ebeb67096b8b";
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

  // --- CHATBOT HANDLER (free text fallback) ---
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
      // Return to menu after free query
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Back to main menu?", isUser: false }]);
        setCurrentStep('start');
        setAwaitingFreeText(false);
      }, 800);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleProjectDetails = (projectId) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const displayName = userProfile?.firstName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || 'user@example.com';
  const displayAvatar = user?.photoURL || avatar1;

  const handleQuickAction = (action) => {
    setIsQuickActionOpen(false);
    switch (action) {
      case 'create_project':
        alert('Opening project creation modal...');
        break;
      case 'find_professionals':
        navigate('/community');
        break;
      case 'view_timeline':
        navigate('/projects/timeline');
        break;
      case 'cost_estimator':
        alert('Opening cost estimator tool...');
        break;
      default:
        break;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Container>
      {/* ENHANCED HEADER */}
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
          <SearchContainer>
            <SearchBar 
              placeholder="Search projects, professionals, services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon>🔍</SearchIcon>
          </SearchContainer>
          <QuickActionButton onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}>
            ⚡ Quick Actions
          </QuickActionButton>
        </LeftSection>
        <RightSection>
          <NotificationContainer>
            <IconCircle onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
                  <path fill="currentColor" d="M19 3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7.333L4 21.5c-.824.618-2 .03-2-1V6a3 3 0 0 1 3-3zm0 2H5a1 1 0 0 0-1 1v13l2.133-1.6a2 2 0 0 1 1.2-.4H19a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1m-8 7a1 1 0 0 1 .117 1.993L11 14H8a1 1 0 0 1-.117-1.993L8 12zm5-4a1 1 0 1 1 0 2H8a1 1 0 0 1 0-2z"/>
                </g>
              </svg>
              {notifications.filter(n => !n.read).length > 0 && (
                <NotificationBadge>{notifications.filter(n => !n.read).length}</NotificationBadge>
              )}
            </IconCircle>
            
            {isNotificationOpen && (
              <NotificationDropdown>
                <NotificationHeader>
                  <h4>Notifications</h4>
                  <MarkAllRead>Mark all as read</MarkAllRead>
                </NotificationHeader>
                <NotificationList>
                  {notifications.map(notification => (
                    <NotificationItem key={notification.id} unread={!notification.read}>
                      <NotificationIcon>🔔</NotificationIcon>
                      <NotificationContent>
                        <NotificationMessage>{notification.message}</NotificationMessage>
                        <NotificationTime>{notification.time}</NotificationTime>
                      </NotificationContent>
                    </NotificationItem>
                  ))}
                </NotificationList>
                <NotificationFooter>
                  <Link to="/notifications" style={{ textDecoration: 'none', color: '#007bff' }}>
                    View all notifications
                  </Link>
                </NotificationFooter>
              </NotificationDropdown>
            )}
          </NotificationContainer>
          
          <IconCircle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                <path fill="currentColor" d="M12 3a7 7 0 0 1 7 7v3.764l1.822 3.644A1.1 1.1 0 0 1 19.838 19H4.162a1.1 1.1 0 0 1-.984-1.592L5 13.764V10a7 7 0 0 1 7-7m0 2a5 5 0 0 0-5 5v3.764a2 2 0 0 1-.211.894L5.619 17h12.763l-1.17-2.342a2 2 0 0 1-.212-.894V10a5 5 0 0 0-5-5m4.88-2.63a1 1 0 0 1 1.406-.147a10 10 0 0 1 2.61 3.206a1 1 0 0 1-1.778.915a8 8 0 0 0-2.09-2.567a1 1 0 0 1-.148-1.406Zm-9.76 0a1 1 0 0 1-.148 1.407a8 8 0 0 0-2.084 2.555a1 1 0 1 1-1.776-.918a10 10 0 0 1 2.602-3.191a1 1 0 0 1 1.406.148ZM9 20h6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"/>
              </g>
            </svg>
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
                <DropdownItem onClick={() => navigate('/profile')}>👤 Profile</DropdownItem>
                <DropdownItem onClick={() => navigate('/settings')}>⚙️ Settings</DropdownItem>
                <DropdownItem>📋 Saved Items</DropdownItem>
                <DropdownItem>💳 Billing</DropdownItem>
                <DropdownItem>📞 Support</DropdownItem>
                <DropdownItem onClick={handleSignOut}>🚪 Sign Out</DropdownItem>
              </DropdownMenu>
            )}
          </UserDropdown>
        </RightSection>
      </Header>

      {/* QUICK ACTIONS DROPDOWN */}
      {isQuickActionOpen && (
        <QuickActionsDropdown>
          <QuickActionsGrid>
            {quickActions.map(action => (
              <QuickActionCard key={action.id} onClick={() => handleQuickAction(action.action)}>
                <ActionIcon style={{ backgroundColor: action.color }}>{action.icon}</ActionIcon>
                <ActionTitle>{action.title}</ActionTitle>
                <ActionDesc>{action.description}</ActionDesc>
              </QuickActionCard>
            ))}
          </QuickActionsGrid>
        </QuickActionsDropdown>
      )}

      {/* DASHBOARD STATS */}
      <DashboardSection>
        <StatsCard>
          <StatsIcon>🏗️</StatsIcon>
          <StatsContent>
            <StatsNumber>{projectStats.total}</StatsNumber>
            <StatsLabel>Total Projects</StatsLabel>
          </StatsContent>
        </StatsCard>
        <StatsCard>
          <StatsIcon>✅</StatsIcon>
          <StatsContent>
            <StatsNumber>{projectStats.completed}</StatsNumber>
            <StatsLabel>Completed</StatsLabel>
          </StatsContent>
        </StatsCard>
        <StatsCard>
          <StatsIcon>⚡</StatsIcon>
          <StatsContent>
            <StatsNumber>{projectStats.inProgress}</StatsNumber>
            <StatsLabel>In Progress</StatsLabel>
          </StatsContent>
        </StatsCard>
        <StatsCard>
          <StatsIcon>💰</StatsIcon>
          <StatsContent>
            <StatsNumber>{formatCurrency(projectStats.totalBudget)}</StatsNumber>
            <StatsLabel>Total Budget</StatsLabel>
          </StatsContent>
        </StatsCard>
      </DashboardSection>

      {/* MAIN CONTENT */}
      <MainContent>
        {/* ENHANCED COMMUNITY CARD */}
        <CommunityCard>
          <CommunityHeader>
            <CommunityContent>
              <CommunityTitle>The<br /><span>Community</span></CommunityTitle>
              <CommunitySubtitle>Connect with professionals and get inspired</CommunitySubtitle>
              <ExploreButton onClick={() => navigate('/Community')}>
                Explore Now
              </ExploreButton>
            </CommunityContent>
            <CommunityAvatars>
              <Avatar><AvatarImg src={avatar1} alt="1" /></Avatar>
              <Avatar><AvatarImg src={avatar2} alt="2" /></Avatar>
              <Avatar><AvatarImg src={avatar3} alt="3" /></Avatar>
              <AvatarCount>+127</AvatarCount>
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

      {/* RECENT ACTIVITY */}
      <ActivitySection>
        <SectionTitle>Recent Activity</SectionTitle>
        <ActivityTimeline>
          {recentActivity.map(activity => (
            <ActivityItem key={activity.id}>
              <ActivityIcon style={{ backgroundColor: activity.color }}>
                {activity.icon}
              </ActivityIcon>
              <ActivityContent>
                <ActivityMessage>{activity.message}</ActivityMessage>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </ActivityTimeline>
      </ActivitySection>

      {/* RECOMMENDED PROJECTS */}
      <SectionHeader>
        <SectionTitle>Recommended Professionals</SectionTitle>
        <FilterContainer>
          <ViewToggle>
            <ViewButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </ViewButton>
            <ViewButton 
              active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              ≡ List
            </ViewButton>
          </ViewToggle>
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
        </FilterContainer>
      </SectionHeader>
      <ProjectsGrid viewMode={viewMode}>
        {mockRecommendedProjects.map((project) => (
          <Link to={`/profile/${project.id}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <ProjectCard viewMode={viewMode}>
              <ProjectHeader>
                <UserSection>
                  <UserAvatar src={project.avatar} alt={project.name} />
                  <UserInfo>
                    <UserName>{project.name}</UserName>
                    <UserRole>{project.role}</UserRole>
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
              <ProjectDetails>
                <CategoryLabel>{project.category}</CategoryLabel>
                <ProjectMeta>
                  <MetaItem>⭐ {project.rating}</MetaItem>
                  <MetaItem>📍 {project.location}</MetaItem>
                  <MetaItem>💰 {project.priceRange}</MetaItem>
                  <MetaItem>⏱️ {project.responseTime}</MetaItem>
                  <MetaItem>✅ {project.completedProjects} projects</MetaItem>
                </ProjectMeta>
              </ProjectDetails>
            </ProjectCard>
          </Link>
        ))}
      </ProjectsGrid>

      {/* TIPS & RESOURCES */}
      <SectionTitle>Tips & Resources</SectionTitle>
      <TipsGrid>
        <TipCard>
          <TipIcon>📘</TipIcon>
          <TipTitle>Permit Guide</TipTitle>
          <TipDesc>How to get construction permits in your city—step by step.</TipDesc>
          <TipTag>Legal</TipTag>
        </TipCard>
        <TipCard>
          <TipIcon>💰</TipIcon>
          <TipTitle>Budgeting Template</TipTitle>
          <TipDesc>Track costs with our free downloadable Excel sheet.</TipDesc>
          <TipTag>Finance</TipTag>
        </TipCard>
        <TipCard>
          <TipIcon>🛠️</TipIcon>
          <TipTitle>Tool Checklist</TipTitle>
          <TipDesc>Essential tools for every renovation project.</TipDesc>
          <TipTag>Planning</TipTag>
        </TipCard>
        <TipCard>
          <TipIcon>📋</TipIcon>
          <TipTitle>Project Templates</TipTitle>
          <TipDesc>Ready-to-use templates for common project types.</TipDesc>
          <TipTag>Templates</TipTag>
        </TipCard>
      </TipsGrid>

      {/* YOUR PROJECTS WITH ENHANCED FEATURES */}
      <SectionHeader>
        <SectionTitle>Your Projects</SectionTitle>
        <ProjectControls>
          <AddProjectButton onClick={() => alert('Opening project creation modal...')}>
            ➕ New Project
          </AddProjectButton>
          <FilterButton onClick={() => setShowFilters(!showFilters)}>Filters</FilterButton>
          {showFilters && (
            <FilterDropdown>
              <FilterItem onClick={() => setSelectedCategory('all')}>All Projects</FilterItem>
              <FilterItem onClick={() => setSelectedCategory('active')}>Active</FilterItem>
              <FilterItem onClick={() => setSelectedCategory('planning')}>Planning</FilterItem>
              <FilterItem onClick={() => setSelectedCategory('completed')}>Completed</FilterItem>
            </FilterDropdown>
          )}
        </ProjectControls>
      </SectionHeader>
      <ProgressGrid>
        {loadingProjects ? (
          <NoProjectsCard><p>Loading your projects...</p></NoProjectsCard>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <React.Fragment key={project.id}>
              <ProgressCard onClick={() => toggleProjectDetails(project.id)}>
                <ProgressImage 
                  src={project.id === '1' ? avatarProgress1 : project.id === '2' ? avatarProgress2 : avatarKabir} 
                  alt="Project" 
                />
                <ProgressInfo>
                  <ProjectHeaderRow>
                    <ProgressTitle>{project.title}</ProgressTitle>
                    <ProjectPriority priority={project.priority}>
                      {project.priority === 'high' ? '🔴' : project.priority === 'medium' ? '🟡' : '🟢'}
                    </ProjectPriority>
                  </ProjectHeaderRow>
                  <ProgressCost>Cost: {project.cost}</ProgressCost>
                  <ProgressMeta>
                    <ProgressStatus status={project.status}>
                      {project.status === 'in-progress' ? 'In Progress' : 
                       project.status === 'planning' ? 'Planning' : 'Completed'}
                    </ProgressStatus>
                    <EstCompletion>Est. {project.estimatedCompletion}</EstCompletion>
                  </ProgressMeta>
                  <ProgressBar>
                    <ProgressFill style={{ width: `${project.progress}%` }} />
                    <ProgressText>Progress {project.progress}%</ProgressText>
                  </ProgressBar>
                  {project.team && project.team.length > 0 && (
                    <TeamAvatars>
                      {project.team.slice(0, 3).map((member, index) => (
                        <TeamAvatar key={index} src={member.avatar} alt={member.name} />
                      ))}
                      {project.team.length > 3 && (
                        <TeamCount>+{project.team.length - 3}</TeamCount>
                      )}
                    </TeamAvatars>
                  )}
                </ProgressInfo>
              </ProgressCard>

              {expandedProjectId === project.id && (
                <TaskListCard>
                  <TaskSectionTitle>📋 Work Progress & Timeline</TaskSectionTitle>
                  <TasksList>
                    {project.tasks.map((task, idx) => (
                      <TaskItem key={idx}>
                        <TaskStatus status={task.status}>
                          {task.status === 'completed' ? '✓' : task.status === 'in-progress' ? '⋯' : '○'}
                        </TaskStatus>
                        <TaskName>{task.name}</TaskName>
                        <TaskDate>{task.date}</TaskDate>
                        <TaskPriority priority={task.priority}>
                          {task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '⚡' : '📌'}
                        </TaskPriority>
                      </TaskItem>
                    ))}
                  </TasksList>
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

        <BrowseMoreCard onClick={() => alert('Opening project discovery...')}>
          <PlusIcon>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4v16m8-8H4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </PlusIcon>
          <BrowseText>Browse More Projects</BrowseText>
        </BrowseMoreCard>
      </ProgressGrid>

      {/* 💬 CHATBOT BUTTON */}
      <ChatbotButton onClick={() => setIsChatOpen(!isChatOpen)}>
        💬
      </ChatbotButton>

      {/* 💬 ENHANCED CHATBOT MODAL */}
      {isChatOpen && (
        <ChatbotModal>
          <ChatbotHeader>
            <div>
              <h3>🤖 BuildBot Assistant</h3>
              <BotStatus>Online • Ready to help</BotStatus>
            </div>
            <div>
              <MinimizeButton onClick={() => setIsChatOpen(false)}>−</MinimizeButton>
              <CloseButton onClick={() => setIsChatOpen(false)}>×</CloseButton>
            </div>
          </ChatbotHeader>
          <ChatbotMessages>
            {messages.map((msg, i) => (
              <Message key={i} isUser={msg.isUser}>
                {msg.text}
              </Message>
            ))}
            {isLoading && <Message isUser={false}>🤔 Thinking...</Message>}
          </ChatbotMessages>

          {!awaitingFreeText && currentStep && (
            <QuickReplies>
              <QuickButton onClick={() => setCurrentStep('start')}>🏠 Main Menu</QuickButton>
              <QuickButton onClick={() => setCurrentStep('permit')}>📋 Permits</QuickButton>
              <QuickButton onClick={() => setCurrentStep('cost')}>💰 Cost Estimate</QuickButton>
              <QuickButton onClick={() => setCurrentStep('find_pro')}>👥 Find Pros</QuickButton>
            </QuickReplies>
          )}

          <ChatbotInput>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
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

// Enhanced styled components
const Container = styled.div`
  background: linear-gradient(135deg, #fdf9fb 0%, #f8f4f6 100%);
  min-height: 100vh;
  font-family: 'Inter', 'Poppins', sans-serif;
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

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchBar = styled.input`
  max-width: 280px;
  height: 36px;
  font-size: 14px;
  padding: 0 45px 0 20px;
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

const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  font-size: 16px;
  pointer-events: none;
`;

const QuickActionButton = styled.button`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
  }
`;

const NotificationContainer = styled.div`
  position: relative;
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

const NotificationBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  border: 2px solid white;
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  width: 350px;
  z-index: 1000;
  margin-top: 8px;
  border: 1px solid #f0f0f0;
`;

const NotificationHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
`;

const MarkAllRead = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
  
  &:hover {
    background: #f0f8ff;
  }
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  background: ${props => props.unread ? '#f8f9ff' : 'white'};
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.unread ? '#f0f5ff' : '#f9f9f9'};
  }
`;

const NotificationIcon = styled.div`
  font-size: 16px;
  margin-right: 12px;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationMessage = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
`;

const NotificationTime = styled.div`
  font-size: 12px;
  color: #666;
`;

const NotificationFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
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
  border: 1px solid #f0f0f0;
  animation: ${fadeInUp} 0.2s ease;
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

const QuickActionsDropdown = styled.div`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  padding: 24px;
  z-index: 999;
  border: 1px solid #f0f0f0;
  animation: ${fadeInUp} 0.3s ease;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  min-width: 400px;
`;

const QuickActionCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    border-color: #007bff;
  }
`;

const ActionIcon = styled.div`
  font-size: 24px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: white;
`;

const ActionTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
`;

const ActionDesc = styled.div`
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`;

const DashboardSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 0 14px 20px 14px;
  margin-bottom: 20px;
`;

const StatsCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
`;

const StatsIcon = styled.div`
  font-size: 32px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsContent = styled.div`
  flex: 1;
`;

const StatsNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1;
`;

const StatsLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const MainContent = styled.div`
  display: flex;
  gap: 26px;
  padding-left: 14px;
  margin-bottom: 20px;
`;

const CommunityCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  min-width: 620px;
  max-width: 840px;
  height: 220px;
  padding: 28px 36px;
  display: flex;
  align-items: center;
  position: relative;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.8s ease;
  
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

const CommunitySubtitle = styled.div`
  font-size: 16px;
  color: #666;
  margin-top: 8px;
  margin-bottom: 16px;
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

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.10);
  margin-left: -24px;
  &:first-child {
    margin-left: 0;
  }
`;

const AvatarCount = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin-left: -24px;
  border: 3px solid #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.10);
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NewsSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0 0 18px 14px;
  letter-spacing: -0.2px;
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
  flex-grow: 1;
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
  margin-top: auto;
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

const ActivitySection = styled.div`
  margin: 30px 0;
  padding: 0 14px;
`;

const ActivityTimeline = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityMessage = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: #666;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0 16px 12px;
  position: relative;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  border: 1px solid #e0e0e0;
`;

const ViewButton = styled.button`
  background: ${props => props.active ? '#fff' : 'transparent'};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  color: ${props => props.active ? '#333' : '#666'};
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};
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
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1000;
  margin-top: 8px;
  border: 1px solid #e0e0e0;
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
  grid-template-columns: repeat(auto-fit, minmax(${props => props.viewMode === 'list' ? '400px' : '320px'}, 1fr));
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
  display: ${props => props.viewMode === 'list' ? 'flex' : 'block'};
  flex-direction: ${props => props.viewMode === 'list' ? 'row' : 'column'};
  height: ${props => props.viewMode === 'list' ? '200px' : 'auto'};
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

const UserRole = styled.div`
  font-size: 12px;
  color: #666;
  font-weight: 500;
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
  width: ${props => props.viewMode === 'list' ? '200px' : '100%'};
  height: ${props => props.viewMode === 'list' ? '100%' : '220px'};
  object-fit: cover;
  transition: transform 0.3s ease;
  ${ProjectCard}:hover & {
    transform: scale(1.02);
  }
`;

const ProjectDetails = styled.div`
  padding: 18px;
  flex: 1;
`;

const CategoryLabel = styled.div`
  background: #f0f0f0;
  padding: 8px 14px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  color: #333;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: background 0.3s ease;
  ${ProjectCard}:hover & {
    background: #e8e8e8;
  }
`;

const ProjectMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const MetaItem = styled.div`
  font-size: 11px;
  color: #666;
  background: #f8f8f8;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
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

const ProjectHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5px;
`;

const ProgressTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #333;
`;

const ProjectPriority = styled.div`
  font-size: 16px;
`;

const ProgressCost = styled.div`
  font-size: 15px;
  color: #555;
  margin-bottom: 9px;
  font-weight: 500;
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ProgressStatus = styled.span`
  font-size: 13px;
  color: ${props => 
    props.status === 'in-progress' ? '#f2994a' :
    props.status === 'planning' ? '#9b59b6' : '#27ae60'};
  font-weight: 600;
`;

const EstCompletion = styled.span`
  font-size: 12px;
  color: #666;
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

const TeamAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: -8px;
  margin-top: 12px;
`;

const TeamAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
`;

const TeamCount = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
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

const TasksList = styled.div`
  display: grid;
  gap: 8px;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: white;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  &:hover {
    background: #f8f9fa;
    border-color: #e0e0e0;
    transform: translateX(2px);
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
  margin-right: 8px;
`;

const TaskPriority = styled.div`
  font-size: 14px;
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

const ProjectControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const AddProjectButton = styled.button`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
  }
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 12px;
  padding: 0 14px 30px 14px;
`;

const TipCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(183, 20, 80, 0.06);
  border: 1px solid #f8f0f4;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #B71450, #FF6B9D);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(183, 20, 80, 0.12);
    border-color: #ffd1dc;
    &:before {
      opacity: 1;
    }
  }
`;

const TipIcon = styled.div`
  font-size: 28px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #fff0f5, #ffe6ee);
  border-radius: 14px;
  color: #B71450;
  box-shadow: inset 0 0 0 1px #ffd1dc;
`;

const TipTitle = styled.div`
  font-weight: 700;
  font-size: 17px;
  color: #222;
  margin-bottom: 10px;
  line-height: 1.3;
`;

const TipDesc = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  font-weight: 400;
`;

const TipTag = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #B71450;
  background: #fff0f5;
  padding: 4px 10px;
  border-radius: 20px;
  margin-top: 12px;
  letter-spacing: 0.5px;
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
  animation: ${pulse} 2s infinite;
  &:hover {
    background: #333;
    animation: none;
  }
`;

const ChatbotModal = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 400px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border: 1px solid #e0e0e0;
`;

const ChatbotHeader = styled.div`
  padding: 16px;
  background: #000;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px 16px 0 0;
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
`;

const BotStatus = styled.div`
  font-size: 11px;
  color: #4CAF50;
  font-weight: 500;
`;

const MinimizeButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
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

const QuickReplies = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #eee;
  background: #fafafa;
`;

const QuickButton = styled.button`
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #e0e0e0;
    border-color: #B71450;
    color: #B71450;
  }
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
    font-size: 14px;
    
    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
    }
  }
  
  button {
    padding: 10px 16px;
    background: #000;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s;
    
    &:hover:not(:disabled) {
      background: #333;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export default HomePage;