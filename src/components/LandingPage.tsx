import React from 'react';
import { Box } from '@mui/material';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeatureSection } from './FeatureSection';
import { StatsSection } from './StatsSection';
import { CTASection } from './CTASection';

interface LandingPageProps {
  account: string | null;
  onConnect: () => void;
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  account, 
  onConnect, 
  onGetStarted 
}) => {
  return (
    <Box>
      <Navbar account={account} onConnect={onConnect} />
      <HeroSection />
      <FeatureSection />
      <StatsSection />
      <CTASection onGetStarted={onGetStarted} />
    </Box>
  );
};