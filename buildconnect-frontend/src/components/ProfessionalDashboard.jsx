import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc, limit, orderBy } from 'firebase/firestore';

// ✅ IMAGES
const avatar1 = "/11.png";
const service1 = "/interior.jpg";
const service2 = "/foundation.jpg";
const service3 = "/service-renovation.jpg";
const project1 = "/shopping mall construction.png";
const project2 = "/water management system.png";

// 🚀 CACHE MANAGER
const CacheManager = {
  cache: new Map(),
  timestamps: new Map(),
  TTL: 5 * 60 * 1000, // 5 minutes

  set(key, value) {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  },

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() - timestamp > this.TTL) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  },

  invalidate(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  },

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }
};

const ProfessionalDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesPage, setServicesPage] = useState(1);
  const [projectsPage, setProjectsPage] = useState(1);
  const [hasMoreServices, setHasMoreServices] = useState(true);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();
  
  const ITEMS_PER_PAGE = 6;

  // 🚀 TOAST NOTIFICATION HELPER
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    cost: '',
    image: null,
    imageUrl: ''
  });
  const fileInputRef = useRef(null);

  // 🚀 OPTIMIZED DATA FETCHING WITH CACHE
  const fetchUserData = async (currentUser) => {
    const cacheKey = `user_${currentUser.uid}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) return cached;

    const [userDocResult, servicesResult, projectsResult] = await Promise.allSettled([
      getDoc(doc(db, 'users', currentUser.uid)),
      getDocs(
        query(
          collection(db, 'services'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(ITEMS_PER_PAGE)
        )
      ),
      getDocs(
        query(
          collection(db, 'projects'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(ITEMS_PER_PAGE)
        )
      )
    ]);

    const data = {
      profile: userDocResult.status === 'fulfilled' && userDocResult.value.exists() 
        ? userDocResult.value.data() 
        : null,
      services: servicesResult.status === 'fulfilled' 
        ? servicesResult.value.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        : [],
      projects: projectsResult.status === 'fulfilled'
        ? projectsResult.value.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        : []
    };

    CacheManager.set(cacheKey, data);
    return data;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      
      if (currentUser) {
        setUser(currentUser);
        
        try {
          const data = await fetchUserData(currentUser);
          
          setUserProfile(data.profile);
          setServices(data.services.length > 0 ? data.services : getDefaultServices());
          setProjects(data.projects.length > 0 ? data.projects : getDefaultProjects());
          setHasMoreServices(data.services.length === ITEMS_PER_PAGE);
          setHasMoreProjects(data.projects.length === ITEMS_PER_PAGE);
        } catch (error) {
          console.error('Error fetching data:', error);
          setServices(getDefaultServices());
          setProjects(getDefaultProjects());
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setServices(getDefaultServices());
        setProjects(getDefaultProjects());
        CacheManager.clear();
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🚀 LOAD MORE FUNCTIONALITY
  const loadMoreServices = async () => {
    if (!user || !hasMoreServices) return;

    try {
      const lastService = services[services.length - 1];
      const moreServices = await getDocs(
        query(
          collection(db, 'services'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(ITEMS_PER_PAGE)
        )
      );

      const newServices = moreServices.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(prev => [...prev, ...newServices]);
      setHasMoreServices(newServices.length === ITEMS_PER_PAGE);
      setServicesPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more services:', error);
    }
  };

  const loadMoreProjects = async () => {
    if (!user || !hasMoreProjects) return;

    try {
      const moreProjects = await getDocs(
        query(
          collection(db, 'projects'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(ITEMS_PER_PAGE)
        )
      );

      const newProjects = moreProjects.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(prev => [...prev, ...newProjects]);
      setHasMoreProjects(newProjects.length === ITEMS_PER_PAGE);
      setProjectsPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more projects:', error);
    }
  };

  const getDefaultServices = () => [
    { id: '1', title: "Interior Design Services", image: service1 },
    { id: '2', title: "Foundation Services", image: service2 },
    { id: '3', title: "Renovation and Remodeling", image: service3 },
  ];

  const getDefaultProjects = () => [
    {
      id: '1',
      title: "Renovation & Remodelling",
      cost: "$1,25,000",
      progress: 80,
      tasks: [
        { name: "Demolition", status: "completed", date: "Oct 5" },
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
        { name: "New Tiling", status: "in-progress", date: "Oct 20" },
      ]
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      CacheManager.clear();
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

  const openServiceModal = () => {
    setModalType('service');
    setFormData({ name: '', experience: '', cost: '', image: null, imageUrl: '' });
    setIsModalOpen(true);
  };

  const openProjectModal = () => {
    setModalType('project');
    setFormData({ name: '', experience: '', cost: '', image: null, imageUrl: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', experience: '', cost: '', image: null, imageUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to add services/projects.');
      return;
    }

    if (!formData.name.trim()) {
      alert('Please enter a name/title.');
      return;
    }

    if (modalType === 'service' && !formData.experience) {
      alert('Please enter years of experience.');
      return;
    }

    // 🚀 GENERATE TEMPORARY ID FOR INSTANT UI UPDATE
    const tempId = `temp_${Date.now()}`;
    
    const newEntry = {
      id: tempId,
      userId: user.uid,
      title: formData.name,
      ...(modalType === 'service' && { experience: formData.experience }),
      ...(modalType === 'project' && { 
        cost: formData.cost || '$0', 
        progress: 0,
        tasks: [{ name: "Planning", status: "pending", date: "TBD" }]
      }),
      image: formData.imageUrl || (modalType === 'service' ? service1 : project1),
      createdAt: new Date().toISOString(),
    };

    // 🚀 INSTANT UI UPDATE (Optimistic)
    if (modalType === 'service') {
      setServices(prev => [newEntry, ...prev]);
    } else {
      setProjects(prev => [newEntry, ...prev]);
    }

    // Close modal immediately for instant feel
    closeModal();
    showToast(`${modalType === 'service' ? 'Service' : 'Project'} added successfully!`);

    // 🚀 BACKGROUND SYNC TO FIRESTORE
    try {
      const { id, ...dataToSave } = newEntry; // Remove temp ID
      const docRef = await addDoc(collection(db, modalType === 'service' ? 'services' : 'projects'), dataToSave);
      
      // Replace temp ID with real Firestore ID
      if (modalType === 'service') {
        setServices(prev => prev.map(item => 
          item.id === tempId ? { ...item, id: docRef.id } : item
        ));
      } else {
        setProjects(prev => prev.map(item => 
          item.id === tempId ? { ...item, id: docRef.id } : item
        ));
      }

      // Invalidate cache for next visit
      CacheManager.invalidate(`user_${user.uid}`);
      
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      
      // 🚀 ROLLBACK ON ERROR - Remove the optimistically added item
      if (modalType === 'service') {
        setServices(prev => prev.filter(item => item.id !== tempId));
      } else {
        setProjects(prev => prev.filter(item => item.id !== tempId));
      }
      
      showToast('Failed to save. Please try again.', 'error');
    }
  };

  const handleEditService = (serviceId) => {
    alert(`Editing service ${serviceId}`);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      // 🚀 INSTANT UI UPDATE - Remove immediately
      const deletedService = services.find(s => s.id === serviceId);
      setServices(prev => prev.filter(s => s.id !== serviceId));
      showToast('Service deleted successfully!');
      
      // 🚀 BACKGROUND SYNC TO FIRESTORE
      try {
        await deleteDoc(doc(db, 'services', serviceId));
        CacheManager.invalidate(`user_${user.uid}`);
      } catch (error) {
        console.error('Error deleting service:', error);
        
        // 🚀 ROLLBACK ON ERROR - Restore the deleted item
        if (deletedService) {
          setServices(prev => [deletedService, ...prev]);
        }
        showToast('Failed to delete service. Please try again.', 'error');
      }
    }
  };

  const handleEditProject = (projectId) => {
    alert(`Editing project ${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      // 🚀 INSTANT UI UPDATE - Remove immediately
      const deletedProject = projects.find(p => p.id === projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      showToast('Project deleted successfully!');
      
      // 🚀 BACKGROUND SYNC TO FIRESTORE
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        CacheManager.invalidate(`user_${user.uid}`);
      } catch (error) {
        console.error('Error deleting project:', error);
        
        // 🚀 ROLLBACK ON ERROR - Restore the deleted item
        if (deletedProject) {
          setProjects(prev => [deletedProject, ...prev]);
        }
        showToast('Failed to delete project. Please try again.', 'error');
      }
    }
  };

  // 🚀 MEMOIZED COMPONENTS FOR BETTER PERFORMANCE
  const ServicesList = useMemo(() => (
    <>
      {services.map((service) => (
        <ServiceCard key={service.id}>
          <ServiceImageWrapper>
            <ServiceImage src={service.image} alt={service.title} loading="lazy" />
            <ServiceActions>
              <EditIcon onClick={() => handleEditService(service.id)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4v17h17v-7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 4-6-6 4-4L18.5 2.5z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </EditIcon>
              <DeleteIcon onClick={() => handleDeleteService(service.id)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m6 8v6m2-6v6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </DeleteIcon>
            </ServiceActions>
            {service.id.startsWith('temp_') && <SyncingBadge>Syncing...</SyncingBadge>}
          </ServiceImageWrapper>
          <ServiceTitle>{service.title}</ServiceTitle>
        </ServiceCard>
      ))}
      <AddServiceCard onClick={openServiceModal}>
        <PlusIcon>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16m8-8H4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </PlusIcon>
        <AddServiceText>Add New Service</AddServiceText>
      </AddServiceCard>
    </>
  ), [services]);

  const ProjectsList = useMemo(() => (
    <>
      {projects.map((project) => (
        <React.Fragment key={project.id}>
          <ProgressCard onClick={() => toggleProjectDetails(project.id)}>
            <ProgressImage src={project.id === '1' ? project1 : project2} alt="Project" loading="lazy" />
            <ProgressInfo>
              <ProgressTitle>
                {project.title}
                {project.id.startsWith('temp_') && <SyncingBadgeInline>Syncing...</SyncingBadgeInline>}
              </ProgressTitle>
              <ProgressCost>Cost : {project.cost}</ProgressCost>
              <ProgressBar>
                <ProgressFill style={{ width: `${project.progress}%` }} />
                <ProgressText>Progress {project.progress}%</ProgressText>
              </ProgressBar>
            </ProgressInfo>
          </ProgressCard>

          {expandedProjectId === project.id && project.tasks && (
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
      ))}
      <BrowseMoreCard onClick={openProjectModal}>
        <PlusIcon>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16m8-8H4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </PlusIcon>
        <BrowseText>Browse More</BrowseText>
      </BrowseMoreCard>
    </>
  ), [projects, expandedProjectId]);

  return (
    <Container>
      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>Loading your dashboard...</LoadingText>
        </LoadingOverlay>
      )}

      {/* 🚀 TOAST NOTIFICATION */}
      {toast.show && (
        <Toast type={toast.type}>
          <ToastIcon>
            {toast.type === 'success' ? '✓' : '✕'}
          </ToastIcon>
          <ToastMessage>{toast.message}</ToastMessage>
        </Toast>
      )}
      
      <Header>
        <LeftSection>
          <LogoSection>
            <LogoIcon>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
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
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.017-.43l-.003-.012l-.01-.01z"/>
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
              <ExploreButton onClick={() => navigate('/dashboard')}>
                Explore Now
              </ExploreButton>
            </CommunityContent>
            <CommunityAvatars>
              <Avatar>
                <AvatarImg src="/11.png" alt="Community Member 1" loading="lazy" />
              </Avatar>
              <Avatar>
                <AvatarImg src="/12.png" alt="Community Member 2" loading="lazy" />
              </Avatar>
              <Avatar>
                <AvatarImg src="/13.png" alt="Community Member 3" loading="lazy" />
              </Avatar>
            </CommunityAvatars>
          </CommunityHeader>
        </CommunityCard>

        <FeedCard>
          <FeedIcon>
            <img 
              src="/event-icon.png" 
              alt="Event" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
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

      <SectionTitle>Your Services</SectionTitle>
      <ServicesGrid>
        {ServicesList}
      </ServicesGrid>
      {hasMoreServices && user && (
        <LoadMoreButton onClick={loadMoreServices}>
          Load More Services
        </LoadMoreButton>
      )}

      <SectionTitle>Your Projects</SectionTitle>
      <ProgressGrid>
        {ProjectsList}
      </ProgressGrid>
      {hasMoreProjects && user && (
        <LoadMoreButton onClick={loadMoreProjects}>
          Load More Projects
        </LoadMoreButton>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {modalType === 'service' ? 'Add New Service' : 'Add New Project'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>{modalType === 'service' ? 'Service Name' : 'Project Title'}</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={modalType === 'service' ? 'e.g., Interior Design' : 'e.g., Kitchen Remodel'}
                  required
                />
              </FormGroup>

              {modalType === 'service' && (
                <FormGroup>
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 5"
                    required
                  />
                </FormGroup>
              )}

              {modalType === 'project' && (
                <FormGroup>
                  <Label>Estimated Cost</Label>
                  <Input
                    type="text"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="e.g., $10,000"
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label>Upload Photo</Label>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
                {formData.imageUrl && (
                  <ImagePreview src={formData.imageUrl} alt="Preview" />
                )}
              </FormGroup>

              <Button type="submit">
                {modalType === 'service' ? 'Add Service' : 'Create Project'}
              </Button>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

// STYLED COMPONENTS
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
  &::placeholder { color: #bbb; }
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
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
  &:hover {
    background: #ebebeb;
    border-color: #d0d0d0;
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

const CommunityTitle = styled.div`
  font-size: 36px;
  font-weight: 700;
  line-height: 38px;
  color: #1e1e1e;
  text-align: left;
  span { 
    font-size: 28px; 
    letter-spacing: 0px; 
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
  gap: 8px;
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
  &:hover {
    background: #232323;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
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

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 22px;
  padding: 0 12px 32px 12px;
`;

const ServiceCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: translateY(-2px); }
`;

const ServiceImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
`;

const ServiceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ServiceActions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
`;

const EditIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: rgba(255,255,255,1); }
`;

const DeleteIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: rgba(255,255,255,1); }
`;

const ServiceTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  padding: 12px;
  color: #333;
`;

const AddServiceCard = styled.div`
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
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
`;

const AddServiceText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-top: 8px;
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
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: translateY(-2px); }
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
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
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

const TaskListCard = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  margin: 0 12px 22px 12px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  grid-column: 1 / -1;
`;

const TaskSectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
`;

const TaskStatus = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: ${props =>
    props.status === 'completed' ? '#27ae60' :
    props.status === 'in-progress' ? '#f2994a' : '#ccc'};
  margin-right: 12px;
`;

const TaskName = styled.div`
  flex: 1;
  font-size: 14px;
  color: #333;
`;

const TaskDate = styled.div`
  font-size: 12px;
  color: #777;
  white-space: nowrap;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #888;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: #333;
    background: #f0f0f0;
    border-radius: 50%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
  }
`;

const FileInput = styled.input`
  padding: 8px 0;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 8px;
  border: 1px solid #eee;
`;

const Button = styled.button`
  background: #000;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #333; }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  margin-top: 16px;
  font-size: 16px;
  color: #666;
`;

const LoadMoreButton = styled.button`
  background: #f5f5f5;
  color: #333;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  margin: 0 auto 32px;
  display: block;
  transition: all 0.2s ease;
  &:hover {
    background: #000;
    color: #fff;
    border-color: #000;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  background: ${props => props.type === 'success' ? '#27ae60' : '#e74c3c'};
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 4000;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ToastIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
`;

const ToastMessage = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

const SyncingBadge = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(255, 193, 7, 0.95);
  color: #333;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '⟳';
    display: inline-block;
    animation: rotate 1s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const SyncingBadgeInline = styled.span`
  margin-left: 8px;
  background: rgba(255, 193, 7, 0.2);
  color: #f39c12;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '⟳';
    display: inline-block;
    animation: rotate 1s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default ProfessionalDashboard;