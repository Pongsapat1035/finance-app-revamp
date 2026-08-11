import { useEffect, useState } from 'react'
import TransactionForm, {
  type TransactionFormValues,
  type TransactionType,
  TYPE_TO_API_TYPE,
} from '#/components/transactions/TransactionForm'
import CategoryManager from '#/components/transactions/CategoryManager'
import BaseModal, { BaseModalContent } from '#/components/ui/BaseModal'
import type { Category as ApiCategory } from '#/api/category/category.type'
import type { CreateTransactionDto } from '#/api/transaction/transaction.type'
import { useCreateTransaction } from '#/hooks/useTransaction'

type ModalView = 'transaction' | 'categories'

interface TransactionModalProps {
  open: boolean
  onClose: () => void
  categories?: ApiCategory[]
}

const TransactionModal = ({ open, onClose, categories }: TransactionModalProps) => {
  const [view, setView] = useState<ModalView>('transaction')
  const [type, setType] = useState<TransactionType>('expense')
  const [manageCategories, setManageCategories] = useState<ApiCategory[]>(categories ?? [])
  const { mutateAsync } = useCreateTransaction()

  useEffect(() => {
    setManageCategories(categories ?? [])
  }, [categories])

  const handleSubmit = async (value: TransactionFormValues) => {
    const payload: CreateTransactionDto = {
      categoryId: Number(value.categoryId),
      type: TYPE_TO_API_TYPE[type],
      amount: Number(value.amount),
      description: value.description,
      date: value.date,
    }

    await mutateAsync(payload)
    onClose()
  }

  return (
    <BaseModal open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <BaseModalContent showCloseButton={false} aria-labelledby="transaction-dialog-title">
        {view === 'transaction' ? (
          <TransactionForm
            type={type}
            setType={setType}
            categories={manageCategories}
            onManageCategories={() => setView('categories')}
            onClose={onClose}
            onSubmit={handleSubmit}
          />
        ) : (
          <CategoryManager
            categories={manageCategories}
            setCategories={setManageCategories}
            transactionType={TYPE_TO_API_TYPE[type]}
            onBack={() => setView('transaction')}
            onClose={onClose}
          />
        )}
      </BaseModalContent>
    </BaseModal>
  )
}

export default TransactionModal
