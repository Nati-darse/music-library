import React from 'react';
import styled from '@emotion/styled';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const PageButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  background: ${props => props.active ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border: 2px solid ${props => props.active ? 'transparent' : '#e2e8f0'};
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    background: ${props => props.active ? 'linear-gradient(45deg, #1d4ed8, #3b82f6)' : '#f8fafc'};
    border-color: ${props => props.active ? 'transparent' : '#cbd5e1'};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const NavButton = styled(PageButton)`
  width: auto;
  padding: 0 1rem;
  gap: 0.5rem;
`;

const PageInfo = styled.span`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 1rem;
  white-space: nowrap;
`;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Container>
      <NavButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
      >
        <FaChevronLeft />
        Previous
      </NavButton>

      {getVisiblePages().map((page, index) => (
        <PageButton
          key={index}
          active={page === currentPage}
          disabled={page === '...'}
          onClick={() => typeof page === 'number' && onPageChange(page)}
        >
          {page}
        </PageButton>
      ))}

      <NavButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
      >
        Next
        <FaChevronRight />
      </NavButton>

      <PageInfo>
        Page {currentPage} of {totalPages}
      </PageInfo>
    </Container>
  );
};

export default Pagination;