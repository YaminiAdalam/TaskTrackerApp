import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => 'task-1')
  });
});

describe('Task Tracker', () => {
  it('adds a task', async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText(/new task/i), 'Run production build');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(screen.getByText('Run production build')).toBeInTheDocument();
  });

  it('marks a task as complete', async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText(/new task/i), 'Write release notes');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
    await userEvent.click(screen.getByRole('checkbox', { name: /write release notes/i }));

    expect(screen.getByText(/1/)).toBeInTheDocument();
    expect(screen.getByText('Write release notes')).toHaveStyle({
      textDecoration: 'line-through'
    });
  });

  it('deletes a task', async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText(/new task/i), 'Create release artifact');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(screen.queryByText('Create release artifact')).not.toBeInTheDocument();
  });
});
