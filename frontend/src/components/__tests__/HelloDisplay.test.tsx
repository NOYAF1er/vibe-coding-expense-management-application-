import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelloDisplay } from '../HelloDisplay';
import { HelloResponse } from '@shared/hello.types';

describe('HelloDisplay', () => {
  const mockData: HelloResponse = {
    id: 1,
    message: 'Hello from NestJS!',
    timestamp: new Date('2026-01-13T15:45:00.000Z'),
  };

  it('should render hello message', () => {
    render(<HelloDisplay data={mockData} />);
    expect(screen.getByText('Hello from NestJS!')).toBeInTheDocument();
  });

  it('should display ID', () => {
    render(<HelloDisplay data={mockData} />);
    const idText = screen.getByText(/ID:/);
    expect(idText).toBeInTheDocument();
    expect(idText.parentElement).toHaveTextContent('ID: 1');
  });

  it('should display timestamp', () => {
    render(<HelloDisplay data={mockData} />);
    expect(screen.getByText(/Timestamp:/)).toBeInTheDocument();
  });

  it('should show connected status', () => {
    render(<HelloDisplay data={mockData} />);
    expect(screen.getByText('Connected to backend')).toBeInTheDocument();
  });
});
