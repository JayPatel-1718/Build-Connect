import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// --- Keyframe Animations ---
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

// Enhanced mock data with 6-8 projects per profile
const mockProfiles = {
  '1': {
    id: '1',
    name: 'Rahul Mehta',
    role: 'Interior Designer',
    experience: '8+ years in interior design, specializing in modern, minimalist, and sustainable spaces.',
    avatar: '/rahul-mehta.png',
    projects: [
      {
        title: 'Vibrant Office Space (Bangalore)',
        image: '/vib.png',
        status: 'Currently Working',
        color: '#e74c3c',
        description: 'Modern office design with sustainable materials and open workspaces.',
        budget: '$2,50,000',
        timeline: '6 months',
        location: 'Bangalore, Karnataka',
        rating: 4.8
      },
      {
        title: 'Luxury Villa Renovation (Pune)',
        image: '/luxufry.png',
        status: 'Completed In 1 Years',
        color: '#2ecc71',
        description: 'Complete renovation of 3BHK villa with modern amenities.',
        budget: '$5,00,000',
        timeline: '12 months',
        location: 'Pune, Maharashtra',
        rating: 4.9
      },
      {
        title: 'Modern Apartment Design',
        image: '/modern.png',
        status: 'Completed',
        color: '#2ecc71',
        description: '2BHK apartment with smart home integration.',
        budget: '$1,80,000',
        timeline: '4 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.7
      },
      {
        title: 'Corporate Office Hub',
        image: '/hub.png',
        status: 'In Progress',
        color: '#f2994a',
        description: '20,000 sq ft corporate office space.',
        budget: '$8,00,000',
        timeline: '8 months',
        location: 'Hyderabad, Telangana',
        rating: 4.6
      },
      {
        title: 'Minimalist Studio Apartment',
        image: '/minimalist.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Compact 400 sq ft studio with multi-functional furniture.',
        budget: '$95,000',
        timeline: '3 months',
        location: 'Delhi, India',
        rating: 4.5
      },
      {
        title: 'Restaurant Interior Design',
        image: '/restauran.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Contemporary restaurant with industrial-chic elements.',
        budget: '$3,20,000',
        timeline: '5 months',
        location: 'Chandigarh, India',
        rating: 4.7
      },
      {
        title: 'Retail Storefront Revamp',
        image: '/rewamp.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Fashion boutique with custom lighting and display units.',
        budget: '$1,50,000',
        timeline: '4 months',
        location: 'Ahmedabad, Gujarat',
        rating: 4.8
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Aarav Khanna',
    role: 'Electrical Engineer',
    experience: '5+ years in commercial electrical installations.',
    avatar: '/11.png',
    projects: [
      {
        title: 'Smart Building Installation',
        image: '/smart building installation.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Complete electrical system for 20-story commercial building.',
        budget: '$3,20,000',
        timeline: '8 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.8
      },
      {
        title: 'Industrial Complex Wiring',
        image: '/industrial complex wiring.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Electrical infrastructure for 50,000 sq ft industrial complex.',
        budget: '$4,50,000',
        timeline: '10 months',
        location: 'Ahmedabad, Gujarat',
        rating: 4.7
      },
      {
        title: 'Smart Home Automation',
        image: '/smart home automation.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Complete home automation system.',
        budget: '$1,20,000',
        timeline: '3 months',
        location: 'Pune, Maharashtra',
        rating: 4.5
      },
      {
        title: 'Solar Power Integration',
        image: '/solar power integration.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Solar panels with battery backup for residential complex.',
        budget: '$2,80,000',
        timeline: '6 months',
        location: 'Bangalore, Karnataka',
        rating: 4.9
      },
      {
        title: 'Data Center Electrical Setup',
        image: '/data center electrical setup.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Redundant power supply for Tier-3 data center.',
        budget: '$15,00,000',
        timeline: '12 months',
        location: 'Noida, Uttar Pradesh',
        rating: 4.6
      },
      {
        title: 'EV Charging Station Network',
        image: '/ev charging station network.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Installation of 50 EV charging points across city.',
        budget: '$8,50,000',
        timeline: '9 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.8
      },
      {
        title: 'Hospital Electrical Infrastructure',
        image: '/hospital electrical infrastructure.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Specialized electrical system for 500-bed hospital.',
        budget: '$6,20,000',
        timeline: '10 months',
        location: 'Kolkata, West Bengal',
        rating: 4.9
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Nikita Desai',
    role: 'Civil Engineer',
    experience: '7+ years in structural design for high-rises.',
    avatar: '/13.png',
    projects: [
      {
        title: 'High-Rise Residential Complex',
        image: '/high rise residential complex.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Structural design for 35-story residential building.',
        budget: '$25,00,000',
        timeline: '24 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.9
      },
      {
        title: 'Bridge Construction Project',
        image: '/bridge construction project.png',
        status: 'In Progress',
        color: '#f2994a',
        description: '600m cable-stayed bridge design.',
        budget: '$50,00,000',
        timeline: '36 months',
        location: 'Kolkata, West Bengal',
        rating: 4.8
      },
      {
        title: 'Metro Station Structural Design',
        image: '/metro station structural design.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Underground metro station with seismic resistance.',
        budget: '$18,00,000',
        timeline: '20 months',
        location: 'Delhi, India',
        rating: 4.7
      },
      {
        title: 'Dam Rehabilitation Project',
        image: '/dam rehabilitation project.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Strengthening of 50-year-old concrete gravity dam.',
        budget: '$32,00,000',
        timeline: '30 months',
        location: 'Uttarakhand, India',
        rating: 4.6
      },
      {
        title: 'Airport Terminal Expansion',
        image: '/airport terminal expansion.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Structural additions to international airport terminal.',
        budget: '$45,00,000',
        timeline: '28 months',
        location: 'Hyderabad, Telangana',
        rating: 4.9
      },
      {
        title: 'Tunnel Boring Machine Shaft',
        image: '/tunnel boring machine shaft.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Deep excavation for underground metro tunnel.',
        budget: '$12,00,000',
        timeline: '18 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.5
      },
      {
        title: 'Seismic Retrofitting Project',
        image: '/seismic retrofitting project.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Retrofitting of 20 historical buildings for earthquake safety.',
        budget: '$8,50,000',
        timeline: '15 months',
        location: 'Jaipur, Rajasthan',
        rating: 4.8
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Kabir Sharma',
    role: 'Architect',
    experience: '10+ years designing luxury homes.',
    avatar: '/11.png',
    projects: [
      {
        title: 'Modern Villa Design',
        image: '/modernvilla.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Custom luxury villa with sustainable architecture.',
        budget: '$8,00,000',
        timeline: '18 months',
        location: 'Goa, India',
        rating: 4.9
      },
      {
        title: 'Heritage Restoration',
        image: '/heritage.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Restoration of 200-year-old heritage building.',
        budget: '$12,00,000',
        timeline: '24 months',
        location: 'Jaipur, Rajasthan',
        rating: 4.8
      },
      {
        title: 'Eco-Friendly Resort',
        image: '/resort.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Sustainable resort with solar integration.',
        budget: '$15,00,000',
        timeline: '18 months',
        location: 'Kochi, Kerala',
        rating: 4.7
      },
      {
        title: 'Mixed-Use Development',
        image: '/mixed.png',
        status: 'In Progress',
        color: '#f2994a',
        description: '15-story building with retail, offices, and apartments.',
        budget: '$35,00,000',
        timeline: '30 months',
        location: 'Pune, Maharashtra',
        rating: 4.6
      },
      {
        title: 'School Campus Design',
        image: '/schoolcampus.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Green campus for international school with 2,000 students.',
        budget: '$22,00,000',
        timeline: '24 months',
        location: 'Chandigarh, India',
        rating: 4.8
      },
      {
        title: 'Urban Housing Complex',
        image: '/urban.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Affordable housing for 500 families with community spaces.',
        budget: '$18,00,000',
        timeline: '22 months',
        location: 'Surat, Gujarat',
        rating: 4.5
      },
      {
        title: 'Museum Architecture',
        image: '/museum.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Contemporary art museum with climate-controlled galleries.',
        budget: '$30,00,000',
        timeline: '28 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.9
      }
    ]
  },
  '5': {
    id: '5',
    name: 'Priya Nair',
    role: 'Plumbing Engineer',
    experience: '6+ years in plumbing and water management systems.',
    avatar: '/12.png',
    projects: [
      {
        title: 'Water Management System',
        image: '/water management system.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Complete water management for 500-unit residential complex.',
        budget: '$2,00,000',
        timeline: '6 months',
        location: 'Thiruvananthapuram, Kerala',
        rating: 4.6
      },
      {
        title: 'Industrial Wastewater Treatment',
        image: '/industrial wastewater treatment.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Treatment plant for textile manufacturing facility.',
        budget: '$1,80,000',
        timeline: '5 months',
        location: 'Coimbatore, Tamil Nadu',
        rating: 4.7
      },
      {
        title: 'Rainwater Harvesting System',
        image: '/rainwater harvesting system.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Collection and storage system for 10-acre campus.',
        budget: '$95,000',
        timeline: '3 months',
        location: 'Mysore, Karnataka',
        rating: 4.5
      },
      {
        title: 'Swimming Pool Plumbing',
        image: '/swimming pool plumbing.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Heated pool with filtration and chemical dosing system.',
        budget: '$75,000',
        timeline: '2 months',
        location: 'Kochi, Kerala',
        rating: 4.4
      },
      {
        title: 'Hospital Sanitation System',
        image: '/hospital sanitaion system.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Specialized plumbing for infection control in medical facility.',
        budget: '$3,20,000',
        timeline: '4 months',
        location: 'Visakhapatnam, Andhra Pradesh',
        rating: 4.8
      },
      {
        title: 'Commercial Kitchen Plumbing',
        image: '/commercial kitchen plumbing.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'High-volume kitchen with grease traps and waste disposal.',
        budget: '$1,50,000',
        timeline: '3 months',
        location: 'Indore, Madhya Pradesh',
        rating: 4.3
      },
      {
        title: 'Greywater Recycling Plant',
        image: '/greywater recycling plant.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'System to reuse washing machine and shower water.',
        budget: '$1,20,000',
        timeline: '4 months',
        location: 'Puducherry, India',
        rating: 4.6
      }
    ]
  },
  '6': {
    id: '6',
    name: 'Vikram Singh',
    role: 'Construction Manager',
    experience: '9+ years managing large-scale construction projects.',
    avatar: '/13.png',
    projects: [
      {
        title: 'Shopping Mall Construction',
        image: '/shopping mall construction.png',
        status: 'In Progress',
        color: '#f2994a',
        description: '300,000 sq ft shopping mall with parking.',
        budget: '$80,00,000',
        timeline: '30 months',
        location: 'Noida, Uttar Pradesh',
        rating: 4.8
      },
      {
        title: 'Residential Township',
        image: '/residential township.png',
        status: 'Completed',
        color: '#2ecc71',
        description: '5,000-unit gated community with amenities.',
        budget: '$120,00,000',
        timeline: '36 months',
        location: 'Gurgaon, Haryana',
        rating: 4.7
      },
      {
        title: 'Hotel & Spa Complex',
        image: '/hotel and spa complex.png',
        status: 'In Progress',
        color: '#f2994a',
        description: '5-star hotel with wellness center and conference facilities.',
        budget: '$45,00,000',
        timeline: '24 months',
        location: 'Udaipur, Rajasthan',
        rating: 4.9
      },
      {
        title: 'Industrial Warehouse',
        image: '/industrial warehouse.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Automated warehouse with 200,000 sq ft storage.',
        budget: '$25,00,000',
        timeline: '18 months',
        location: 'Faridabad, Haryana',
        rating: 4.6
      },
      {
        title: 'Sports Stadium Construction',
        image: '/sports stadium construction.png',
        status: 'In Progress',
        color: '#f2994a',
        description: '60,000-seater stadium with retractable roof.',
        budget: '$150,00,000',
        timeline: '42 months',
        location: 'Mohali, Punjab',
        rating: 4.8
      },
      {
        title: 'Educational Institution',
        image: '/educational institution.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'University campus with 15 buildings and student housing.',
        budget: '$65,00,000',
        timeline: '30 months',
        location: 'Dehradun, Uttarakhand',
        rating: 4.7
      },
      {
        title: 'Mixed-Use Skyscraper',
        image: '/mixed use skyscraper.png',
        status: 'In Progress',
        color: '#f2994a',
        description: '75-story tower with offices, residences, and retail.',
        budget: '$200,00,000',
        timeline: '48 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.9
      }
    ]
  },
  '7': {
    id: '7',
    name: 'Meera Patel',
    role: 'Landscape Architect',
    experience: '5+ years in sustainable landscape design.',
    avatar: '/11.png',
    projects: [
      {
        title: 'Urban Park Design',
        image: '/image.png',
        status: 'Completed',
        color: '#2ecc71',
        description: '25-acre urban park with sustainable features.',
        budget: '$3,50,000',
        timeline: '12 months',
        location: 'Surat, Gujarat',
        rating: 4.7
      },
      {
        title: 'Corporate Campus Landscaping',
        image: '/image-1.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Green spaces for tech company headquarters.',
        budget: '$2,80,000',
        timeline: '10 months',
        location: 'Hyderabad, Telangana',
        rating: 4.6
      },
      {
        title: 'Residential Garden Design',
        image: '/image-2.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Private rooftop garden with water features.',
        budget: '$1,20,000',
        timeline: '6 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.5
      },
      {
        title: 'Botanical Garden Masterplan',
        image: '/image.png',
        status: 'Completed',
        color: '#2ecc71',
        description: '200-acre botanical garden with themed sections.',
        budget: '$15,00,000',
        timeline: '24 months',
        location: 'Mysore, Karnataka',
        rating: 4.9
      },
      {
        title: 'Green Roof Installation',
        image: '/image-1.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Vegetated roof system for commercial building.',
        budget: '$95,000',
        timeline: '4 months',
        location: 'Pune, Maharashtra',
        rating: 4.4
      },
      {
        title: 'Hospital Healing Garden',
        image: '/image-2.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Therapeutic outdoor space for patient recovery.',
        budget: '$1,80,000',
        timeline: '8 months',
        location: 'Ahmedabad, Gujarat',
        rating: 4.8
      },
      {
        title: 'Public Plaza Revitalization',
        image: '/image.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Renovation of historic city square with native plants.',
        budget: '$2,20,000',
        timeline: '9 months',
        location: 'Jaipur, Rajasthan',
        rating: 4.7
      }
    ]
  },
  '8': {
    id: '8',
    name: 'Arjun Reddy',
    role: 'HVAC Engineer',
    experience: '7+ years in heating and cooling systems.',
    avatar: '/15.png',
    projects: [
      {
        title: 'Smart HVAC Installation',
        image: '/image-1.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Energy-efficient HVAC for corporate office.',
        budget: '$8,00,000',
        timeline: '6 months',
        location: 'Hyderabad, Telangana',
        rating: 4.5
      },
      {
        title: 'Data Center Cooling System',
        image: '/image-2.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Precision cooling for Tier-4 data center.',
        budget: '$12,00,000',
        timeline: '8 months',
        location: 'Noida, Uttar Pradesh',
        rating: 4.8
      },
      {
        title: 'Hospital HVAC System',
        image: '/image.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Specialized ventilation for operating theaters.',
        budget: '$6,50,000',
        timeline: '7 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.9
      },
      {
        title: 'Industrial Process Cooling',
        image: '/image-1.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Chilled water system for pharmaceutical manufacturing.',
        budget: '$4,20,000',
        timeline: '5 months',
        location: 'Vadodara, Gujarat',
        rating: 4.6
      },
      {
        title: 'Residential Geothermal System',
        image: '/image-2.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Ground-source heat pump for luxury villa.',
        budget: '$2,80,000',
        timeline: '4 months',
        location: 'Bangalore, Karnataka',
        rating: 4.7
      },
      {
        title: 'Airport Terminal HVAC',
        image: '/image.png',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Central air conditioning for international terminal.',
        budget: '$25,00,000',
        timeline: '12 months',
        location: 'Kochi, Kerala',
        rating: 4.8
      },
      {
        title: 'Cold Storage Facility',
        image: '/image-1.png',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Temperature-controlled warehouse for food products.',
        budget: '$3,50,000',
        timeline: '6 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.5
      }
    ]
  }
};

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  useEffect(() => {
    const data = mockProfiles[userId];
    if (data) {
      setProfile(data);
    } else {
      navigate('/dashboard');
    }
  }, [userId, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  const displayName = userProfile?.firstName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayAvatar = user?.photoURL || '/11.png';

  // Get other unique profiles (excluding current profile)
  const otherProfiles = Object.values(mockProfiles).filter(p => p.id !== profile.id);

  return (
    <Container>
      {/* NAVBAR - Same as HomePage with Back Button */}
      <Header>
        <LeftSection>
        <BackButton onClick={() => navigate('/homepage')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </BackButton>
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
              <UserEmail>Hello, {displayName}</UserEmail>
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

      {/* Main Content */}
      <MainContent>
        {/* Profile Card */}
        <ProfileCard>
          <ProfileHeader>
            <AvatarSection>
              <ProfileAvatar src={profile.avatar} alt={profile.name} />
            </AvatarSection>
            <ProfileInfo>
              <ProfileName>{profile.name}</ProfileName>
              <ProfileRole>{profile.role}</ProfileRole>
              <ProfileBio>{profile.experience}</ProfileBio>
            </ProfileInfo>
            <ProfileActions>
              <PortfolioButton>Portfolio</PortfolioButton>
               <IconCircle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
                <path fill="currentColor" d="M19 3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7.333L4 21.5c-.824.618-2 .03-2-1V6a3 3 0 0 1 3-3zm0 2H5a1 1 0 0 0-1 1v13l2.133-1.6a2 2 0 0 1 1.2-.4H19a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1m-8 7a1 1 0 0 1 .117 1.993L11 14H8a1 1 0 0 1-.117-1.993L8 12zm5-4a1 1 0 1 1 0 2H8a1 1 0 0 1 0-2z"/>
              </g>
            </svg>
          </IconCircle>
            </ProfileActions>
          </ProfileHeader>
        </ProfileCard>

        {/* Projects Section */}
        <SectionTitle>Projects ({profile.projects.length})</SectionTitle>
        <ProjectsGrid>
          {profile.projects.length > 0 ? (
            profile.projects.map((proj, i) => (
              <ProjectCard key={i}>
                <ProjectImage src={proj.image} alt={proj.title} />
                <ProjectContent>
                  <ProjectTitle>{proj.title}</ProjectTitle>
                  <ProjectDescription>{proj.description}</ProjectDescription>
                  <ProjectDetails>
                    <DetailItem>
                      <DetailLabel>Budget:</DetailLabel>
                      <DetailValue>{proj.budget}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Timeline:</DetailLabel>
                      <DetailValue>{proj.timeline}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Location:</DetailLabel>
                      <DetailValue>{proj.location}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Rating:</DetailLabel>
                      <RatingValue>{proj.rating} ⭐</RatingValue>
                    </DetailItem>
                  </ProjectDetails>
                  <ProjectStatus>
                    <StatusDot color={proj.color} />
                    <StatusText color={proj.color}>{proj.status}</StatusText>
                  </ProjectStatus>
                </ProjectContent>
              </ProjectCard>
            ))
          ) : (
            <NoProjectsCard>
              <p>No projects available for this professional.</p>
            </NoProjectsCard>
          )}
        </ProjectsGrid>

        {/* More Profiles */}
        <SectionTitle>More Professionals</SectionTitle>
        <MoreProfilesGrid>
          {otherProfiles.map((p, i) => (
            <ProfileCardSmall key={i} onClick={() => navigate(`/profile/${p.id}`)}>
              <ProfileAvatarSmall src={p.avatar} alt={p.name} />
              <ProfileNameSmall>{p.name}</ProfileNameSmall>
              <ProfileRoleSmall>{p.role}</ProfileRoleSmall>
              <ProfileProjects>{p.projects.length} Projects</ProfileProjects>
            </ProfileCardSmall>
          ))}
        </MoreProfilesGrid>
      </MainContent>
    </Container>
  );
};

// --- STYLED COMPONENTS WITH ANIMATIONS ---

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

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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
  text-decoration: none;        /* Ensures no underline */
  outline: none;                /* Removes blue focus ring */
  &:hover {
    border-color: #d0d0d0;
    background: #f9f9f9;
  }
  &:focus {
    outline: none;              /* Critical: removes blue focus outline */
    box-shadow: none;
  }
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
    animation: ${pulse} 2s infinite;
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
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
  animation: ${pulse} 1.5s infinite;
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
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
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
  margin-top: 2px;
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
  padding: 0 20px;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ProfileCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  }
`;

const ProfileHeader = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  align-items: flex-start;
`;

const AvatarSection = styled.div`
  display: flex;
  justify-content: center;
`;

const ProfileAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  animation: ${fadeIn} 0.7s ease-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProfileName = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #222;
  margin: 0;
  letter-spacing: -0.5px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ProfileRole = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #007bff;
  margin: 0;
  animation: ${fadeIn} 0.7s ease-out;
`;

const ProfileBio = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  margin: 0;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ProfileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PortfolioButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  animation: ${fadeIn} 0.9s ease-out;

  &:hover {
    background: linear-gradient(135deg, #0056b3 0%, #004494 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
  }
`;

const ChatButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f0f0f0;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  animation: ${fadeIn} 1s ease-out;

  &:hover {
    background: #e0e0e0;
    transform: scale(1.05);
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 40px 0 20px 0;
  letter-spacing: -0.2px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const ProjectCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  animation: ${fadeIn} 0.6s ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  animation: ${fadeIn} 0.7s ease-out;

  ${ProjectCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProjectContent = styled.div`
  padding: 20px;
`;

const ProjectTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 15px 0;
  animation: ${fadeIn} 0.9s ease-out;
`;

const ProjectDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: #888;
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

const RatingValue = styled.span`
  font-size: 14px;
  color: #f39c12;
  font-weight: 600;
`;

const ProjectStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const StatusText = styled.span`
  font-size: 14px;
  color: ${props => props.color};
  font-weight: 600;
`;

const NoProjectsCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  grid-column: 1 / -1;
  text-align: center;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  }

  p {
    margin: 0;
    color: #777;
    font-size: 16px;
    font-weight: 500;
  }
`;

const MoreProfilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const ProfileCardSmall = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  animation: ${fadeIn} 0.7s ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  }
`;

const ProfileAvatarSmall = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 10px;
  border: 2px solid #f0f0f0;
  transition: transform 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out;

  ${ProfileCardSmall}:hover & {
    transform: scale(1.1);
  }
`;

const ProfileNameSmall = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  animation: ${fadeIn} 0.9s ease-out;
`;

const ProfileRoleSmall = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  animation: ${fadeIn} 1s ease-out;
`;

const ProfileProjects = styled.div`
  font-size: 12px;
  color: #007bff;
  font-weight: 500;
  animation: ${fadeIn} 1.1s ease-out;
`;

export default ProfilePage;
