import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
  animation: `${fadeInUp} 1s ease-out`,
}));

const FloatingCard = styled(Box)(({ theme }) => ({
  position: 'absolute',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  animation: `${float} 6s ease-in-out infinite`,
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

export const HeroSection: React.FC = () => {
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
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
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
            <GradientButton size="large">
              Start Trading
            </GradientButton>
            <GradientButton size="large" variant="outlined">
              Learn More
            </GradientButton>
          </Box>
        </HeroContent>
        
        {/* Floating Cards */}
        <FloatingCard sx={{ top: '20%', left: '10%', animationDelay: '0s' }}>
          <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Best Rates
          </Typography>
        </FloatingCard>
        
        <FloatingCard sx={{ top: '30%', right: '15%', animationDelay: '2s' }}>
          <SecurityIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Secure
          </Typography>
        </FloatingCard>
        
        <FloatingCard sx={{ bottom: '25%', left: '20%', animationDelay: '4s' }}>
          <SpeedIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Lightning Fast
          </Typography>
        </FloatingCard>
      </Container>
    </HeroContainer>
  );
};