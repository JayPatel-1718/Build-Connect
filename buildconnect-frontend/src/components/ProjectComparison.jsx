import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Enhanced mock data with all professionals
const allProfiles = {
  '1': {
    id: '1',
    name: 'Rahul Mehta',
    role: 'Interior Designer',
    experience: '8+ years in interior design, specializing in modern, minimalist, and sustainable spaces.',
    avatar: '/rahul-mehta.png',
    rating: 4.8,
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
    avatar: '/aarav-khanna.jpg',
    rating: 4.7,
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
    avatar: '/nikita-desai.jpg',
    rating: 4.8,
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
    rating: 4.9,
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
    avatar: '/priya-nair.jpg',
    rating: 4.6,
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
    avatar: '/vikram-singh.jpg',
    rating: 4.8,
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
    avatar: '/meera-patel.jpg',
    rating: 4.7,
    projects: [
      {
        title: 'Urban Park Design',
        image: '/m1.png',
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
        image: '/m2.png',
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
        image: '/m3.png',
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
        image: '/m4.png',
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
        image: '/m5.png',
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
        image: '/m6.png',
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
        image: '/m7.png',
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
    avatar: '/arjun-reddy.jpg',
    rating: 4.6,
    projects: [
      {
        title: 'Smart HVAC Installation',
        image: '/a1.png',
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
        image: '/a2.png',
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
        image: '/a3.png',
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
        image: '/a4.png',
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
        image: '/a5.png',
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
        image: '/a6.png',
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
        image: '/a7.png',
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

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

function ProjectComparison() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedProf1, setSelectedProf1] = useState(null);
  const [selectedProf2, setSelectedProf2] = useState(null);
  const [showProfSelector, setShowProfSelector] = useState(false);
  const [activeSelector, setActiveSelector] = useState(1);
  const [filterRole, setFilterRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [comparisonMode, setComparisonMode] = useState('overview');

  // Get professional IDs from URL parameters
  const prof1Id = searchParams.get('prof1');
  const prof2Id = searchParams.get('prof2');

  useEffect(() => {
    // Set initial professionals
    if (prof1Id && allProfiles[prof1Id]) {
      setSelectedProf1(allProfiles[prof1Id]);
    } else {
      setSelectedProf1(allProfiles['1']);
    }

    if (prof2Id && allProfiles[prof2Id] && prof2Id !== prof1Id) {
      setSelectedProf2(allProfiles[prof2Id]);
    } else {
      const otherProfId = Object.keys(allProfiles).find(id => id !== (prof1Id || '1'));
      setSelectedProf2(allProfiles[otherProfId]);
    }
  }, [prof1Id, prof2Id]);

  const handleProfessionalSelect = (professional) => {
    if (activeSelector === 1) {
      setSelectedProf1(professional);
    } else {
      setSelectedProf2(professional);
    }
    setShowProfSelector(false);
  };

  const filteredProfiles = Object.values(allProfiles).filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || prof.role === filterRole;
    const notSelected = prof.id !== selectedProf1?.id && prof.id !== selectedProf2?.id;
    return matchesSearch && matchesRole && (activeSelector === 1 || notSelected);
  });

  const roles = ['All', ...new Set(Object.values(allProfiles).map(prof => prof.role))];

  // Calculate comparison metrics
  const calculateMetrics = () => {
    if (!selectedProf1 || !selectedProf2) return {};

    const avgRating1 = selectedProf1.projects.reduce((sum, p) => sum + p.rating, 0) / selectedProf1.projects.length;
    const avgRating2 = selectedProf2.projects.reduce((sum, p) => sum + p.rating, 0) / selectedProf2.projects.length;

    const completedProjects1 = selectedProf1.projects.filter(p => p.status.toLowerCase().includes('completed')).length;
    const completedProjects2 = selectedProf2.projects.filter(p => p.status.toLowerCase().includes('completed')).length;

    const avgBudget1 = selectedProf1.projects.reduce((sum, p) => {
      const budget = parseInt(p.budget.replace(/[$,]/g, ''));
      return sum + budget;
    }, 0) / selectedProf1.projects.length;

    const avgBudget2 = selectedProf2.projects.reduce((sum, p) => {
      const budget = parseInt(p.budget.replace(/[$,]/g, ''));
      return sum + budget;
    }, 0) / selectedProf2.projects.length;

    return {
      ratings: { prof1: avgRating1, prof2: avgRating2 },
      completed: { prof1: completedProjects1, prof2: completedProjects2 },
      budgets: { prof1: avgBudget1, prof2: avgBudget2 },
      projectCount: { prof1: selectedProf1.projects.length, prof2: selectedProf2.projects.length }
    };
  };

  const metrics = calculateMetrics();

  if (!selectedProf1 || !selectedProf2) {
    return (
      <PageWrapper>
        <LoadingContainer>
          <h2>Loading comparison...</h2>
        </LoadingContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Header */}
      <HeroSection>
        <BackButton onClick={() => navigate('/homepage')}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M15 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Dashboard
        </BackButton>
        <HeroContent>
          <h1>Professional Comparison</h1>
          <p>Compare professionals side-by-side to make informed decisions for your project</p>
        </HeroContent>
      </HeroSection>

      {/* Mode Selector */}
      <ModeSelector>
        <ModeButton 
          active={comparisonMode === 'overview'} 
          onClick={() => setComparisonMode('overview')}
        >
          📊 Overview
        </ModeButton>
        <ModeButton 
          active={comparisonMode === 'projects'} 
          onClick={() => setComparisonMode('projects')}
        >
          🏗️ Projects
        </ModeButton>
        <ModeButton 
          active={comparisonMode === 'performance'} 
          onClick={() => setComparisonMode('performance')}
        >
          📈 Performance
        </ModeButton>
      </ModeSelector>

      {/* Professional Selection */}
      <SelectionSection>
        <SelectionCard onClick={() => { setActiveSelector(1); setShowProfSelector(true); }}>
          <CardHeader>Professional 1</CardHeader>
          <ProfessionalInfo>
            <ProfessionalAvatar src={selectedProf1.avatar} alt={selectedProf1.name} />
            <div>
              <ProfessionalName>{selectedProf1.name}</ProfessionalName>
              <ProfessionalRole>{selectedProf1.role}</ProfessionalRole>
              <ProfessionalRating>⭐ {selectedProf1.rating}</ProfessionalRating>
            </div>
          </ProfessionalInfo>
          <ChangeButton>Change</ChangeButton>
        </SelectionCard>

        <VSIndicator>VS</VSIndicator>

        <SelectionCard onClick={() => { setActiveSelector(2); setShowProfSelector(true); }}>
          <CardHeader>Professional 2</CardHeader>
          <ProfessionalInfo>
            <ProfessionalAvatar src={selectedProf2.avatar} alt={selectedProf2.name} />
            <div>
              <ProfessionalName>{selectedProf2.name}</ProfessionalName>
              <ProfessionalRole>{selectedProf2.role}</ProfessionalRole>
              <ProfessionalRating>⭐ {selectedProf2.rating}</ProfessionalRating>
            </div>
          </ProfessionalInfo>
          <ChangeButton>Change</ChangeButton>
        </SelectionCard>
      </SelectionSection>

      {/* Comparison Content */}
      {comparisonMode === 'overview' && (
        <OverviewSection>
          <ComparisonCard>
            <CardTitle>Quick Stats Comparison</CardTitle>
            <StatsGrid>
              <StatItem>
                <StatLabel>Experience Level</StatLabel>
                <StatValue1>{selectedProf1.experience.split('+')[0]}+</StatValue1>
                <StatValue2>{selectedProf2.experience.split('+')[0]}+</StatValue2>
              </StatItem>
              <StatItem>
                <StatLabel>Total Projects</StatLabel>
                <StatValue1>{metrics.projectCount.prof1}</StatValue1>
                <StatValue2>{metrics.projectCount.prof2}</StatValue2>
              </StatItem>
              <StatItem>
                <StatLabel>Average Rating</StatLabel>
                <StatValue1>⭐ {metrics.ratings.prof1.toFixed(1)}</StatValue1>
                <StatValue2>⭐ {metrics.ratings.prof2.toFixed(1)}</StatValue2>
              </StatItem>
              <StatItem>
                <StatLabel>Completed Projects</StatLabel>
                <StatValue1>{metrics.completed.prof1}</StatValue1>
                <StatValue2>{metrics.completed.prof2}</StatValue2>
              </StatItem>
            </StatsGrid>
          </ComparisonCard>
        </OverviewSection>
      )}

      {comparisonMode === 'projects' && (
        <ProjectsSection>
          <SectionTitle>Project Comparison</SectionTitle>
          <ProjectsGrid>
            {/* Professional 1 Projects */}
            <ProfessionalProjects>
              <ProfessionalHeader>
                <h3>{selectedProf1.name}'s Projects</h3>
                <ProjectCount>{selectedProf1.projects.length} Projects</ProjectCount>
              </ProfessionalHeader>
              <ProjectsList>
                {selectedProf1.projects.map((project, index) => (
                  <ProjectItem key={index}>
                    <ProjectImage src={project.image} alt={project.title} />
                    <ProjectDetails>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectMeta>
                        <span>💰 {project.budget}</span>
                        <span>⏱️ {project.timeline}</span>
                        <span>⭐ {project.rating}</span>
                      </ProjectMeta>
                      <ProjectDescription>{project.description}</ProjectDescription>
                      <ProjectStatus>
                        <StatusDot color={project.color} />
                        <StatusText color={project.color}>{project.status}</StatusText>
                      </ProjectStatus>
                    </ProjectDetails>
                  </ProjectItem>
                ))}
              </ProjectsList>
            </ProfessionalProjects>

            {/* Professional 2 Projects */}
            <ProfessionalProjects>
              <ProfessionalHeader>
                <h3>{selectedProf2.name}'s Projects</h3>
                <ProjectCount>{selectedProf2.projects.length} Projects</ProjectCount>
              </ProfessionalHeader>
              <ProjectsList>
                {selectedProf2.projects.map((project, index) => (
                  <ProjectItem key={index}>
                    <ProjectImage src={project.image} alt={project.title} />
                    <ProjectDetails>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectMeta>
                        <span>💰 {project.budget}</span>
                        <span>⏱️ {project.timeline}</span>
                        <span>⭐ {project.rating}</span>
                      </ProjectMeta>
                      <ProjectDescription>{project.description}</ProjectDescription>
                      <ProjectStatus>
                        <StatusDot color={project.color} />
                        <StatusText color={project.color}>{project.status}</StatusText>
                      </ProjectStatus>
                    </ProjectDetails>
                  </ProjectItem>
                ))}
              </ProjectsList>
            </ProfessionalProjects>
          </ProjectsGrid>
        </ProjectsSection>
      )}

      {comparisonMode === 'performance' && (
        <PerformanceSection>
          <SectionTitle>Performance Analysis</SectionTitle>
          
          <PerformanceCard>
            <PerformanceHeader>
              <h3>📊 Detailed Metrics</h3>
            </PerformanceHeader>
            <MetricsGrid>
              <MetricCard>
                <MetricTitle>Average Project Budget</MetricTitle>
                <MetricValues>
                  <MetricValue1>
                    <span className="value">${metrics.budgets.prof1.toLocaleString()}</span>
                    <span className="label">{selectedProf1.name}</span>
                  </MetricValue1>
                  <MetricValue2>
                    <span className="value">${metrics.budgets.prof2.toLocaleString()}</span>
                    <span className="label">{selectedProf2.name}</span>
                  </MetricValue2>
                </MetricValues>
              </MetricCard>

              <MetricCard>
                <MetricTitle>Success Rate</MetricTitle>
                <MetricValues>
                  <MetricValue1>
                    <span className="value">{((metrics.completed.prof1 / metrics.projectCount.prof1) * 100).toFixed(1)}%</span>
                    <span className="label">{selectedProf1.name}</span>
                  </MetricValue1>
                  <MetricValue2>
                    <span className="value">{((metrics.completed.prof2 / metrics.projectCount.prof2) * 100).toFixed(1)}%</span>
                    <span className="label">{selectedProf2.name}</span>
                  </MetricValue2>
                </MetricValues>
              </MetricCard>

              <MetricCard>
                <MetricTitle>Project Complexity</MetricTitle>
                <MetricValues>
                  <MetricValue1>
                    <span className="value">{Math.max(...selectedProf1.projects.map(p => parseInt(p.budget.replace(/[$,]/g, '')))).toLocaleString()}</span>
                    <span className="label">{selectedProf1.name}</span>
                  </MetricValue1>
                  <MetricValue2>
                    <span className="value">{Math.max(...selectedProf2.projects.map(p => parseInt(p.budget.replace(/[$,]/g, '')))).toLocaleString()}</span>
                    <span className="label">{selectedProf2.name}</span>
                  </MetricValue2>
                </MetricValues>
              </MetricCard>
            </MetricsGrid>
          </PerformanceCard>
        </PerformanceSection>
      )}

      {/* Professional Selector Modal */}
      {showProfSelector && (
        <ModalOverlay onClick={() => setShowProfSelector(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Select Professional {activeSelector}</h3>
              <CloseButton onClick={() => setShowProfSelector(false)}>×</CloseButton>
            </ModalHeader>
            
            <SearchFilters>
              <SearchInput 
                placeholder="Search professionals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FilterSelect 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </FilterSelect>
            </SearchFilters>

            <ProfessionalsList>
              {filteredProfiles.map(prof => (
                <ProfessionalCard key={prof.id} onClick={() => handleProfessionalSelect(prof)}>
                  <ProfessionalAvatar src={prof.avatar} alt={prof.name} />
                  <ProfessionalDetails>
                    <Name>{prof.name}</Name>
                    <Role>{prof.role}</Role>
                    <Rating>⭐ {prof.rating} • {prof.projects.length} projects</Rating>
                  </ProfessionalDetails>
                  <SelectButton>Select</SelectButton>
                </ProfessionalCard>
              ))}
            </ProfessionalsList>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Action Buttons */}
      <ActionSection>
        <PrimaryButton onClick={() => navigate(`/profile/${selectedProf1.id}`)}>
          View {selectedProf1.name}'s Profile
        </PrimaryButton>
        <PrimaryButton onClick={() => navigate(`/profile/${selectedProf2.id}`)}>
          View {selectedProf2.name}'s Profile
        </PrimaryButton>
        <SecondaryButton onClick={() => navigate('/homepage')}>
          🔍 Compare More Professionals
        </SecondaryButton>
      </ActionSection>
    </PageWrapper>
  );
}

export default ProjectComparison;

/* ---------------- Styled Components ---------------- */

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #f8f9fb 0%, #e9ecf1 100%);
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  padding: 20px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  h2 {
    color: #666;
    font-size: 1.5rem;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const HeroContent = styled.div`
  max-width: 700px;
  margin: 0 auto;
  h1 {
    font-size: 2rem;
    color: #222;
    font-weight: 700;
    margin-bottom: 8px;
  }
  p {
    color: #666;
    font-size: 1rem;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;

  &:hover {
    background: #f1f1f1;
    transform: translateY(-2px);
  }
`;

const ModeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const ModeButton = styled.button`
  padding: 12px 24px;
  border: 2px solid ${props => props.active ? '#007bff' : '#e0e0e0'};
  background: ${props => props.active ? '#007bff' : '#fff'};
  color: ${props => props.active ? '#fff' : '#666'};
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    border-color: #007bff;
    transform: translateY(-2px);
  }
`;

const SelectionSection = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  margin-bottom: 40px;
  align-items: center;
`;

const SelectionCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: #007bff;
  }
`;

const CardHeader = styled.div`
  font-size: 14px;
  color: #888;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ProfessionalInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const ProfessionalAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
`;

const ProfessionalName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
`;

const ProfessionalRole = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const ProfessionalRating = styled.div`
  font-size: 14px;
  color: #f39c12;
  font-weight: 600;
`;

const ChangeButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    color: #333;
  }
`;

const VSIndicator = styled.div`
  background: #007bff;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  animation: ${slideIn} 0.5s ease-out;
`;

const OverviewSection = styled.div`
  margin-bottom: 40px;
`;

const ComparisonCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #222;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 600;
  margin-bottom: 12px;
`;

const StatValue1 = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 8px;
`;

const StatValue2 = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #28a745;
`;

const ProjectsSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #222;
  text-align: center;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfessionalProjects = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const ProfessionalHeader = styled.div`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
`;

const ProjectCount = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const ProjectsList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const ProjectItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ProjectImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProjectDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProjectTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #222;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const ProjectDescription = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const ProjectStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const StatusText = styled.span`
  font-size: 12px;
  color: ${props => props.color};
  font-weight: 600;
`;

const PerformanceSection = styled.div`
  margin-bottom: 40px;
`;

const PerformanceCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
`;

const PerformanceHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;

  h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #222;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const MetricCard = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  border: 2px solid #e9ecef;
`;

const MetricTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const MetricValues = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 16px;
`;

const MetricValue1 = styled.div`
  flex: 1;
  text-align: center;

  .value {
    font-size: 24px;
    font-weight: 700;
    color: #007bff;
    display: block;
    margin-bottom: 8px;
  }

  .label {
    font-size: 12px;
    color: #666;
  }
`;

const MetricValue2 = styled.div`
  flex: 1;
  text-align: center;

  .value {
    font-size: 24px;
    font-weight: 700;
    color: #28a745;
    display: block;
    margin-bottom: 8px;
  }

  .label {
    font-size: 12px;
    color: #666;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #222;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const SearchFilters = styled.div`
  padding: 20px 24px;
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  background: white;
  cursor: pointer;
  min-width: 120px;

  &:focus {
    border-color: #007bff;
  }
`;

const ProfessionalsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const ProfessionalCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    background: #f8f9fa;
  }
`;

const ProfessionalDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
`;

const Role = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const Rating = styled.div`
  font-size: 12px;
  color: #f39c12;
`;

const SelectButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 40px;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 28px;
  padding: 14px 26px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);

  &:hover {
    background: linear-gradient(135deg, #0056b3 0%, #004494 100%);
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background: white;
  color: #007bff;
  border: 2px solid #007bff;
  box-shadow: none;

  &:hover {
    background: #007bff;
    color: white;
  }
`;