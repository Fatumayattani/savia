import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';

const StatsContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  color: 'white',
  py: 8,
}));

const StatCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '3rem',
  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(1),
}));

const stats = [
  { number: 2.5, suffix: 'B+', label: 'Total Volume Traded', prefix: '$' },
  { number: 150, suffix: '+', label: 'DEXs Integrated' },
  { number: 50, suffix: 'K+', label: 'Active Users' },
  { number: 99.9, suffix: '%', label: 'Uptime' },
];

export const StatsSection: React.FC = () => {
  return (
    <StatsContainer>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'center', 
            mb: 6, 
            fontWeight: 800,
            color: 'white',
          }}
        >
          Trusted by DeFi Traders Worldwide
        </Typography>
        
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index} component="div">
              <StatCard>
                <StatNumber>
                  {stat.prefix}
                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    delay={index * 0.2}
                    decimals={stat.number % 1 !== 0 ? 1 : 0}
                  />
                  {stat.suffix}
                </StatNumber>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {stat.label}
                </Typography>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </StatsContainer>
  );
};