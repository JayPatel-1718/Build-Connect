import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// --- Enhanced Keyframe Animations ---
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.05); 
  }
  100% { 
    transform: scale(1); 
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const getAnimation = (animationType) => {
  const animations = {
    fadeIn: css`${fadeIn} 0.8s ease-out`,
    slideInLeft: css`${slideInLeft} 0.6s ease-out`,
    slideInRight: css`${slideInRight} 0.6s ease-out`,
    shimmer: css`${shimmer} 2s infinite linear`,
    float: css`${float} 3s ease-in-out infinite`,
    pulse: css`${pulse} 2s infinite`
  };
  return animations[animationType] || animations.fadeIn;
};

// Enhanced mock data with richer content
const mockProfiles = {
  '1': {
    id: '1',
    name: 'Rahul Mehta',
    role: 'Interior Designer',
    experience: '8+ years in interior design, specializing in modern, minimalist, and sustainable spaces.',
    avatar: '/rahul-mehta.png',
    coverImage: '/vib.png',
    contactInfo: {
      email: 'rahul.mehta@example.com',
      phone: '+91 98765 43210',
      website: 'www.rahulmehta.com',
      location: 'Mumbai, Maharashtra'
    },
    stats: {
      totalProjects: 47,
      totalEarnings: '$2.5M',
      completionRate: '96%',
      responseTime: '< 2 hours'
    },
    availability: {
      status: 'Available',
      nextAvailable: 'Immediately'
    },
    skills: [
      { name: 'Space Planning', level: 95 },
      { name: '3D Visualization', level: 90 },
      { name: 'Color Theory', level: 88 },
      { name: 'Sustainable Design', level: 92 },
      { name: 'Project Management', level: 85 },
      { name: 'Material Selection', level: 93 }
    ],
    certifications: [
      { title: 'LEED Certified Professional', year: '2019' },
      { title: 'Interior Design License', year: '2018' },
      { title: 'Sustainable Design Certificate', year: '2020' }
    ],
    achievements: [
      { 
        title: 'Best Interior Designer 2022',
        description: 'Awarded by Indian Design Council',
        icon: '🏆',
        year: '2022'
      },
      { 
        title: 'Sustainable Design Excellence',
        description: 'Recognition for eco-friendly projects',
        icon: '🌱',
        year: '2021'
      },
      { 
        title: 'Client Choice Award',
        description: 'Highest client satisfaction rating',
        icon: '⭐',
        year: '2023'
      }
    ],
    socialMedia: {
      linkedin: 'linkedin.com/in/rahul-mehta',
      instagram: '@rahulmehta_designs',
      behance: 'behance.net/rahulmehta'
    },
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
        rating: 4.8,
        category: 'Commercial',
        tags: ['Sustainable', 'Modern', 'Open Space']
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
        rating: 4.9,
        category: 'Residential',
        tags: ['Luxury', 'Renovation', 'Modern']
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
        rating: 4.7,
        category: 'Residential',
        tags: ['Smart Home', 'Minimalist', '2BHK']
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
        rating: 4.6,
        category: 'Commercial',
        tags: ['Corporate', 'Large Scale', 'Modern']
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
        rating: 4.5,
        category: 'Residential',
        tags: ['Minimalist', 'Compact', 'Multi-functional']
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
        rating: 4.7,
        category: 'Hospitality',
        tags: ['Restaurant', 'Industrial', 'Contemporary']
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
        rating: 4.8,
        category: 'Retail',
        tags: ['Boutique', 'Lighting', 'Display']
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Aarav Khanna',
    role: 'Electrical Engineer',
    experience: '5+ years in commercial electrical installations.',
    avatar: '/aarav-khanna.jpg',
    coverImage: '/smart building installation.png',
    contactInfo: {
      email: 'aarav.khanna@example.com',
      phone: '+91 98765 43211',
      website: 'www.aaravelectrical.com',
      location: 'Delhi, India'
    },
    stats: {
      totalProjects: 32,
      totalEarnings: '$1.8M',
      completionRate: '98%',
      responseTime: '< 1 hour'
    },
    availability: {
      status: 'Available',
      nextAvailable: 'Next Week'
    },
    skills: [
      { name: 'Power Distribution', level: 95 },
      { name: 'Smart Systems', level: 88 },
      { name: 'Solar Integration', level: 90 },
      { name: 'Industrial Wiring', level: 92 },
      { name: 'Safety Protocols', level: 96 },
      { name: 'Load Analysis', level: 89 }
    ],
    certifications: [
      { title: 'Professional Electrical Engineer License', year: '2019' },
      { title: 'Solar Energy Certification', year: '2020' },
      { title: 'OSHA Safety Certification', year: '2018' }
    ],
    achievements: [
      { 
        title: 'Innovation in Electrical Design',
        description: 'Award for smart building solutions',
        icon: '💡',
        year: '2023'
      },
      { 
        title: 'Safety Excellence Award',
        description: 'Zero accidents record',
        icon: '🛡️',
        year: '2022'
      }
    ],
    socialMedia: {
      linkedin: 'linkedin.com/in/aarav-khanna',
      instagram: '@aarav_electrical',
      behance: 'behance.net/aaravkhanna'
    },
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
        rating: 4.8,
        category: 'Commercial',
        tags: ['Smart Building', 'Commercial', 'High-rise']
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
        rating: 4.7,
        category: 'Industrial',
        tags: ['Industrial', 'Heavy Duty', 'Infrastructure']
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
        rating: 4.5,
        category: 'Residential',
        tags: ['Smart Home', 'Automation', 'IoT']
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
        rating: 4.9,
        category: 'Renewable',
        tags: ['Solar', 'Green Energy', 'Battery Backup']
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
        rating: 4.6,
        category: 'Data Center',
        tags: ['Data Center', 'Redundant', 'Tier-3']
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
        rating: 4.8,
        category: 'Infrastructure',
        tags: ['EV Charging', 'Network', 'Electric Vehicle']
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
        rating: 4.9,
        category: 'Healthcare',
        tags: ['Hospital', 'Critical Systems', 'Healthcare']
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Nikita Desai',
    role: 'Civil Engineer',
    experience: '7+ years in structural design for high-rises.',
    avatar: '/nikita-desai.jpg',
    coverImage: '/high rise residential complex.png',
    contactInfo: {
      email: 'nikita.desai@example.com',
      phone: '+91 98765 43212',
      website: 'www.nikitastructural.com',
      location: 'Chennai, Tamil Nadu'
    },
    stats: {
      totalProjects: 28,
      totalEarnings: '$3.2M',
      completionRate: '94%',
      responseTime: '< 3 hours'
    },
    availability: {
      status: 'Busy',
      nextAvailable: '2 Weeks'
    },
    skills: [
      { name: 'Structural Analysis', level: 96 },
      { name: 'High-rise Design', level: 93 },
      { name: 'Seismic Engineering', level: 90 },
      { name: 'Concrete Design', level: 94 },
      { name: 'Steel Structures', level: 88 },
      { name: 'Foundation Design', level: 92 }
    ],
    certifications: [
      { title: 'Professional Engineer License', year: '2017' },
      { title: 'Seismic Design Certificate', year: '2019' },
      { title: 'Structural Engineering Master\'s', year: '2016' }
    ],
    achievements: [
      { 
        title: 'Structural Excellence Award',
        description: 'Recognition for innovative high-rise design',
        icon: '🏗️',
        year: '2022'
      },
      { 
        title: 'Seismic Safety Champion',
        description: 'Leadership in earthquake-resistant design',
        icon: '🏔️',
        year: '2021'
      }
    ],
    socialMedia: {
      linkedin: 'linkedin.com/in/nikita-desai',
      instagram: '@nikita_structural',
      behance: 'behance.net/nikitadesai'
    },
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
        rating: 4.9,
        category: 'Residential',
        tags: ['High-rise', 'Residential', '35 Stories']
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
        rating: 4.8,
        category: 'Infrastructure',
        tags: ['Bridge', 'Cable-stayed', '600m']
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
        rating: 4.7,
        category: 'Transportation',
        tags: ['Metro', 'Underground', 'Seismic']
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
        rating: 4.6,
        category: 'Water Infrastructure',
        tags: ['Dam', 'Rehabilitation', 'Concrete']
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
        rating: 4.9,
        category: 'Aviation',
        tags: ['Airport', 'Expansion', 'International']
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
        rating: 4.5,
        category: 'Underground',
        tags: ['Tunnel', 'Boring Machine', 'Deep Excavation']
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
        rating: 4.8,
        category: 'Heritage',
        tags: ['Seismic', 'Retrofitting', 'Historical']
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Kabir Sharma',
    role: 'Architect',
    experience: '10+ years designing luxury homes.',
    avatar: '/11.png',
    coverImage: '/modernvilla.png',
    contactInfo: {
      email: 'kabir.sharma@example.com',
      phone: '+91 98765 43213',
      website: 'www.kabirarchitecture.com',
      location: 'Jaipur, Rajasthan'
    },
    stats: {
      totalProjects: 35,
      totalEarnings: '$4.1M',
      completionRate: '97%',
      responseTime: '< 2 hours'
    },
    availability: {
      status: 'Available',
      nextAvailable: 'This Week'
    },
    skills: [
      { name: 'Architectural Design', level: 97 },
      { name: 'Luxury Homes', level: 95 },
      { name: 'Sustainable Architecture', level: 90 },
      { name: 'Heritage Restoration', level: 88 },
      { name: '3D Modeling', level: 93 },
      { name: 'Urban Planning', level: 85 }
    ],
    certifications: [
      { title: 'Registered Architect License', year: '2014' },
      { title: 'LEED AP Certification', year: '2018' },
      { title: 'Heritage Conservation Certificate', year: '2019' }
    ],
    achievements: [
      { 
        title: 'Architect of the Year 2023',
        description: 'Recognition for outstanding architectural excellence',
        icon: '🏛️',
        year: '2023'
      },
      { 
        title: 'Sustainable Design Leader',
        description: 'Leadership in green architecture',
        icon: '🌿',
        year: '2022'
      }
    ],
    socialMedia: {
      linkedin: 'linkedin.com/in/kabir-sharma',
      instagram: '@kabir_architecture',
      behance: 'behance.net/kabirsharma'
    },
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
        rating: 4.9,
        category: 'Residential',
        tags: ['Luxury Villa', 'Sustainable', 'Custom']
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
        rating: 4.8,
        category: 'Heritage',
        tags: ['Heritage', 'Restoration', '200 Years']
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
        rating: 4.7,
        category: 'Hospitality',
        tags: ['Resort', 'Eco-friendly', 'Solar']
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
        rating: 4.6,
        category: 'Commercial',
        tags: ['Mixed-use', '15 Stories', 'Multi-purpose']
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
        rating: 4.8,
        category: 'Educational',
        tags: ['School', 'Campus', 'International']
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
        rating: 4.5,
        category: 'Residential',
        tags: ['Affordable Housing', 'Urban', 'Community']
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
        rating: 4.9,
        category: 'Cultural',
        tags: ['Museum', 'Contemporary', 'Art Gallery']
      }
    ]
  },
  '5': {
    id: '5',
    name: 'Priya Nair',
    role: 'Plumbing Engineer',
    experience: '6+ years in plumbing and water management systems.',
    avatar: '/priya-nair.jpg',
    coverImage: '/water management system.png',
    contactInfo: {
      email: 'priya.nair@example.com',
      phone: '+91 98765 43214',
      website: 'www.priyaplumbing.com',
      location: 'Kochi, Kerala'
    },
    stats: {
      totalProjects: 42,
      totalEarnings: '$1.5M',
      completionRate: '99%',
      responseTime: '< 1 hour'
    },
    availability: {
      status: 'Available',
      nextAvailable: 'Immediately'
    },
    skills: [
      { name: 'Water Systems', level: 96 },
      { name: 'Waste Management', level: 92 },
      { name: 'Rainwater Harvesting', level: 89 },
      { name: 'Pool Systems', level: 88 },
      { name: 'Hospital Plumbing', level: 94 },
      { name: 'Commercial Systems', level: 91 }
    ],
    certifications: [
      { title: 'Professional Plumbing License', year: '2018' },
      { title: 'Water Management Certification', year: '2019' },
      { title: 'Hospital Plumbing Specialist', year: '2020' }
    ],
    achievements: [
      { 
        title: 'Water Conservation Award',
        description: 'Excellence in water-saving designs',
        icon: '💧',
        year: '2023'
      },
      { 
        title: 'Healthcare Plumbing Excellence',
        description: 'Recognition for hospital plumbing systems',
        icon: '🏥',
        year: '2022'
      }
    ],
    socialMedia: {
      linkedin: 'linkedin.com/in/priya-nair',
      instagram: '@priya_plumbing',
      behance: 'behance.net/priyanair'
    },
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
        rating: 4.6,
        category: 'Residential',
        tags: ['Water Management', 'Residential Complex', '500 Units']
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
        rating: 4.7,
        category: 'Industrial',
        tags: ['Wastewater', 'Treatment', 'Textile']
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
        rating: 4.5,
        category: 'Sustainable',
        tags: ['Rainwater', 'Harvesting', '10 Acres']
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
        rating: 4.4,
        category: 'Recreational',
        tags: ['Swimming Pool', 'Heated', 'Filtration']
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
        rating: 4.8,
        category: 'Healthcare',
        tags: ['Hospital', 'Sanitation', 'Infection Control']
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
        rating: 4.3,
        category: 'Commercial',
        tags: ['Kitchen', 'Commercial', 'Grease Traps']
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
        rating: 4.6,
        category: 'Sustainable',
        tags: ['Greywater', 'Recycling', 'Reuse']
      }
    ]
  },
  '6': {
    id: '6',
    name: 'Vikram Singh',
    role: 'Construction Manager',
    experience: '9+ years managing large-scale construction projects.',
    avatar: '/vikram-singh.jpg',
    coverImage: '/shopping mall construction.png',
    contactInfo: {
      email: 'vikram.singh@example.com',
      phone: '+91 98765 43215',
      website: 'www.vikramconstruction.com',
      location: 'Gurgaon, Haryana'
    },
    stats: {
      totalProjects: 25,
      totalEarnings: '$6.8M',
      completionRate: '95%',
      responseTime: '< 2 hours'
    },
    availability: {
      status: 'Busy',
      nextAvailable: '1 Month'
    },
    skills: [
      { name: 'Project Management', level: 98 },
      { name: 'Large-scale Construction', level: 96 },
      { name: 'Team Leadership', level: 94 },
      { name: 'Quality Control', level: 92 },
      { name: 'Cost Management', level: 90 },
      { name: 'Safety Management', level: 95 }
    ],
    certifications: [
      { title: 'PMP Certification', year: '2017' },
      { title: 'Construction Management License', year: '2016' },
      { title: 'Safety Management Certificate', year: '2018' }
    ],
    achievements: [
      { 
        title: 'Construction Excellence Award',
        description: 'Outstanding project delivery record',
        icon: '🏗️',
        year: '2023'
      },
      { 
        title: 'Safety Leadership Award',
        description: 'Zero accident record on large projects',
        icon: '🛡️',
        year: '2022'
      }
    ],
    socialMedia: {
      linkedin: 'linkedin.com/in/vikram-singh',
      instagram: '@vikram_construction',
      behance: 'behance.net/vikramsingh'
    },
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
        rating: 4.8,
        category: 'Commercial',
        tags: ['Shopping Mall', '300k sq ft', 'Parking']
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
        rating: 4.7,
        category: 'Residential',
        tags: ['Township', '5000 Units', 'Gated Community']
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
        rating: 4.9,
        category: 'Hospitality',
        tags: ['Hotel', 'Spa', '5-star']
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
        rating: 4.6,
        category: 'Industrial',
        tags: ['Warehouse', 'Automated', '200k sq ft']
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
        rating: 4.8,
        category: 'Sports',
        tags: ['Stadium', '60000 Seats', 'Retractable Roof']
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
        rating: 4.7,
        category: 'Educational',
        tags: ['University', 'Campus', '15 Buildings']
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
        rating: 4.9,
        category: 'Mixed-use',
        tags: ['Skyscraper', '75 Stories', 'Mixed-use']
      }
    ]
  },
  '7': {
    id: '7',
    name: 'Meera Patel',
    role: 'Landscape Architect',
    experience: '5+ years in sustainable landscape design.',
    avatar: '/meera-patel.jpg',
    coverImage: '/m1.png',
    contactInfo: {
      email: 'meera.patel@example.com',
      phone: '+91 98765 43216',
      website: 'www.meeralandscape.com',
      location: 'Ahmedabad, Gujarat'
    },
    stats: {
      totalProjects: 38,
      totalEarnings: '$2.1M',
      completionRate: '96%',
      responseTime: '< 2 hours'
    },
    availability: {
      status: 'Available',
      nextAvailable: 'Next Week'
    },
    skills: [
      { name: 'Landscape Design', level: 94 },
      { name: 'Sustainable Practices', level: 92 },
      { name: 'Plant Selection', level: 90 },
      { name: 'Urban Planning', level: 87 },
      { name: 'Water Features', level: 89 },
      { name: 'Green Infrastructure', level: 91 }
    ],
    certifications: [
      { title: 'Landscape Architecture License', year: '2019' },
      { title: 'Sustainable Design Certification', year: '2020' },
      { title: 'Urban Planning Certificate', year: '2021' }
    ],
    achievements: [
      { 
        title: 'Green Design Excellence',
        description: 'Recognition for sustainable landscape projects',
        icon: '🌱',
        year: '2023'
      },
      { 
        title: 'Urban Green Initiative Leader',
        description: 'Leadership in urban greening projects',
        icon: '🌳',
        year: '2022'
      }
    ],
    socialMedia: {
      linkedin: 'linkedin.com/in/meera-patel',
      instagram: '@meera_landscape',
      behance: 'behance.net/meerapatel'
    },
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
        rating: 4.7,
        category: 'Public Space',
        tags: ['Urban Park', '25 Acres', 'Sustainable']
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
        rating: 4.6,
        category: 'Corporate',
        tags: ['Corporate', 'Campus', 'Tech Company']
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
        rating: 4.5,
        category: 'Residential',
        tags: ['Rooftop Garden', 'Water Features', 'Private']
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
        rating: 4.9,
        category: 'Botanical',
        tags: ['Botanical Garden', '200 Acres', 'Themed']
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
        rating: 4.4,
        category: 'Green Infrastructure',
        tags: ['Green Roof', 'Vegetated', 'Commercial']
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
        rating: 4.8,
        category: 'Healthcare',
        tags: ['Healing Garden', 'Therapeutic', 'Hospital']
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
        rating: 4.7,
        category: 'Urban Revitalization',
        tags: ['Public Plaza', 'Historic', 'Native Plants']
      }
    ]
  },
  '8': {
    id: '8',
    name: 'Arjun Reddy',
    role: 'HVAC Engineer',
    experience: '7+ years in heating and cooling systems.',
    avatar: '/arjun-reddy.jpg',
    coverImage: '/a1.png',
    contactInfo: {
      email: 'arjun.reddy@example.com',
      phone: '+91 98765 43217',
      website: 'www.arjunhvac.com',
      location: 'Hyderabad, Telangana'
    },
    stats: {
      totalProjects: 40,
      totalEarnings: '$2.8M',
      completionRate: '97%',
      responseTime: '< 1 hour'
    },
    availability: {
      status: 'Available',
      nextAvailable: 'This Week'
    },
    skills: [
      { name: 'HVAC Design', level: 96 },
      { name: 'Energy Efficiency', level: 93 },
      { name: 'Smart Controls', level: 90 },
      { name: 'Industrial Systems', level: 92 },
      { name: 'Data Center Cooling', level: 95 },
      { name: 'Geothermal Systems', level: 88 }
    ],
    certifications: [
      { title: 'HVAC Professional License', year: '2018' },
      { title: 'Energy Efficiency Certification', year: '2019' },
      { title: 'Data Center Cooling Specialist', year: '2021' }
    ],
    achievements: [
      { 
        title: 'Energy Efficiency Champion',
        description: 'Recognition for energy-saving HVAC designs',
        icon: '❄️',
        year: '2023'
      },
      { 
        title: 'Innovation in Cooling',
        description: 'Advanced cooling system solutions',
        icon: '🔧',
        year: '2022'
      }
    ],
    socialMedia: {
      linkedin: 'linkedin.com/in/arjun-reddy',
      instagram: '@arjun_hvac',
      behance: 'behance.net/arjunreddy'
    },
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
        rating: 4.5,
        category: 'Commercial',
        tags: ['Smart HVAC', 'Energy Efficient', 'Corporate']
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
        rating: 4.8,
        category: 'Data Center',
        tags: ['Data Center', 'Precision Cooling', 'Tier-4']
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
        rating: 4.9,
        category: 'Healthcare',
        tags: ['Hospital', 'Operating Theater', 'Specialized']
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
        rating: 4.6,
        category: 'Industrial',
        tags: ['Industrial', 'Process Cooling', 'Pharmaceutical']
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
        rating: 4.7,
        category: 'Residential',
        tags: ['Geothermal', 'Heat Pump', 'Luxury Villa']
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
        rating: 4.8,
        category: 'Aviation',
        tags: ['Airport', 'Terminal', 'International']
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
        rating: 4.5,
        category: 'Industrial',
        tags: ['Cold Storage', 'Food Products', 'Warehouse']
      }
    ]
  }
};

