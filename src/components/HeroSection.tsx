import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

interface HeroSectionProps {
  onStartTrading: () => void;
}

const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #10b981 0%, #f97316 100%)',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  color: 'white',
  textAlign: 'center',
}));

const StaticCard = styled(Box)(({ theme }) => ({
  position: 'absolute',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '16px',
  padding: '16px 32px',
  color: 'white',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },
}));

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartTrading }) => {
  return (
    <HeroContainer>
      <Container maxWidth="lg">
        <HeroContent>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '3rem', md: '4.5rem' },
              fontWeight: 800,
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Trade Smarter with{' '}
            <Box component="span" sx={{ 
              background: 'linear-gradient(45deg, #f97316, #ea580c)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Savia
            </Box>
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            The intelligent DEX aggregator that finds you the best swap rates across all major exchanges
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <GradientButton size="large" onClick={onStartTrading}>
              Start Trading
            </GradientButton>
            <GradientButton size="large" variant="outlined">
              Learn More
            </GradientButton>
          </Box>
        </HeroContent>
      </Container>
    </HeroContainer>
  );
};