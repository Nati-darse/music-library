import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { FaTimes, FaMusic, FaSave } from 'react-icons/fa';
import { RootState } from '@store/index';
import { closeModal, createSongRequest, updateSongRequest, clearError } from '@store/slices/songsSlice';
import { CreateSongRequest } from '@types/song';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #1a202c;
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  border: 1px solid #fecaca;
`;

const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(45deg, #3b82f6, #1d4ed8);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  ` : `
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #f1f5f9;
      color: #1a202c;
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

const genres = [
  'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'Country', 
  'R&B', 'Folk', 'Blues', 'Reggae', 'Metal', 'Punk', 'Alternative', 'Other'
];

const SongModal: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedSong, modalMode, loading, error } = useSelector((state: RootState) => state.songs);

  const [formData, setFormData] = useState<CreateSongRequest>({
    title: '',
    artist: '',
    album: '',
    year: new Date().getFullYear(),
    genre: '',
    duration: 0,
  });

  useEffect(() => {
    if (selectedSong && modalMode === 'edit') {
      setFormData({
        title: selectedSong.title,
        artist: selectedSong.artist,
        album: selectedSong.album,
        year: selectedSong.year,
        genre: selectedSong.genre,
        duration: selectedSong.duration,
      });
    }
  }, [selectedSong, modalMode]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      dispatch(createSongRequest(formData));
    } else if (modalMode === 'edit' && selectedSong) {
      dispatch(updateSongRequest({ ...formData, id: selectedSong.id }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'duration' ? parseInt(value) || 0 : value,
    }));
  };

  const formatDurationInput = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const parseDurationInput = (value: string): number => {
    const parts = value.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      return minutes * 60 + seconds;
    }
    return parseInt(value) || 0;
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseDurationInput(e.target.value);
    setFormData(prev => ({ ...prev, duration }));
  };

  const isFormValid = formData.title && formData.artist && formData.album && formData.genre;

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FaMusic />
            {modalMode === 'create' ? 'Add New Song' : 'Edit Song'}
          </Title>
          <CloseButton onClick={handleClose}>
            <FaTimes />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="title">Song Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter song title"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="artist">Artist *</Label>
            <Input
              id="artist"
              name="artist"
              type="text"
              value={formData.artist}
              onChange={handleChange}
              placeholder="Enter artist name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="album">Album *</Label>
            <Input
              id="album"
              name="album"
              type="text"
              value={formData.album}
              onChange={handleChange}
              placeholder="Enter album name"
              required
            />
          </FormGroup>

          <Row>
            <FormGroup>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="duration">Duration (MM:SS)</Label>
              <Input
                id="duration"
                name="duration"
                type="text"
                value={formatDurationInput(formData.duration)}
                onChange={handleDurationChange}
                placeholder="3:45"
              />
            </FormGroup>
          </Row>

          <FormGroup>
            <Label htmlFor="genre">Genre *</Label>
            <Select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            >
              <option value="">Select a genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </Select>
          </FormGroup>
        </Form>

        <Footer>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
          >
            <FaSave />
            {loading ? 'Saving...' : modalMode === 'create' ? 'Add Song' : 'Update Song'}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default SongModal;