// Tab components for enhanced content
const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 30px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Tab = styled.button`
  padding: 15px 30px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.active ? '#007bff' : '#666'};
  border-bottom: 3px solid ${props => props.active ? '#007bff' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  animation: ${props => props.active ? css`${slideInLeft} 0.3s ease-out` : 'none'};

  &:hover {
    color: #007bff;
    background: #f8f9fa;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 3px;
    background: linear-gradient(90deg, #007bff, #0056b3);
    transition: width 0.3s ease;
  }
`;

const TabContent = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
  animation: ${slideInLeft} 0.6s ease-out;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.7s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 8px;
  animation: ${pulse} 2s infinite;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const SkillsSection = styled.div`
  margin: 40px 0;
  animation: ${slideInRight} 0.6s ease-out;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const SkillItem = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
`;

const SkillName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const SkillBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const SkillProgress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  border-radius: 4px;
  transition: width 1s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

const SkillLevel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const CertificationsSection = styled.div`
  margin: 40px 0;
  animation: ${slideInLeft} 0.6s ease-out;
`;

const CertificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const CertificationCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.7s ease-out;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  }
`;

const CertificationTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const CertificationYear = styled.div`
  font-size: 14px;
  color: #007bff;
  font-weight: 600;
`;

const AchievementsSection = styled.div`
  margin: 40px 0;
  animation: ${slideInRight} 0.6s ease-out;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 20px;
