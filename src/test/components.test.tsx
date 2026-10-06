import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { LeadScoreCard } from '@/components/LeadScoreCard';
import ChatPage from '@/app/chat/page';

describe('Component Testing Suite (UI & Tool Lifecycle)', () => {
  const mockToolResult = {
    score: 85,
    tier: 'Tier 1 (High Intent)',
    estimatedBudget: '$25,000',
    urgency: 'immediate',
    recommendation: 'Schedule priority technical discovery call.',
  };

  // Test 1: Tool Bileşeni Doğru Role ve Verilerle Render Ediliyor mu?
  it('renders LeadScoreCard component with accessible roles and correct metrics', () => {
    render(<LeadScoreCard result={mockToolResult} />);

    expect(screen.getByRole('article', { name: /lead scorecard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /lead qualification scorecard/i })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /qualification tier/i })).toHaveTextContent('Tier 1 (High Intent)');
    expect(screen.getByText('$25,000')).toBeInTheDocument();
  });

  // Test 2: Progress Bar Değeri Doğru mu?
  it('renders progress bar with proper aria attributes', () => {
    render(<LeadScoreCard result={mockToolResult} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '85');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  // Test 3: Form Input ve Submit Butonu Rolüyle Bulunuyor mu?
  it('renders chat input and submit button with accessible controls', () => {
    render(<ChatPage />);

    const input = screen.getByPlaceholderText(/qualification inquiry|budget/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  // Test 4: Boş Metin Gönderimi Engelleniyor mu? (Form Doğrulama)
  it('disables or blocks submission when input is empty', () => {
    render(<ChatPage />);
    const submitButton = screen.getByRole('button', { name: /send/i });
    expect(submitButton).toBeDisabled();
  });

  // Test 5: Kullanıcı Yazı Yazdığında Buton Aktif Oluyor mu?
  it('enables send button upon typing in the input field', async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const input = screen.getByPlaceholderText(/qualification inquiry|budget/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    await user.type(input, 'We have a $20,000 project');
    expect(submitButton).toBeEnabled();
  });

  // Test 6: Sabotaj/Tool Error Durumu Çökmeyi Engelleyip Hata Kartını Gösteriyor mu?
  it('displays designed error card when tool execution encounters an exception', async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const errorTrigger = screen.getByRole('button', { name: /trigger tool error/i });
    await user.click(errorTrigger);

    const errorMessage = await screen.findByText(/Tool Execution Exception/i);
    expect(errorMessage).toBeInTheDocument();
  });
});