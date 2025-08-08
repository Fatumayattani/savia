import React from 'react';
import { Box } from '@mui/material';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { StatsSection } from './StatsSection';
import { CTASection } from './CTASection';

interface LandingPageProps {
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  onConnect: () => Promise<void>;
  onSwitchNetwork: () => Promise<void>;
  onDisconnect: () => void;
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  account, 
  chainId,
  isConnecting,
  onConnect,
  onSwitchNetwork,
  onDisconnect,
  onGetStarted 
}) => {
  return (
    <Box>
      <Navbar 
        account={account} 
        chainId={chainId}
        isConnecting={isConnecting}
        onConnect={onConnect}
        onSwitchNetwork={onSwitchNetwork}
        onDisconnect={onDisconnect}
      />
      <HeroSection />
      <StatsSection />
      <CTASection onGetStarted={onGetStarted} />
    </Box>
  );
};