`;

const AchievementCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #007bff, #0056b3, #007bff);
    animation: ${shimmer} 3s infinite;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }
`;

const AchievementIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
  animation: ${float} 3s ease-in-out infinite;
`;

const AchievementTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const AchievementDescription = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const AchievementYear = styled.div`
  font-size: 12px;
  color: #007bff;
  font-weight: 600;
`;

const ContactInfoSection = styled.div`
  margin: 30px 0;
  animation: ${slideInLeft} 0.6s ease-out;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ContactItem = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.7s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
`;

const ContactIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #0056b3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
`;

const ContactDetails = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-size: 12px;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
`;

const ContactValue = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

const SocialMediaSection = styled.div`
  margin: 30px 0;
  animation: ${slideInRight} 0.6s ease-out;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,123,255,0.3);
  animation: ${fadeIn} 0.8s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,123,255,0.4);
    background: linear-gradient(135deg, #0056b3, #004494);
  }
`;

const AvailabilityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.status === 'Available' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #fd7e14, #e83e8c)'};
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin: 10px 0;
  animation: ${pulse} 2s infinite;
`;

const AvailabilityDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  animation: ${pulse} 1.5s infinite;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  animation: ${fadeIn} 0.6s ease-out;
`;

const FilterButton2 = styled.button`
  padding: 8px 20px;
  background: ${props => props.active ? 'linear-gradient(135deg, #007bff, #0056b3)' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 2px solid ${props => props.active ? '#007bff' : '#e9ecef'};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${props => props.active ? css`${slideInLeft} 0.3s ease-out` : 'none'};

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #0056b3, #004494)' : '#e9ecef'};
    transform: translateY(-1px);
  }
