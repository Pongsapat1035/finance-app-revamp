// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TransactionType } from '#/enum/enum'
import TransactionTable from './TransactionTable'

afterEach(cleanup)

describe('TransactionTable', () => {
  it('forwards edit and delete menu actions with the selected transaction', async () => {
    const transaction = {
      id: 41,
      type: TransactionType.EXPEND,
      amount: 42.5,
      date: '2026-08-05',
      description: 'Train ticket',
      categoryId: 9,
      categoryTitle: 'Transportation',
    }
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <TransactionTable
        transactions={[transaction]}
        page={1}
        onPageChange={vi.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={vi.fn()}
      />,
    )

    const actionTriggers = screen.getAllByRole('button', { name: 'Actions for Train ticket' })

    fireEvent.pointerDown(actionTriggers[0], { button: 0, ctrlKey: false })
    fireEvent.click(await screen.findByText('Edit transaction'))
    expect(onEdit).toHaveBeenCalledWith(transaction)

    fireEvent.pointerDown(actionTriggers[0], { button: 0, ctrlKey: false })
    fireEvent.click(await screen.findByText('Delete transaction'))
    expect(onDelete).toHaveBeenCalledWith(transaction)
  })

  it('shows a focused empty state that can start a transaction', () => {
    const onAdd = vi.fn()

    render(
      <TransactionTable
        transactions={[]}
        page={1}
        onPageChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAdd={onAdd}
      />,
    )

    expect(screen.getByRole('heading', { name: 'No transactions yet' })).toBeTruthy()
    expect(screen.queryByPlaceholderText('Search name or category')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Add transaction' }))
    expect(onAdd).toHaveBeenCalledOnce()
  })
})
