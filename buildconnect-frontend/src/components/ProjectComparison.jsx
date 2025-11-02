import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Enhanced mock data with 28 professionals (original 8 + 20 new Interior Designers)
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
  },

  // 20 Additional Interior Designer Profiles
  '9': {
    id: '9',
    name: 'Sneha Gupta',
    role: 'Interior Designer',
    experience: '6+ years specializing in luxury residential interiors and contemporary styling.',
    avatar: '/sneha-gupta.jpg',
    rating: 4.6,
    projects: [
      {
        title: 'Penthouse Renovation (Delhi)',
        image: '/penthouse-renovation.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Luxury penthouse with floor-to-ceiling windows and premium finishes.',
        budget: '$8,50,000',
        timeline: '14 months',
        location: 'New Delhi, India',
        rating: 4.8
      },
      {
        title: 'Boutique Hotel Design',
        image: '/boutique-hotel.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: '30-room boutique hotel with local art integration.',
        budget: '$6,20,000',
        timeline: '10 months',
        location: 'Udaipur, Rajasthan',
        rating: 4.7
      },
      {
        title: 'Tech Startup Office',
        image: '/tech-office.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Open-plan workspace with collaboration zones.',
        budget: '$3,40,000',
        timeline: '6 months',
        location: 'Bangalore, Karnataka',
        rating: 4.5
      },
      {
        title: 'Traditional Home Makeover',
        image: '/traditional-home.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Blend of traditional and modern elements.',
        budget: '$2,80,000',
        timeline: '8 months',
        location: 'Lucknow, Uttar Pradesh',
        rating: 4.6
      },
      {
        title: 'Coffee Shop Chain Design',
        image: '/coffee-shop.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Cozy cafe design for multiple locations.',
        budget: '$4,50,000',
        timeline: '12 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.4
      },
      {
        title: 'Villa Interior Design',
        image: '/villa-interior.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Mediterranean-style villa with smart home features.',
        budget: '$12,00,000',
        timeline: '16 months',
        location: 'Goa, India',
        rating: 4.9
      },
      {
        title: 'Apartment Complex Common Areas',
        image: '/apartment-common.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Modern lobby and recreational spaces.',
        budget: '$5,60,000',
        timeline: '9 months',
        location: 'Pune, Maharashtra',
        rating: 4.6
      }
    ]
  },
  '10': {
    id: '10',
    name: 'Rohit Jain',
    role: 'Interior Designer',
    experience: '9+ years in commercial and retail space design with sustainable practices.',
    avatar: '/rohit-jain.jpg',
    rating: 4.7,
    projects: [
      {
        title: 'Shopping Mall Interior',
        image: '/shopping-mall.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '300,000 sq ft mall with contemporary design.',
        budget: '$15,00,000',
        timeline: '18 months',
        location: 'Gurgaon, Haryana',
        rating: 4.8
      },
      {
        title: 'Corporate Headquarters',
        image: '/corporate-hq.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'LEED-certified office space for tech company.',
        budget: '$10,50,000',
        timeline: '15 months',
        location: 'Hyderabad, Telangana',
        rating: 4.7
      },
      {
        title: 'Luxury Retail Store',
        image: '/luxury-retail.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'High-end fashion store with premium finishes.',
        budget: '$2,80,000',
        timeline: '5 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.9
      },
      {
        title: 'Residential Community Center',
        image: '/community-center.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Modern amenities center for gated community.',
        budget: '$6,40,000',
        timeline: '11 months',
        location: 'Ahmedabad, Gujarat',
        rating: 4.5
      },
      {
        title: 'Restaurant Chain Design',
        image: '/restaurant-chain.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Consistent design for 15 restaurant locations.',
        budget: '$7,20,000',
        timeline: '14 months',
        location: 'Multiple Cities',
        rating: 4.6
      },
      {
        title: 'Co-working Space',
        image: '/coworking-space.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Flexible workspace with modern amenities.',
        budget: '$4,20,000',
        timeline: '7 months',
        location: 'Pune, Maharashtra',
        rating: 4.7
      },
      {
        title: 'Wellness Center',
        image: '/wellness-center.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Spa and fitness center with calming design.',
        budget: '$5,80,000',
        timeline: '9 months',
        location: 'Kochi, Kerala',
        rating: 4.8
      }
    ]
  },
  '11': {
    id: '11',
    name: 'Anjali Sharma',
    role: 'Interior Designer',
    experience: '7+ years specializing in residential interior design with focus on space optimization.',
    avatar: '/anjali-sharma.jpg',
    rating: 4.5,
    projects: [
      {
        title: 'Compact Studio Design',
        image: '/compact-studio.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '300 sq ft studio with intelligent storage solutions.',
        budget: '$1,20,000',
        timeline: '3 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.6
      },
      {
        title: 'Family Home Renovation',
        image: '/family-home.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: '4BHK family home with child-friendly design.',
        budget: '$4,80,000',
        timeline: '8 months',
        location: 'Jaipur, Rajasthan',
        rating: 4.4
      },
      {
        title: 'Elderly-Friendly Home',
        image: '/elderly-friendly.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Barrier-free design for senior citizens.',
        budget: '$2,60,000',
        timeline: '6 months',
        location: 'Chandigarh, India',
        rating: 4.7
      },
      {
        title: 'Young Professional Apartment',
        image: '/young-professional.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Stylish 1BHK with smart storage.',
        budget: '$1,80,000',
        timeline: '4 months',
        location: 'Bangalore, Karnataka',
        rating: 4.5
      },
      {
        title: 'Home Office Setup',
        image: '/home-office.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Dedicated workspace for remote work.',
        budget: '$85,000',
        timeline: '2 months',
        location: 'Pune, Maharashtra',
        rating: 4.3
      },
      {
        title: 'Vintage Style Apartment',
        image: '/vintage-apartment.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '1940s-inspired design with modern amenities.',
        budget: '$3,20,000',
        timeline: '7 months',
        location: 'Kolkata, West Bengal',
        rating: 4.8
      },
      {
        title: 'Minimalist Bedroom Design',
        image: '/minimalist-bedroom.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Zen-inspired bedroom with natural materials.',
        budget: '$1,50,000',
        timeline: '3 months',
        location: 'Mysore, Karnataka',
        rating: 4.4
      }
    ]
  },
  '12': {
    id: '12',
    name: 'Vikram Patel',
    role: 'Interior Designer',
    experience: '11+ years in hospitality and luxury residential design projects.',
    avatar: '/vikram-patel.jpg',
    rating: 4.9,
    projects: [
      {
        title: '5-Star Resort Design',
        image: '/5star-resort.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Luxury beachfront resort with 200 rooms.',
        budget: '$45,00,000',
        timeline: '24 months',
        location: 'Goa, India',
        rating: 4.9
      },
      {
        title: 'Heritage Hotel Restoration',
        image: '/heritage-hotel.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '200-year-old palace converted to boutique hotel.',
        budget: '$28,00,000',
        timeline: '20 months',
        location: 'Jaipur, Rajasthan',
        rating: 4.8
      },
      {
        title: 'Mansion Interior Design',
        image: '/mansion-interior.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '25,000 sq ft mansion with classical design.',
        budget: '$35,00,000',
        timeline: '30 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.9
      },
      {
        title: 'Luxury Yacht Interior',
        image: '/luxury-yacht.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '150-foot yacht with premium finishes.',
        budget: '$12,00,000',
        timeline: '8 months',
        location: 'Mumbai Harbour',
        rating: 4.8
      },
      {
        title: 'Business Class Lounge',
        image: '/business-lounge.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Airport lounge with exclusive amenities.',
        budget: '$8,50,000',
        timeline: '12 months',
        location: 'Delhi, India',
        rating: 4.7
      },
      {
        title: 'Private Club Design',
        image: '/private-club.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Elite members club with fine dining.',
        budget: '$18,00,000',
        timeline: '16 months',
        location: 'Gurgaon, Haryana',
        rating: 4.9
      },
      {
        title: 'Chartered Flight Interior',
        image: '/chartered-flight.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Private jet cabin redesign.',
        budget: '$3,20,000',
        timeline: '4 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.8
      }
    ]
  },
  '13': {
    id: '13',
    name: 'Priya Verma',
    role: 'Interior Designer',
    experience: '5+ years in eco-friendly and sustainable interior design solutions.',
    avatar: '/priya-verma.jpg',
    rating: 4.6,
    projects: [
      {
        title: 'Green Building Interiors',
        image: '/green-building.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'LEED Platinum certified office building.',
        budget: '$6,80,000',
        timeline: '12 months',
        location: 'Bangalore, Karnataka',
        rating: 4.8
      },
      {
        title: 'Solar-Powered Home',
        image: '/solar-home.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Net-zero energy home with recycled materials.',
        budget: '$8,40,000',
        timeline: '14 months',
        location: 'Pune, Maharashtra',
        rating: 4.7
      },
      {
        title: 'Eco-Friendly Restaurant',
        image: '/eco-restaurant.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Zero-waste restaurant with local materials.',
        budget: '$4,20,000',
        timeline: '7 months',
        location: 'Mysore, Karnataka',
        rating: 4.6
      },
      {
        title: 'Sustainable Apartment Complex',
        image: '/sustainable-apartment.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Green certified residential complex.',
        budget: '$12,00,000',
        timeline: '18 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.5
      },
      {
        title: 'Organic Farm Stay',
        image: '/organic-farm.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Eco-lodge with natural building materials.',
        budget: '$5,60,000',
        timeline: '10 months',
        location: 'Ooty, Tamil Nadu',
        rating: 4.4
      },
      {
        title: 'Zero-Waste Office',
        image: '/zero-waste-office.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Corporate office with circular design principles.',
        budget: '$3,80,000',
        timeline: '8 months',
        location: 'Hyderabad, Telangana',
        rating: 4.7
      },
      {
        title: 'Recycled Materials Store',
        image: '/recycled-store.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Retail store made from upcycled materials.',
        budget: '$2,40,000',
        timeline: '5 months',
        location: 'Pondicherry, India',
        rating: 4.6
      }
    ]
  },
  '14': {
    id: '14',
    name: 'Arjun Malhotra',
    role: 'Interior Designer',
    experience: '8+ years in modern commercial and workspace design.',
    avatar: '/arjun-malhotra.jpg',
    rating: 4.7,
    projects: [
      {
        title: 'Tech Company Campus',
        image: '/tech-campus.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '500-acre IT park with modern workspaces.',
        budget: '$85,00,000',
        timeline: '36 months',
        location: 'Bangalore, Karnataka',
        rating: 4.8
      },
      {
        title: 'Flexible Office Spaces',
        image: '/flexible-office.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Hot-desking environment with collaboration zones.',
        budget: '$12,40,000',
        timeline: '15 months',
        location: 'Pune, Maharashtra',
        rating: 4.7
      },
      {
        title: 'Innovation Hub',
        image: '/innovation-hub.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Creative workspace for startups.',
        budget: '$6,80,000',
        timeline: '9 months',
        location: 'Gurgaon, Haryana',
        rating: 4.6
      },
      {
        title: 'Remote Work Center',
        image: '/remote-work-center.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Co-working space with high-speed internet.',
        budget: '$4,20,000',
        timeline: '6 months',
        location: 'Hyderabad, Telangana',
        rating: 4.5
      },
      {
        title: 'Executive Boardroom',
        image: '/executive-boardroom.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'High-tech conference room for C-suite meetings.',
        budget: '$2,80,000',
        timeline: '4 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.8
      },
      {
        title: 'Design Studio',
        image: '/design-studio.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Creative agency workspace with maker space.',
        budget: '$5,40,000',
        timeline: '8 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.7
      },
      {
        title: 'Call Center Facility',
        image: '/call-center.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '500-seat call center with acoustic design.',
        budget: '$8,60,000',
        timeline: '10 months',
        location: 'Noida, Uttar Pradesh',
        rating: 4.6
      }
    ]
  },
  '15': {
    id: '15',
    name: 'Kavya Reddy',
    role: 'Interior Designer',
    experience: '6+ years specializing in healthcare and educational facility interiors.',
    avatar: '/kavya-reddy.jpg',
    rating: 4.4,
    projects: [
      {
        title: 'Children\'s Hospital Ward',
        image: '/childrens-hospital.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Kid-friendly hospital design with play areas.',
        budget: '$4,80,000',
        timeline: '8 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.8
      },
      {
        title: 'Dental Clinic Design',
        image: '/dental-clinic.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Modern dental office with patient comfort focus.',
        budget: '$2,20,000',
        timeline: '5 months',
        location: 'Hyderabad, Telangana',
        rating: 4.5
      },
      {
        title: 'Medical College Building',
        image: '/medical-college.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Academic building with lecture halls and labs.',
        budget: '$18,00,000',
        timeline: '20 months',
        location: 'Bangalore, Karnataka',
        rating: 4.7
      },
      {
        title: 'Rehabilitation Center',
        image: '/rehabilitation-center.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Therapy-focused healthcare facility.',
        budget: '$6,40,000',
        timeline: '10 months',
        location: 'Pune, Maharashtra',
        rating: 4.6
      },
      {
        title: 'Medical Equipment Showroom',
        image: '/medical-showroom.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Interactive medical device display space.',
        budget: '$3,20,000',
        timeline: '6 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.4
      },
      {
        title: 'Research Laboratory',
        image: '/research-lab.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'BSL-3 lab with specialized equipment.',
        budget: '$12,00,000',
        timeline: '14 months',
        location: 'Delhi, India',
        rating: 4.5
      },
      {
        title: 'Health Checkup Center',
        image: '/health-center.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Preventive healthcare facility design.',
        budget: '$5,60,000',
        timeline: '9 months',
        location: 'Ahmedabad, Gujarat',
        rating: 4.3
      }
    ]
  },
  '16': {
    id: '16',
    name: 'Deepak Agarwal',
    role: 'Interior Designer',
    experience: '10+ years in luxury retail and entertainment venue design.',
    avatar: '/deepak-agarwal.jpg',
    rating: 4.8,
    projects: [
      {
        title: 'International Mall Design',
        image: '/international-mall.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '800,000 sq ft shopping mall with anchor stores.',
        budget: '$45,00,000',
        timeline: '28 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.9
      },
      {
        title: 'Cinematic Experience Center',
        image: '/cinematic-center.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'IMAX theater complex with premium dining.',
        budget: '$25,00,000',
        timeline: '18 months',
        location: 'Delhi, India',
        rating: 4.8
      },
      {
        title: 'Luxury Brand Flagship Store',
        image: '/luxury-flagship.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'High-end fashion store with bespoke elements.',
        budget: '$8,40,000',
        timeline: '10 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.9
      },
      {
        title: 'Gaming Zone Design',
        image: '/gaming-zone.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Entertainment complex with VR experiences.',
        budget: '$12,00,000',
        timeline: '12 months',
        location: 'Bangalore, Karnataka',
        rating: 4.7
      },
      {
        title: 'Food Court Renovation',
        image: '/food-court.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Upscale food court with diverse cuisines.',
        budget: '$6,80,000',
        timeline: '8 months',
        location: 'Pune, Maharashtra',
        rating: 4.6
      },
      {
        title: 'Amusement Park Design',
        image: '/amusement-park.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Family entertainment center with themed areas.',
        budget: '$35,00,000',
        timeline: '24 months',
        location: 'Hyderabad, Telangana',
        rating: 4.8
      },
      {
        title: 'Wine Bar & Lounge',
        image: '/wine-bar.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Sophisticated bar with climate-controlled storage.',
        budget: '$4,20,000',
        timeline: '6 months',
        location: 'Goa, India',
        rating: 4.7
      }
    ]
  },
  '17': {
    id: '17',
    name: 'Rhea Kapoor',
    role: 'Interior Designer',
    experience: '7+ years in art-inspired interiors and cultural space design.',
    avatar: '/rhea-kapoor.jpg',
    rating: 4.5,
    projects: [
      {
        title: 'Contemporary Art Gallery',
        image: '/art-gallery.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Minimalist gallery with flexible display systems.',
        budget: '$6,80,000',
        timeline: '9 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.8
      },
      {
        title: 'Cultural Center Design',
        image: '/cultural-center.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Multi-purpose venue for performances and exhibitions.',
        budget: '$18,00,000',
        timeline: '16 months',
        location: 'Kolkata, West Bengal',
        rating: 4.7
      },
      {
        title: 'Music Recording Studio',
        image: '/music-studio.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Professional recording facility with acoustic design.',
        budget: '$8,40,000',
        timeline: '12 months',
        location: 'Nashik, Maharashtra',
        rating: 4.6
      },
      {
        title: 'Theater Interior Design',
        image: '/theater-interior.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '500-seat auditorium with modern amenities.',
        budget: '$15,00,000',
        timeline: '14 months',
        location: 'Ahmedabad, Gujarat',
        rating: 4.9
      },
      {
        title: 'Bookstore Cafe Design',
        image: '/bookstore-cafe.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Cozy reading space with coffee service.',
        budget: '$2,80,000',
        timeline: '5 months',
        location: 'Mysore, Karnataka',
        rating: 4.4
      },
      {
        title: 'Film Screening Room',
        image: '/film-room.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Private cinema with premium seating.',
        budget: '$5,60,000',
        timeline: '7 months',
        location: 'Pune, Maharashtra',
        rating: 4.7
      },
      {
        title: 'Cultural Museum Annex',
        image: '/museum-annex.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Interactive exhibit space with multimedia displays.',
        budget: '$12,00,000',
        timeline: '11 months',
        location: 'Jaipur, Rajasthan',
        rating: 4.5
      }
    ]
  },
  '18': {
    id: '18',
    name: 'Manish Chandra',
    role: 'Interior Designer',
    experience: '9+ years in industrial and warehouse space optimization.',
    avatar: '/manish-chandra.jpg',
    rating: 4.3,
    projects: [
      {
        title: 'Automated Warehouse Design',
        image: '/automated-warehouse.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '100,000 sq ft distribution center with robotics.',
        budget: '$28,00,000',
        timeline: '18 months',
        location: 'Faridabad, Haryana',
        rating: 4.6
      },
      {
        title: 'Manufacturing Facility',
        image: '/manufacturing-facility.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Heavy industry workspace with safety systems.',
        budget: '$35,00,000',
        timeline: '24 months',
        location: 'Gurgaon, Haryana',
        rating: 4.4
      },
      {
        title: 'Cold Storage Facility',
        image: '/cold-storage.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Temperature-controlled storage with logistics.',
        budget: '$15,00,000',
        timeline: '12 months',
        location: 'Nagpur, Maharashtra',
        rating: 4.5
      },
      {
        title: 'Data Center Infrastructure',
        image: '/data-center.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Server room with redundancy systems.',
        budget: '$42,00,000',
        timeline: '20 months',
        location: 'Noida, Uttar Pradesh',
        rating: 4.7
      },
      {
        title: 'Logistics Hub Design',
        image: '/logistics-hub.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Multi-modal transportation facility.',
        budget: '$52,00,000',
        timeline: '30 months',
        location: 'Ludhiana, Punjab',
        rating: 4.3
      },
      {
        title: 'Quality Control Lab',
        image: '/qc-lab.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Testing facility for manufacturing standards.',
        budget: '$6,40,000',
        timeline: '8 months',
        location: 'Pune, Maharashtra',
        rating: 4.2
      },
      {
        title: 'Tool Storage Facility',
        image: '/tool-storage.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Organized storage for manufacturing equipment.',
        budget: '$3,80,000',
        timeline: '6 months',
        location: 'Bangalore, Karnataka',
        rating: 4.4
      }
    ]
  },
  '19': {
    id: '19',
    name: 'Zara Ali',
    role: 'Interior Designer',
    experience: '8+ years specializing in hospitality and guest experience design.',
    avatar: '/zara-ali.jpg',
    rating: 4.6,
    projects: [
      {
        title: 'Business Hotel Chain',
        image: '/business-hotel.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '300-room hotel with conference facilities.',
        budget: '$22,00,000',
        timeline: '20 months',
        location: 'Gurgaon, Haryana',
        rating: 4.7
      },
      {
        title: 'Airport Lounge Design',
        image: '/airport-lounge.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'International terminal lounge with premium services.',
        budget: '$8,50,000',
        timeline: '10 months',
        location: 'Delhi, India',
        rating: 4.8
      },
      {
        title: 'Resort Villa Interiors',
        image: '/resort-villa.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Beachfront villas with outdoor living spaces.',
        budget: '$18,00,000',
        timeline: '15 months',
        location: 'Goa, India',
        rating: 4.6
      },
      {
        title: 'Conference Center',
        image: '/conference-center.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Multi-purpose venue with divisible meeting rooms.',
        budget: '$12,00,000',
        timeline: '14 months',
        location: 'Hyderabad, Telangana',
        rating: 4.5
      },
      {
        title: 'Luxury Train Interior',
        image: '/luxury-train.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Heritage railway car restoration and design.',
        budget: '$6,80,000',
        timeline: '12 months',
        location: 'Darjeeling, West Bengal',
        rating: 4.9
      },
      {
        title: 'Guest House Design',
        image: '/guest-house.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Boutique accommodation with local charm.',
        budget: '$4,20,000',
        timeline: '8 months',
        location: 'Mysore, Karnataka',
        rating: 4.4
      },
      {
        title: 'Floating Restaurant',
        image: '/floating-restaurant.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'River cruise restaurant with panoramic views.',
        budget: '$5,60,000',
        timeline: '10 months',
        location: 'Varanasi, Uttar Pradesh',
        rating: 4.7
      }
    ]
  },
  '20': {
    id: '20',
    name: 'Harsh Patel',
    role: 'Interior Designer',
    experience: '11+ years in high-end residential and luxury lifestyle spaces.',
    avatar: '/harsh-patel.jpg',
    rating: 4.8,
    projects: [
      {
        title: 'Ultra-Luxury Penthouse',
        image: '/ultra-penthouse.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: '20,000 sq ft penthouse with panoramic city views.',
        budget: '$65,00,000',
        timeline: '28 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.9
      },
      {
        title: 'Private Island Resort',
        image: '/private-island.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Exclusive resort on private island with 25 villas.',
        budget: '$85,00,000',
        timeline: '36 months',
        location: 'Lakshadweep, India',
        rating: 4.9
      },
      {
        title: 'Megayacht Interior',
        image: '/megayacht.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '300-foot luxury yacht with premium amenities.',
        budget: '$45,00,000',
        timeline: '18 months',
        location: 'Mumbai Harbour',
        rating: 4.8
      },
      {
        title: 'Celebrity Mansion',
        image: '/celebrity-mansion.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '40,000 sq ft home with home theater and wine cellar.',
        budget: '$55,00,000',
        timeline: '32 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.9
      },
      {
        title: 'High-End Showroom',
        image: '/high-end-showroom.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Luxury automobile dealership with VIP areas.',
        budget: '$18,00,000',
        timeline: '15 months',
        location: 'Gurgaon, Haryana',
        rating: 4.7
      },
      {
        title: 'Executive Estate',
        image: '/executive-estate.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Rural estate with guest accommodation.',
        budget: '$38,00,000',
        timeline: '24 months',
        location: 'Lonavala, Maharashtra',
        rating: 4.8
      },
      {
        title: 'Private Jet Cabin',
        image: '/private-jet.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Custom interior for Boeing Business Jet.',
        budget: '$12,00,000',
        timeline: '6 months',
        location: 'Delhi, India',
        rating: 4.8
      }
    ]
  },
  '21': {
    id: '21',
    name: 'Ishaan Verma',
    role: 'Interior Designer',
    experience: '5+ years in modern minimalist and Scandinavian design principles.',
    avatar: '/ishaan-verma.jpg',
    rating: 4.4,
    projects: [
      {
        title: 'Scandinavian Apartment',
        image: '/scandinavian-apartment.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Nordic-inspired 2BHK with natural light.',
        budget: '$2,40,000',
        timeline: '5 months',
        location: 'Pune, Maharashtra',
        rating: 4.6
      },
      {
        title: 'Minimalist Office Space',
        image: '/minimalist-office.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Clean workspace with focus on functionality.',
        budget: '$4,80,000',
        timeline: '8 months',
        location: 'Bangalore, Karnataka',
        rating: 4.3
      },
      {
        title: 'Zen Garden Design',
        image: '/zen-garden.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Meditation space with water elements.',
        budget: '$1,80,000',
        timeline: '4 months',
        location: 'Mysore, Karnataka',
        rating: 4.7
      },
      {
        title: 'Monochrome Kitchen',
        image: '/monochrome-kitchen.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Black and white kitchen with hidden storage.',
        budget: '$3,20,000',
        timeline: '6 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.5
      },
      {
        title: 'Open Plan Living',
        image: '/open-plan.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Seamless living area with natural materials.',
        budget: '$5,60,000',
        timeline: '9 months',
        location: 'Gurgaon, Haryana',
        rating: 4.4
      },
      {
        title: 'Japanese-Inspired Bathroom',
        image: '/japanese-bathroom.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Spa-like bathroom with natural stone.',
        budget: '$1,20,000',
        timeline: '3 months',
        location: 'Delhi, India',
        rating: 4.6
      },
      {
        title: 'Cozy Reading Nook',
        image: '/reading-nook.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Intimate corner with built-in shelving.',
        budget: '$60,000',
        timeline: '2 months',
        location: 'Jaipur, Rajasthan',
        rating: 4.2
      }
    ]
  },
  '22': {
    id: '22',
    name: 'Mira Jain',
    role: 'Interior Designer',
    experience: '6+ years specializing in vintage and retro-inspired interiors.',
    avatar: '/mira-jain.jpg',
    rating: 4.5,
    projects: [
      {
        title: '1920s Art Deco Suite',
        image: '/art-deco-suite.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Glamorous hotel suite with period details.',
        budget: '$4,80,000',
        timeline: '8 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.8
      },
      {
        title: 'Vintage Barber Shop',
        image: '/vintage-barber.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Classic 1950s barbershop with authentic details.',
        budget: '$1,80,000',
        timeline: '4 months',
        location: 'Pune, Maharashtra',
        rating: 4.6
      },
      {
        title: 'Mid-Century Modern Home',
        image: '/mid-century.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '1950s-inspired family home design.',
        budget: '$6,40,000',
        timeline: '10 months',
        location: 'Ahmedabad, Gujarat',
        rating: 4.7
      },
      {
        title: 'Retro Diner Design',
        image: '/retro-diner.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '1950s American diner with chrome accents.',
        budget: '$2,80,000',
        timeline: '5 months',
        location: 'Chandigarh, India',
        rating: 4.4
      },
      {
        title: 'Vintage Record Store',
        image: '/record-store.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Nostalgic music store with listening booths.',
        budget: '$3,20,000',
        timeline: '6 months',
        location: 'Kolkata, West Bengal',
        rating: 4.5
      },
      {
        title: 'Classic Cinema Hall',
        image: '/classic-cinema.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Restored 1940s movie theater.',
        budget: '$12,00,000',
        timeline: '14 months',
        location: 'Madurai, Tamil Nadu',
        rating: 4.9
      },
      {
        title: 'Vintage Antique Shop',
        image: '/antique-shop.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Curated vintage furniture showroom.',
        budget: '$2,40,000',
        timeline: '5 months',
        location: 'Jaipur, Rajasthan',
        rating: 4.3
      }
    ]
  },
  '23': {
    id: '23',
    name: 'Aditya Singh',
    role: 'Interior Designer',
    experience: '12+ years in large-scale institutional and government building design.',
    avatar: '/aditya-singh.jpg',
    rating: 4.7,
    projects: [
      {
        title: 'Parliament Annex Building',
        image: '/parliament-annex.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Government building with security and accessibility features.',
        budget: '$85,00,000',
        timeline: '42 months',
        location: 'Delhi, India',
        rating: 4.8
      },
      {
        title: 'Supreme Court Chambers',
        image: '/supreme-court.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Judicial chambers with traditional and modern elements.',
        budget: '$25,00,000',
        timeline: '24 months',
        location: 'Delhi, India',
        rating: 4.9
      },
      {
        title: 'University Campus Masterplan',
        image: '/university-masterplan.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: '5-building academic campus design.',
        budget: '$120,00,000',
        timeline: '48 months',
        location: 'Gurgaon, Haryana',
        rating: 4.7
      },
      {
        title: 'Municipal Building',
        image: '/municipal-building.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'City hall with public service areas.',
        budget: '$35,00,000',
        timeline: '28 months',
        location: 'Ahmedabad, Gujarat',
        rating: 4.6
      },
      {
        title: 'Research Institute',
        image: '/research-institute.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Scientific research facility with specialized labs.',
        budget: '$65,00,000',
        timeline: '36 months',
        location: 'Bangalore, Karnataka',
        rating: 4.8
      },
      {
        title: 'Diplomatic Mission',
        image: '/diplomatic-mission.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'International embassy with cultural elements.',
        budget: '$45,00,000',
        timeline: '32 months',
        location: 'New Delhi, India',
        rating: 4.9
      },
      {
        title: 'Public Library System',
        image: '/public-library.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Central library with digital and traditional spaces.',
        budget: '$28,00,000',
        timeline: '20 months',
        location: 'Pune, Maharashtra',
        rating: 4.5
      }
    ]
  },
  '24': {
    id: '24',
    name: 'Neha Kapoor',
    role: 'Interior Designer',
    experience: '4+ years in creative studio spaces and maker environment design.',
    avatar: '/neha-kapoor.jpg',
    rating: 4.3,
    projects: [
      {
        title: 'Co-maker Space',
        image: '/co-maker-space.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Collaborative workspace with tools and equipment.',
        budget: '$3,80,000',
        timeline: '6 months',
        location: 'Pune, Maharashtra',
        rating: 4.5
      },
      {
        title: 'Artisan Workshop',
        image: '/artisan-workshop.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Craft studio with natural lighting and storage.',
        budget: '$2,40,000',
        timeline: '5 months',
        location: 'Mysore, Karnataka',
        rating: 4.4
      },
      {
        title: 'Photography Studio',
        image: '/photo-studio.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Professional studio with lighting control.',
        budget: '$4,20,000',
        timeline: '7 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.6
      },
      {
        title: 'Pottery Studio Design',
        image: '/pottery-studio.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Ceramic arts studio with kilns and work areas.',
        budget: '$2,80,000',
        timeline: '6 months',
        location: 'Kolkata, West Bengal',
        rating: 4.3
      },
      {
        title: 'Woodworking Shop',
        image: '/woodworking-shop.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Furniture workshop with dust collection system.',
        budget: '$5,60,000',
        timeline: '8 months',
        location: 'Jaipur, Rajasthan',
        rating: 4.2
      },
      {
        title: 'Digital Media Lab',
        image: '/digital-lab.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Editing suite with high-end equipment.',
        budget: '$6,80,000',
        timeline: '9 months',
        location: 'Hyderabad, Telangana',
        rating: 4.7
      },
      {
        title: 'Silk Weaving Center',
        image: '/silk-center.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Traditional weaving space with modern equipment.',
        budget: '$3,20,000',
        timeline: '7 months',
        location: 'Varanasi, Uttar Pradesh',
        rating: 4.4
      }
    ]
  },
  '25': {
    id: '25',
    name: 'Yash Gupta',
    role: 'Interior Designer',
    experience: '9+ years specializing in sports facilities and recreational spaces.',
    avatar: '/yash-gupta.jpg',
    rating: 4.6,
    projects: [
      {
        title: 'Multi-Sport Complex',
        image: '/multi-sport.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Indoor stadium with multiple courts and facilities.',
        budget: '$45,00,000',
        timeline: '30 months',
        location: 'Ahmedabad, Gujarat',
        rating: 4.8
      },
      {
        title: 'Swimming Center',
        image: '/swimming-center.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Olympic-standard pool with spectator seating.',
        budget: '$35,00,000',
        timeline: '24 months',
        location: 'Pune, Maharashtra',
        rating: 4.7
      },
      {
        title: 'Golf Clubhouse',
        image: '/golf-clubhouse.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Luxury clubhouse with pro shop and dining.',
        budget: '$22,00,000',
        timeline: '16 months',
        location: 'Gurgaon, Haryana',
        rating: 4.6
      },
      {
        title: 'Fitness Center Chain',
        image: '/fitness-chain.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Modern gym with equipment and group studios.',
        budget: '$18,00,000',
        timeline: '18 months',
        location: 'Multiple Cities',
        rating: 4.5
      },
      {
        title: 'Rock Climbing Gym',
        image: '/climbing-gym.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Indoor climbing wall with safety features.',
        budget: '$8,40,000',
        timeline: '10 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.4
      },
      {
        title: 'Tennis Academy',
        image: '/tennis-academy.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Professional tennis facility with courts.',
        budget: '$28,00,000',
        timeline: '20 months',
        location: 'Bangalore, Karnataka',
        rating: 4.7
      },
      {
        title: 'Martial Arts Dojo',
        image: '/martial-arts.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Traditional dojo with modern amenities.',
        budget: '$4,80,000',
        timeline: '8 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.3
      }
    ]
  },
  '26': {
    id: '26',
    name: 'Tanya Sharma',
    role: 'Interior Designer',
    experience: '7+ years in specialty retail and boutique store design.',
    avatar: '/tanya-sharma.jpg',
    rating: 4.4,
    projects: [
      {
        title: 'Jewelry Boutique',
        image: '/jewelry-boutique.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Luxury jewelry store with display cases.',
        budget: '$3,80,000',
        timeline: '6 months',
        location: 'Delhi, India',
        rating: 4.8
      },
      {
        title: 'Fashion Pop-up Store',
        image: '/fashion-popup.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Temporary retail space with modular displays.',
        budget: '$1,20,000',
        timeline: '3 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.2
      },
      {
        title: 'Organic Grocery Store',
        image: '/organic-grocery.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Sustainable market with fresh produce displays.',
        budget: '$2,60,000',
        timeline: '5 months',
        location: 'Pune, Maharashtra',
        rating: 4.6
      },
      {
        title: 'Bookstore Renovation',
        image: '/bookstore-renov.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Independent bookstore with reading areas.',
        budget: '$1,80,000',
        timeline: '4 months',
        location: 'Mysore, Karnataka',
        rating: 4.5
      },
      {
        title: 'Floral Design Shop',
        image: '/floral-shop.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Flower shop with cold storage and workshop.',
        budget: '$2,40,000',
        timeline: '5 months',
        location: 'Jaipur, Rajasthan',
        rating: 4.3
      },
      {
        title: 'Electronics Store',
        image: '/electronics-store.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Modern tech store with interactive displays.',
        budget: '$6,80,000',
        timeline: '8 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.4
      },
      {
        title: 'Art Supply Store',
        image: '/art-supply.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Creative supply shop with workshop space.',
        budget: '$2,80,000',
        timeline: '6 months',
        location: 'Kolkata, West Bengal',
        rating: 4.1
      }
    ]
  },
  '27': {
    id: '27',
    name: 'Raghav Mehta',
    role: 'Interior Designer',
    experience: '10+ years in budget-friendly and cost-effective design solutions.',
    avatar: '/raghav-mehta.jpg',
    rating: 4.2,
    projects: [
      {
        title: 'Affordable Housing Complex',
        image: '/affordable-housing.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Cost-effective homes for 200 families.',
        budget: '$12,00,000',
        timeline: '18 months',
        location: 'Noida, Uttar Pradesh',
        rating: 4.3
      },
      {
        title: 'Budget Hotel Chain',
        image: '/budget-hotel.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Clean, comfortable rooms for budget travelers.',
        budget: '$8,50,000',
        timeline: '12 months',
        location: 'Multiple Cities',
        rating: 4.1
      },
      {
        title: 'Student Housing',
        image: '/student-housing.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Shared accommodation for college students.',
        budget: '$6,40,000',
        timeline: '10 months',
        location: 'Bangalore, Karnataka',
        rating: 4.4
      },
      {
        title: 'Community Center',
        image: '/community-center-2.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Affordable recreational space for locals.',
        budget: '$3,80,000',
        timeline: '8 months',
        location: 'Ahmedabad, Gujarat',
        rating: 4.2
      },
      {
        title: 'Small Business Office',
        image: '/small-office.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Workspace for startups with limited budget.',
        budget: '$1,80,000',
        timeline: '4 months',
        location: 'Pune, Maharashtra',
        rating: 4.0
      },
      {
        title: 'Economy Restaurant',
        image: '/economy-restaurant.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Casual dining with efficient layout.',
        budget: '$2,40,000',
        timeline: '5 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.1
      },
      {
        title: 'Shared Workspace',
        image: '/shared-workspace.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Budget-friendly co-working space.',
        budget: '$2,80,000',
        timeline: '6 months',
        location: 'Mysore, Karnataka',
        rating: 4.2
      }
    ]
  },
  '28': {
    id: '28',
    name: 'Simran Kaur',
    role: 'Interior Designer',
    experience: '5+ years specializing in pet-friendly and animal-friendly spaces.',
    avatar: '/simran-kaur.jpg',
    rating: 4.5,
    projects: [
      {
        title: 'Veterinary Clinic',
        image: '/vet-clinic.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Modern animal hospital with separate areas.',
        budget: '$8,40,000',
        timeline: '10 months',
        location: 'Mumbai, Maharashtra',
        rating: 4.7
      },
      {
        title: 'Pet Grooming Center',
        image: '/pet-grooming.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Professional grooming facility with safety features.',
        budget: '$3,20,000',
        timeline: '6 months',
        location: 'Pune, Maharashtra',
        rating: 4.4
      },
      {
        title: 'Animal Shelter Design',
        image: '/animal-shelter.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Humane shelter with adoption center.',
        budget: '$6,80,000',
        timeline: '12 months',
        location: 'Delhi, India',
        rating: 4.6
      },
      {
        title: 'Pet-Friendly Cafe',
        image: '/pet-cafe.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Restaurant where pets are welcome.',
        budget: '$4,20,000',
        timeline: '7 months',
        location: 'Bangalore, Karnataka',
        rating: 4.3
      },
      {
        title: 'Dog Training Facility',
        image: '/dog-training.jpg',
        status: 'In Progress',
        color: '#f2994a',
        description: 'Indoor/outdoor training space with equipment.',
        budget: '$2,80,000',
        timeline: '5 months',
        location: 'Gurgaon, Haryana',
        rating: 4.2
      },
      {
        title: 'Pet Boarding Center',
        image: '/pet-boarding.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Overnight care facility with play areas.',
        budget: '$5,60,000',
        timeline: '9 months',
        location: 'Chennai, Tamil Nadu',
        rating: 4.8
      },
      {
        title: 'Equine Facility',
        image: '/equine-facility.jpg',
        status: 'Completed',
        color: '#2ecc71',
        description: 'Horse stable and training arena.',
        budget: '$12,00,000',
        timeline: '14 months',
        location: 'Punjab, India',
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
          <StatsInfo>
            📊 Now with {Object.keys(allProfiles).length} professionals including 20+ Interior Designers for comprehensive comparisons
          </StatsInfo>
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
              <p style={{fontSize: '14px', color: '#666', margin: '4px 0 0 0'}}>
                Choose from {filteredProfiles.length} available professionals
                {filterRole !== 'All' && ` in ${filterRole} category`}
              </p>
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
                    <Experience>{prof.experience}</Experience>
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
    margin-bottom: 8px;
  }
`;

const StatsInfo = styled.div`
  font-size: 14px;
  color: #007bff;
  font-weight: 500;
  background: rgba(0, 123, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
  margin-top: 8px;
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
  max-width: 700px;
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
  align-items: flex-start;

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
  margin-bottom: 4px;
`;

const Experience = styled.div`
  font-size: 12px;
  color: #888;
  line-height: 1.3;
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