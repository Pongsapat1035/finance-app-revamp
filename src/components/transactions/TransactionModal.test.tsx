// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TransactionType } from '#/enum/enum'
import TransactionModal from './TransactionModal'

const mutationMocks = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
}))

vi.mock('#/hooks/useTransaction', () => ({
  useCreateTransaction: () => ({ mutateAsync: mutationMocks.create, isPending: false }),
  useUpdateTransaction: () => ({ mutateAsync: mutationMocks.update, isPending: false }),
}))

describe('TransactionModal', () => {
  it('prefills an existing transaction and submits an update payload', async () => {
    mutationMocks.update.mockResolvedValueOnce(undefined)
    const onClose = vi.fn()
    const onSuccess = vi.fn()

    render(
      <TransactionModal
        open
        onClose={onClose}
        onSuccess={onSuccess}
        categories={[
          {
            id: 9,
            userId: 3,
            title: 'Transportation',
            type: TransactionType.EXPEND,
            color: '#3567B7',
            createdAt: '2026-08-01T00:00:00.000Z',
            updatedAt: '2026-08-01T00:00:00.000Z',
          },
        ]}
        transaction={{
          id: 41,
          type: TransactionType.EXPEND,
          amount: 42.5,
          date: '2026-08-05',
          description: 'Train ticket',
          categoryId: 9,
          categoryTitle: 'Transportation',
        }}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Edit transaction' })).toBeTruthy()
    expect((screen.getByLabelText('Amount') as HTMLInputElement).value).toBe('42.5')
    expect((screen.getByLabelText('Transaction date') as HTMLInputElement).value).toBe('2026-08-05')
    expect((screen.getByLabelText('Description (optional)') as HTMLInputElement).value).toBe(
      'Train ticket',
    )
    expect(screen.getByRole('combobox', { name: 'Category' }).textContent).toContain(
      'Transportation',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => {
      expect(mutationMocks.update).toHaveBeenCalledWith({
        id: 41,
        payload: {
          categoryId: 9,
          type: TransactionType.EXPEND,
          amount: 42.5,
          description: 'Train ticket',
          date: '2026-08-05',
        },
      })
    })
    expect(onClose).toHaveBeenCalledOnce()
    expect(onSuccess).toHaveBeenCalledWith('edit')
  })
})
