import React from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { FaPlay, FaEdit, FaTrash, FaClock, FaCalendar, FaCompactDisc } from 'react-icons/fa';
import { Song } from '@types/song';
import { openModal, deleteSongRequest } from '@store/slices/songsSlice';

interface SongCardProps {
  song: Song;
}

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PlayButton = styled.button`
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  background: ${props => 
    props.variant === 'delete' 
      ? 'linear-gradient(45deg, #ef4444, #dc2626)' 
      : 'linear-gradient(45deg, #f59e0b, #d97706)'
  };
  color: white;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => 
      props.variant === 'delete' 
        ? 'rgba(239, 68, 68, 0.3)' 
        : 'rgba(245, 158, 11, 0.3)'
    };
  }

  &:active {
    transform: translateY(0);
  }
`;

const Content = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const Artist = styled.p`
  font-size: 1rem;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Album = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Genre = styled.span`
  display: inline-block;
  background: linear-gradient(45deg, #e0e7ff, #c7d2fe);
  color: #3730a3;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #64748b;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const dispatch = useDispatch();

  const handlePlay = () => {
    // In a real app, this would trigger audio playback
    console.log(`Playing: ${song.title} by ${song.artist}`);
  };

  const handleEdit = () => {
    dispatch(openModal({ mode: 'edit', song }));
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
      dispatch(deleteSongRequest(song.id));
    }
  };

  return (
    <Card>
      <Header>
        <PlayButton onClick={handlePlay}>
          <FaPlay />
        </PlayButton>
        <Actions>
          <ActionButton onClick={handleEdit}>
            <FaEdit />
          </ActionButton>
          <ActionButton variant="delete" onClick={handleDelete}>
            <FaTrash />
          </ActionButton>
        </Actions>
      </Header>

      <Content>
        <Title>{song.title}</Title>
        <Artist>{song.artist}</Artist>
        <Album>
          <FaCompactDisc />
          {song.album}
        </Album>
        <Genre>{song.genre}</Genre>
      </Content>

      <Footer>
        <FooterItem>
          <FaClock />
          {formatDuration(song.duration)}
        </FooterItem>
        <FooterItem>
          <FaCalendar />
          {song.year}
        </FooterItem>
      </Footer>
    </Card>
  );
};

export default SongCard;