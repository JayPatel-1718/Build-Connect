import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db /* , storage */ } from '../firebase';
// import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Uncomment when ready
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

// ✅ IMAGES — Place these in public/ folder
const avatar1 = "/11.png";
const service1 = "/service-interior.jpg";  // Replace with real images
const service2 = "/service-foundation.jpg";
const service3 = "/service-renovation.jpg";
const project1 = "/project-livingroom.jpg";
const project2 = "/project-bathroom.jpg";

const ProfessionalDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  // 👇 MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'service' or 'project'
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    cost: '',
    image: null,
    imageUrl: ''
  });
  const fileInputRef = useRef(null);

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

        // Fetch Services
        try {
          const servicesQuery = query(
            collection(db, 'services'),
            where('userId', '==', currentUser.uid)
          );
          const servicesSnapshot = await getDocs(servicesQuery);
          const servicesList = [];
          servicesSnapshot.forEach((doc) => {
            servicesList.push({ id: doc.id, ...doc.data() });
          });
          setServices(servicesList);
        } catch (error) {
          console.error('Error fetching services:', error);
          setServices([
            { id: '1', title: "Interior Design Services", image: service1 },
            { id: '2', title: "Foundation Services", image: service2 },
            { id: '3', title: "Renovation and Remodeling", image: service3 },
          ]);
        }

        // Fetch Projects
        try {
          const projectsQuery = query(
            collection(db, 'projects'),
            where('userId', '==', currentUser.uid)
          );
          const projectsSnapshot = await getDocs(projectsQuery);
          const projectsList = [];
          projectsSnapshot.forEach((doc) => {
            projectsList.push({ id: doc.id, ...doc.data() });
          });
          setProjects(projectsList);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setProjects([
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
          ]);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setServices([
          { id: '1', title: "Interior Design Services", image: service1 },
          { id: '2', title: "Foundation Services", image: service2 },
          { id: '3', title: "Renovation and Remodeling", image: service3 },
        ]);
        setProjects([
          {
            id: '1',
            title: "Renovation & Remodelling",
            cost: "$1,25,000",
            progress: 80,
            tasks: [
              { name: "Demolition", status: "completed", date: "Oct 5" },
              { name: "Wall Painting", status: "completed", date: "Oct 20" },
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
        ]);
      }
    });

    return () => unsubscribe();
  }, []);

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

  // 👇 OPEN MODAL
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

  // 👇 HANDLE IMAGE UPLOAD (Preview Only)
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

  // 👇 SUBMIT FORM
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

    // 👇 IMAGE UPLOAD TO FIREBASE STORAGE (COMMENTED FOR SAFETY)
    // let imageUrl = '';
    // if (formData.image) {
    //   try {
    //     const imageRef = storageRef(storage, `services/${Date.now()}_${formData.image.name}`);
    //     await uploadBytes(imageRef, formData.image);
    //     imageUrl = await getDownloadURL(imageRef);
    //   } catch (error) {
    //     console.error('Image upload error:', error);
    //     alert('Image upload failed. Using placeholder.');
    //   }
    // }

    const newEntry = {
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

    try {
      // 👇 ADD TO FIRESTORE
      const docRef = await addDoc(collection(db, modalType === 'service' ? 'services' : 'projects'), newEntry);
      
      // 👇 UPDATE LOCAL STATE
      if (modalType === 'service') {
        setServices(prev => [...prev, { id: docRef.id, ...newEntry }]);
      } else {
        setProjects(prev => [...prev, { id: docRef.id, ...newEntry }]);
      }

      alert(`${modalType === 'service' ? 'Service' : 'Project'} added successfully!`);
      closeModal();
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      alert('Failed to save. Please try again.');
    }
  };

  const handleEditService = (serviceId) => {
    alert(`Editing service ${serviceId}`);
    // 👇 Later: navigate(`/edit-service/${serviceId}`)
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteDoc(doc(db, 'services', serviceId));
        setServices(prev => prev.filter(s => s.id !== serviceId));
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service.');
      }
    }
  };

  const handleEditProject = (projectId) => {
    alert(`Editing project ${projectId}`);
    // 👇 Later: navigate(`/edit-project/${projectId}`)
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        setProjects(prev => prev.filter(p => p.id !== projectId));
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project.');
      }
    }
  };

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
              <ExploreButton>Explore Now</ExploreButton>
            </CommunityContent>
           <CommunityAvatars>
  <Avatar>
    <AvatarImg src="/11.png" alt="Community Member 1" />
  </Avatar>
  <Avatar>
    <AvatarImg src="/12.png" alt="Community Member 2" />
  </Avatar>
  <Avatar>
    <AvatarImg src="/13.png" alt="Community Member 3" />
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

      {/* ======================== YOUR SERVICES SECTION ======================== */}
      <SectionTitle>Your Services</SectionTitle>
      <ServicesGrid>
        {services.map((service) => (
          <ServiceCard key={service.id}>
            <ServiceImageWrapper>
              <ServiceImage src={service.image} alt={service.title} />
              <ServiceActions>
                <EditIcon onClick={() => handleEditService(service.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4v17h17v-7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 4-6-6 4-4L18.5 2.5z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </EditIcon>
                <DeleteIcon onClick={() => handleDeleteService(service.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m6 8v6m2-6v6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </DeleteIcon>
              </ServiceActions>
            </ServiceImageWrapper>
            <ServiceTitle>{service.title}</ServiceTitle>
          </ServiceCard>
        ))}

        {/* ADD SERVICE BUTTON */}
        <AddServiceCard onClick={openServiceModal}>
          <PlusIcon>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4v16m8-8H4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </PlusIcon>
          <AddServiceText>Add New Service</AddServiceText>
        </AddServiceCard>
      </ServicesGrid>

      {/* ======================== YOUR PROJECTS SECTION ======================== */}
      <SectionTitle>Your Projects</SectionTitle>
      <ProgressGrid>
        {projects.map((project) => (
          <React.Fragment key={project.id}>
            <ProgressCard onClick={() => toggleProjectDetails(project.id)}>
              <ProgressImage src={project.id === '1' ? project1 : project2} alt="Project" />
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
        ))}

        {/* ADD PROJECT BUTTON */}
        <BrowseMoreCard onClick={openProjectModal}>
          <PlusIcon>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4v16m8-8H4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </PlusIcon>
          <BrowseText>Browse More</BrowseText>
        </BrowseMoreCard>
      </ProgressGrid>

      {/* ======================== MODAL ======================== */}
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

// --- STYLED COMPONENTS (ALL EXISTING + NEW MODAL STYLES) ---

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
  margin-left: -12px;
  &:first-child {
    margin-left: 0;
  }
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

// ========================
// YOUR SERVICES SECTION
// ========================
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

  &:hover {
    transform: translateY(-2px);
  }
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

  &:hover {
    background: rgba(255,255,255,1);
  }
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

  &:hover {
    background: rgba(255,255,255,1);
  }
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

// ========================
// YOUR PROJECTS SECTION
// ========================
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

  &:hover {
    transform: translateY(-2px);
  }
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

// 👇 Inline Task List Styles
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

// 👇 NEW MODAL STYLES
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
  &:hover {
    background: #333;
  }
`;

export default ProfessionalDashboard;