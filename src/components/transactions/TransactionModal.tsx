import { useEffect, useState } from 'react'
import TransactionForm, {
  type TransactionFormValues,
  type TransactionType,
  TYPE_TO_API_TYPE,
} from '#/components/transactions/TransactionForm'
import CategoryManager from '#/components/transactions/CategoryManager'
import BaseModal, { BaseModalContent } from '#/components/ui/BaseModal'
import type { Category as ApiCategory } from '#/api/category/category.type'
import type {
  CreateTransactionDto,
  NormalizedTransaction,
} from '#/api/transaction/transaction.type'
import { TransactionType as ApiTransactionType } from '#/enum/enum'
import { useCreateTransaction, useUpdateTransaction } from '#/hooks/useTransaction'
import { handleAxiosError } from '#/lib/handleAxiosError'

type ModalView = 'transaction' | 'categories'

interface TransactionModalProps {
  open: boolean
  onClose: () => void
  categories?: ApiCategory[]
  categoriesLoading?: boolean
  categoriesError?: string
  onSearchCategories?: (keyword: string) => void
  onRetryCategories?: () => void
  transaction?: NormalizedTransaction | null
  onSuccess?: (mode: 'create' | 'edit') => void
}

const TransactionModal = ({
  open,
  onClose,
  categories,
  categoriesLoading = false,
  categoriesError,
  onSearchCategories,
  onRetryCategories,
  transaction,
  onSuccess,
}: TransactionModalProps) => {
  const [view, setView] = useState<ModalView>('transaction')
  const [type, setType] = useState<TransactionType>('expense')
  const [submitError, setSubmitError] = useState<string>()
  const createTransaction = useCreateTransaction()
  const updateTransaction = useUpdateTransaction()
  const mode = transaction ? 'edit' : 'create'
  const isSubmitting = createTransaction.isPending || updateTransaction.isPending

  useEffect(() => {
    if (!open) return

    setView('transaction')
    setType(transaction?.type === ApiTransactionType.INCOME ? 'income' : 'expense')
    setSubmitError(undefined)
  }, [open, transaction])

  const handleClose = () => {
    if (!isSubmitting) onClose()
  }

  const handleSubmit = async (value: TransactionFormValues) => {
    const payload: CreateTransactionDto = {
      categoryId: Number(value.categoryId),
      type: TYPE_TO_API_TYPE[type],
      amount: Number(value.amount),
      description: value.description,
      date: value.date,
    }

    setSubmitError(undefined)

    try {
      if (transaction) {
        await updateTransaction.mutateAsync({ id: transaction.id, payload })
      } else {
        await createTransaction.mutateAsync(payload)
      }

      onClose()
      onSuccess?.(mode)
    } catch (error) {
      const { message, statusCode } = handleAxiosError(error)
      setSubmitError(
        statusCode === null
          ? `Could not ${mode === 'edit' ? 'update' : 'create'} the transaction. Try again.`
          : `${message}. Review the details and try again.`,
      )
    }
  }

  const initialValues: TransactionFormValues | undefined = transaction
    ? {
        amount: String(transaction.amount),
        categoryId: String(transaction.categoryId),
        date: transaction.date,
        description: transaction.description,
      }
    : undefined

  return (
    <BaseModal
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose()
      }}
    >
      <BaseModalContent
        scrollable={false}
        showCloseButton={false}
        aria-labelledby="transaction-dialog-title"
      >
        {view === 'transaction' ? (
          <TransactionForm
            key={`${mode}-${transaction?.id ?? 'new'}`}
            type={type}
            setType={setType}
            categories={categories ?? []}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            onCategorySearch={onSearchCategories}
            onManageCategories={() => setView('categories')}
            onClose={handleClose}
            onSubmit={handleSubmit}
            mode={mode}
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        ) : (
          <CategoryManager
            categories={categories ?? []}
            isLoading={categoriesLoading}
            error={categoriesError}
            onRetry={onRetryCategories}
            transactionType={TYPE_TO_API_TYPE[type]}
            onBack={() => setView('transaction')}
            onClose={handleClose}
          />
        )}
      </BaseModalContent>
    </BaseModal>
  )
}

export default TransactionModal
