import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { FaPlus, FaMusic, FaSearch, FaTimes } from 'react-icons/fa';
import { RootState } from '@store/index';
import { fetchSongsRequest, openModal } from '@store/slices/songsSlice';
import SongCard from './SongCard';
import SongModal from './SongModal';
import Pagination from '@components/common/Pagination';
import LoadingSpinner from '@components/common/LoadingSpinner';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #718096;
  margin-bottom: 2rem;
`;

const Controls = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  font-size: 1rem;
  background: white;
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

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 1rem;
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: #718096;
    background: #f7fafc;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SongsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
  max-width: 1200px;
  margin: 0 auto;
`;

const EmptyIcon = styled(FaMusic)`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const SongList: React.FC = () => {
  const dispatch = useDispatch();
  const { songs, pagination, loading, error, isModalOpen } = useSelector((state: RootState) => state.songs);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchSongsRequest({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleAddSong = () => {
    dispatch(openModal({ mode: 'create' }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.album.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && songs.length === 0) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FaMusic />
          My Music Library
        </Title>
        <Subtitle>
          Discover and manage your favorite songs
        </Subtitle>
      </Header>

      <Controls>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search songs, artists, albums, or genres..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <ClearSearchButton onClick={handleClearSearch}>
              <FaTimes />
            </ClearSearchButton>
          )}
        </SearchContainer>
        
        <AddButton onClick={handleAddSong}>
          <FaPlus />
          Add New Song
        </AddButton>
      </Controls>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {filteredSongs.length === 0 && !loading ? (
        <EmptyState>
          <EmptyIcon />
          <EmptyTitle>
            {searchTerm ? 'No songs found' : 'No songs in your library'}
          </EmptyTitle>
          <EmptyDescription>
            {searchTerm 
              ? `No songs match "${searchTerm}". Try a different search term.`
              : 'Start building your music collection by adding your first song!'
            }
          </EmptyDescription>
          {!searchTerm && (
            <AddButton onClick={handleAddSong}>
              <FaPlus />
              Add Your First Song
            </AddButton>
          )}
        </EmptyState>
      ) : (
        <>
          <SongsGrid>
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </SongsGrid>

          {pagination && !searchTerm && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
            />
          )}
        </>
      )}

      {isModalOpen && <SongModal />}
    </Container>
  );
};

export default SongList;