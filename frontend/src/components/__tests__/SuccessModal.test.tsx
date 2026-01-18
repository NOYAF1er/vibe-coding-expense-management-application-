import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SuccessModal } from '../SuccessModal';

describe('SuccessModal', () => {
  it('should not render when isOpen is false', () => {
    const onClose = vi.fn();
    const { container } = render(
      <SuccessModal isOpen={false} onClose={onClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true with default props', () => {
    const onClose = vi.fn();
    render(<SuccessModal isOpen={true} onClose={onClose} />);
    
    expect(screen.getByText('Submitted Successfully')).toBeInTheDocument();
    expect(screen.getByText('Your expense report has been created and is now pending review.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });

  it('should render with custom title', () => {
    const onClose = vi.fn();
    render(
      <SuccessModal 
        isOpen={true} 
        onClose={onClose}
        title="Custom Title"
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    const onClose = vi.fn();
    render(
      <SuccessModal 
        isOpen={true} 
        onClose={onClose}
        message="Custom message text"
      />
    );
    
    expect(screen.getByText('Custom message text')).toBeInTheDocument();
  });

  it('should render with custom button label', () => {
    const onClose = vi.fn();
    render(
      <SuccessModal 
        isOpen={true} 
        onClose={onClose}
        buttonLabel="Custom Button"
      />
    );
    
    expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument();
  });

  it('should call onClose when button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SuccessModal isOpen={true} onClose={onClose} />);
    
    const button = screen.getByRole('button', { name: 'Done' });
    await user.click(button);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render success icon', () => {
    const onClose = vi.fn();
    render(<SuccessModal isOpen={true} onClose={onClose} />);
    
    // Check for the SVG checkmark icon
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-12', 'w-12', 'text-white');
  });

  it('should have correct styling classes for pixel-perfect rendering', () => {
    const onClose = vi.fn();
    const { container } = render(<SuccessModal isOpen={true} onClose={onClose} />);
    
    // Check overlay
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('absolute', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50');
    
    // Check modal container
    const modal = overlay.querySelector('div > div');
    expect(modal).toHaveClass('bg-background-light', 'dark:bg-background-dark', 'rounded-xl', 'shadow-lg', 'p-8', 'w-11/12', 'max-w-sm', 'text-center');
    
    // Check button
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full', 'bg-primary', 'text-white', 'font-bold', 'h-14', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'transition-opacity', 'hover:opacity-90');
  });

  it('should render for expense report creation scenario', () => {
    const onClose = vi.fn();
    render(
      <SuccessModal 
        isOpen={true} 
        onClose={onClose}
        title="Submitted Successfully"
        message="Your expense report has been created and is now pending review."
        buttonLabel="Done"
      />
    );
    
    expect(screen.getByText('Submitted Successfully')).toBeInTheDocument();
    expect(screen.getByText('Your expense report has been created and is now pending review.')).toBeInTheDocument();
  });

  it('should render for expense creation scenario', () => {
    const onClose = vi.fn();
    render(
      <SuccessModal 
        isOpen={true} 
        onClose={onClose}
        title="Created Successfully"
        message="Your expense has been created successfully."
        buttonLabel="Done"
      />
    );
    
    expect(screen.getByText('Created Successfully')).toBeInTheDocument();
    expect(screen.getByText('Your expense has been created successfully.')).toBeInTheDocument();
  });

  it('should render for expense update scenario', () => {
    const onClose = vi.fn();
    render(
      <SuccessModal 
        isOpen={true} 
        onClose={onClose}
        title="Updated Successfully"
        message="Your expense has been updated successfully."
        buttonLabel="Done"
      />
    );
    
    expect(screen.getByText('Updated Successfully')).toBeInTheDocument();
    expect(screen.getByText('Your expense has been updated successfully.')).toBeInTheDocument();
  });
});
