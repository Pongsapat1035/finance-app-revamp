// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DatePickerField from '../DatePicker'

describe('DatePickerField', () => {
  it('shows the current value and returns a selected date in API format', () => {
    const onValueChange = vi.fn()

    render(
      <DatePickerField
        id="statement-date"
        label="Statement date"
        value="2026-09-16"
        onValueChange={onValueChange}
      />,
    )

    fireEvent.click(screen.getByLabelText('Statement date'))

    expect(screen.getByRole('grid', { name: /September 2026/i })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /September 17/i }))
    expect(onValueChange).toHaveBeenCalledWith('2026-09-17')
  })
})
