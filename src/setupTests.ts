import '@testing-library/jest-dom';

// Mock MirageJS server for tests
jest.mock('./mirage/server', () => ({
  makeServer: jest.fn(),
}));

// Mock environment variables
process.env.API_BASE_URL = 'http://localhost:3000/api';
process.env.APP_VERSION = '1.0.0';