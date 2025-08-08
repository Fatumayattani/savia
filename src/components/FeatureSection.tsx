import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const FeatureContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  py: 10,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  color: 'white',
}));

const features = [
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    title: 'Best Rates',
    description: 'Our aggregator scans multiple DEXs to find you the optimal swap rates, saving you money on every trade.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Secure Trading',
    description: 'Non-custodial trading with your MetaMask wallet. Your keys, your crypto, your control.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Lightning Fast',
    description: 'Execute swaps in seconds with our optimized routing algorithms and minimal slippage.',
  },
  {
    icon: <SwapHorizIcon sx={{ fontSize: 40 }} />,
    title: 'Multi-DEX Access',
    description: 'Access liquidity from Uniswap, SushiSwap, 1inch, and 150+ other decentralized exchanges.',
  },
];

export const FeatureSection: React.FC = () => {
  return (
    <FeatureContainer>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'center', 
            mb: 2,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Why Choose Savia?
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            mb: 6, 
            color: 'text.secondary',
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Experience the future of decentralized trading with our advanced aggregation technology
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <FeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <IconWrapper>
                    {feature.icon}
                  </IconWrapper>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      textAlign: 'center',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      textAlign: 'center',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </FeatureContainer>
  );
};