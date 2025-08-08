import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const CTAContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  py: 10,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    animation: 'rotate 20s linear infinite',
  },
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(20px)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '16px',
  padding: '16px 40px',
  color: 'white',
  fontSize: '1.2rem',
  fontWeight: 700,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
  },
}));

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <CTAContainer>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Ready to Start Trading?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              maxWidth: '500px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Join thousands of traders who trust Savia for their DeFi swaps. Connect your wallet and start trading in seconds.
          </Typography>
          
          <CTAButton
            size="large"
            startIcon={<RocketLaunchIcon />}
            onClick={onGetStarted}
          >
            Launch App
          </CTAButton>
        </Box>
      </Container>
    </CTAContainer>
  );
};