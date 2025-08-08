import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.95)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: 'white',
}));

const features = [
  {
    icon: <SwapHorizIcon sx={{ fontSize: 32 }} />,
    title: 'Smart Aggregation',
    description: 'Get the best rates by comparing prices across multiple DEXs in real-time.',
  },
  {
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 32 }} />,
    title: 'Wallet Integration',
    description: 'Seamlessly connect with MetaMask and other popular wallets for secure trading.',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
    title: 'Optimal Routes',
    description: 'Advanced routing algorithms find the most efficient swap paths to maximize your returns.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32 }} />,
    title: 'Secure & Trustless',
    description: 'Non-custodial trading with smart contract security and transparent operations.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 32 }} />,
    title: 'Lightning Fast',
    description: 'Execute swaps quickly with optimized gas usage and minimal slippage.',
  },
  {
    icon: <NetworkCheckIcon sx={{ fontSize: 32 }} />,
    title: 'Multi-Chain',
    description: 'Support for Ethereum, BSC, Polygon, and other major blockchain networks.',
  },
];

export const FeatureSection: React.FC = () => {
  return (
    <Box sx={{ py: 12, background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
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
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Experience the future of decentralized trading with our cutting-edge aggregation technology
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index} component="div">
              <FeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <IconWrapper>
                    {feature.icon}
                  </IconWrapper>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};