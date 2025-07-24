import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { FaMusic, FaPlay } from 'react-icons/fa';
import SongList from '@components/songs/SongList';
import { theme } from '@theme/index';

const GlobalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
  }

  #root {
    min-height: 100vh;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const WelcomeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
`;

const MusicIcon = styled(FaMusic)`
  font-size: 4rem;
  margin-bottom: 2rem;
  animation: pulse 2s infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const EnterButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
    background: linear-gradient(45deg, #ee5a24, #ff6b6b);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MainContent = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleEnterApp = () => {
    setShowWelcome(false);
  };

  return (
    <AppContainer>
      <Global styles={GlobalStyles} />
      
      {showWelcome ? (
        <WelcomeSection>
          <WelcomeContent>
            <MusicIcon />
            <WelcomeTitle>Music Library</WelcomeTitle>
            <WelcomeSubtitle>
              Discover, organize, and manage your favorite songs in one beautiful place. 
              Create your personal music collection with our intuitive interface.
            </WelcomeSubtitle>
            <EnterButton onClick={handleEnterApp}>
              <FaPlay />
              Enter Music Library
            </EnterButton>
          </WelcomeContent>
        </WelcomeSection>
      ) : (
        <MainContent>
          <SongList />
        </MainContent>
      )}
    </AppContainer>
  );
};

export default App;