`;

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [projectFilter, setProjectFilter] = useState('All');

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

  // Get unique categories for filtering
  const categories = ['All', ...Array.from(new Set(profile.projects.map(proj => proj.category)))];

  // Filter projects based on selected category
  const filteredProjects = projectFilter === 'All' 
    ? profile.projects 
    : profile.projects.filter(proj => proj.category === projectFilter);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <TabContent>
            {/* Contact Information */}
            <ContactInfoSection>
              <SectionTitle>Contact Information</SectionTitle>
              <ContactGrid>
                <ContactItem>
                  <ContactIcon>📧</ContactIcon>
                  <ContactDetails>
                    <ContactLabel>Email</ContactLabel>
                    <ContactValue>{profile.contactInfo.email}</ContactValue>
                  </ContactDetails>
                </ContactItem>
                <ContactItem>
                  <ContactIcon>📱</ContactIcon>
                  <ContactDetails>
                    <ContactLabel>Phone</ContactLabel>
                    <ContactValue>{profile.contactInfo.phone}</ContactValue>
                  </ContactDetails>
                </ContactItem>
                <ContactItem>
                  <ContactIcon>🌐</ContactIcon>
                  <ContactDetails>
                    <ContactLabel>Website</ContactLabel>
                    <ContactValue>{profile.contactInfo.website}</ContactValue>
                  </ContactDetails>
                </ContactItem>
                <ContactItem>
                  <ContactIcon>📍</ContactIcon>
                  <ContactDetails>
                    <ContactLabel>Location</ContactLabel>
                    <ContactValue>{profile.contactInfo.location}</ContactValue>
                  </ContactDetails>
                </ContactItem>
              </ContactGrid>
            </ContactInfoSection>

            {/* Performance Stats */}
            <StatsSection>
              <SectionTitle>Performance Stats</SectionTitle>
              <StatsGrid>
                <StatCard>
                  <StatValue>{profile.stats.totalProjects}</StatValue>
                  <StatLabel>Total Projects</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{profile.stats.totalEarnings}</StatValue>
                  <StatLabel>Total Earnings</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{profile.stats.completionRate}</StatValue>
                  <StatLabel>Completion Rate</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{profile.stats.responseTime}</StatValue>
                  <StatLabel>Response Time</StatLabel>
                </StatCard>
              </StatsGrid>
            </StatsSection>

            {/* Availability Status */}
            <AvailabilityBadge status={profile.availability.status}>
              <AvailabilityDot />
              {profile.availability.status} - {profile.availability.nextAvailable}
            </AvailabilityBadge>

            {/* Social Media Links */}
            <SocialMediaSection>
              <SectionTitle>Connect With Me</SectionTitle>
              <SocialLinks>
                <SocialLink href={`https://${profile.socialMedia.linkedin}`} target="_blank">
                  💼 LinkedIn
                </SocialLink>
                <SocialLink href={`https://instagram.com/${profile.socialMedia.instagram.replace('@', '')}`} target="_blank">
                  📷 Instagram
                </SocialLink>
                <SocialLink href={`https://${profile.socialMedia.behance}`} target="_blank">
                  🎨 Behance
                </SocialLink>
              </SocialLinks>
            </SocialMediaSection>
          </TabContent>
        );

      case 'projects':
        return (
          <TabContent>
            <FilterButtons>
              {categories.map(category => (
                <FilterButton2
                  key={category}
                  active={projectFilter === category}
                  onClick={() => setProjectFilter(category)}
                >
                  {category}
                </FilterButton2>
              ))}
            </FilterButtons>
            <ProjectsGrid>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj, i) => (
                  <ProjectCard key={i}>
                    <ProjectImage src={proj.image} alt={proj.title} />
                    <ProjectContent>
                      <ProjectHeader>
                        <ProjectTitle>{proj.title}</ProjectTitle>
                        <ProjectCategory>{proj.category}</ProjectCategory>
                      </ProjectHeader>
                      <ProjectDescription>{proj.description}</ProjectDescription>
                      <ProjectTags>
                        {proj.tags.map((tag, index) => (
                          <ProjectTag key={index}>{tag}</ProjectTag>
                        ))}
                      </ProjectTags>
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
                  <p>No projects found in this category.</p>
                </NoProjectsCard>
              )}
            </ProjectsGrid>
          </TabContent>
        );

      case 'skills':
        return (
          <TabContent>
            <SkillsSection>
              <SectionTitle>Skills & Expertise</SectionTitle>
              <SkillsGrid>
                {profile.skills.map((skill, index) => (
                  <SkillItem key={index}>
                    <SkillName>{skill.name}</SkillName>
                    <SkillBar>
                      <SkillProgress style={{ width: `${skill.level}%` }} />
                    </SkillBar>
                    <SkillLevel>{skill.level}%</SkillLevel>
                  </SkillItem>
                ))}
              </SkillsGrid>
            </SkillsSection>
          </TabContent>
        );

      case 'achievements':
        return (
          <TabContent>
            <CertificationsSection>
              <SectionTitle>Certifications</SectionTitle>
              <CertificationsGrid>
                {profile.certifications.map((cert, index) => (
                  <CertificationCard key={index}>
                    <CertificationTitle>{cert.title}</CertificationTitle>
                    <CertificationYear>{cert.year}</CertificationYear>
                  </CertificationCard>
                ))}
              </CertificationsGrid>
            </CertificationsSection>

            <AchievementsSection>
              <SectionTitle>Achievements</SectionTitle>
              <AchievementsGrid>
                {profile.achievements.map((achievement, index) => (
                  <AchievementCard key={index}>
                    <AchievementIcon>{achievement.icon}</AchievementIcon>
                    <AchievementTitle>{achievement.title}</AchievementTitle>
                    <AchievementDescription>{achievement.description}</AchievementDescription>
                    <AchievementYear>{achievement.year}</AchievementYear>
                  </AchievementCard>
                ))}
              </AchievementsGrid>
            </AchievementsSection>
          </TabContent>
        );

      default:
        return null;
    }
  };

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
        {/* Enhanced Profile Card with Cover Image */}
        <ProfileCard>
          <CoverImage src={profile.coverImage} alt="Cover" />
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
              <CompareButton onClick={() => navigate('/compare')}>
                Compare with Other Profiles
              </CompareButton>
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

        {/* Enhanced Navigation Tabs */}
        <TabContainer>
          <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            Overview
          </Tab>
          <Tab active={activeTab === 'projects'} onClick={() => setActiveTab('projects')}>
            Projects ({profile.projects.length})
          </Tab>
          <Tab active={activeTab === 'skills'} onClick={() => setActiveTab('skills')}>
            Skills
          </Tab>
          <Tab active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')}>
            Achievements
          </Tab>
        </TabContainer>

        {/* Tab Content */}
        {renderTabContent()}

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

