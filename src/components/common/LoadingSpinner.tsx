import React from 'react';
import styled from '@emotion/styled';
import { FaMusic } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: #64748b;
`;

const Spinner = styled.div`
  position: relative;
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
`;

const SpinnerIcon = styled(FaMusic)`
  font-size: 2rem;
  color: #3b82f6;
  animation: spin 2s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @keyframes spin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const SpinnerRing = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  color: #64748b;
`;

const LoadingSpinner: React.FC = () => {
  return (
    <Container>
      <Spinner>
        <SpinnerRing />
        <SpinnerIcon />
      </Spinner>
      <LoadingText>Loading your music...</LoadingText>
    </Container>
  );
};

export default LoadingSpinner;