// --- STYLED COMPONENTS WITH ENHANCED ANIMATIONS ---
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
  animation: ${slideInLeft} 0.6s ease-out;
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
  text-decoration: none;
  outline: none;
  animation: ${fadeIn} 0.5s ease-out;
  &:hover {
    border-color: #d0d0d0;
    background: #f9f9f9;
    transform: translateY(-1px);
  }
  &:focus {
    outline: none;
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
  animation: ${slideInLeft} 0.7s ease-out;
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
  animation: ${slideInLeft} 0.8s ease-out;
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
  animation: ${fadeIn} 0.9s ease-out;
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
  animation: ${slideInRight} 1s ease-out;
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
  padding: 0;
  margin-bottom: 30px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  overflow: hidden;
  position: relative;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  }
`;

const CoverImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  animation: ${fadeIn} 0.7s ease-out;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0,123,255,0.1), rgba(0,86,179,0.1));
  }
`;

const ProfileHeader = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  align-items: flex-start;
  padding: 30px;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%);
  position: relative;
  z-index: 2;
  margin-top: -60px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const AvatarSection = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
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

const CompareButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  animation: ${fadeIn} 1s ease-out;
  margin-bottom: 10px;

  &:hover {
    background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
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

const StatsSection = styled.div`
  margin: 40px 0;
  animation: ${slideInRight} 0.6s ease-out;
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

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ProjectTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
  flex: 1;
`;

const ProjectCategory = styled.span`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 10px;
  white-space: nowrap;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 15px 0;
  animation: ${fadeIn} 0.9s ease-out;
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  animation: ${slideInLeft} 1s ease-out;
`;

const ProjectTag = styled.span`
  background: #f8f9fa;
  color: #007bff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;

  ${ProjectCard}:hover & {
    background: #007bff;
    color: white;
  }
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