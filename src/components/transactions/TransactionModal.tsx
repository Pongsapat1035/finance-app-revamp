import { useEffect, useState } from 'react'
import TransactionForm, {
  type TransactionType,
  TYPE_TO_API_TYPE,
} from '#/components/transactions/TransactionForm'
import CategoryManager from '#/components/transactions/CategoryManager'
import BaseModal, { BaseModalContent } from '#/components/ui/BaseModal'
import type { Category as ApiCategory } from '#/api/category/category.type'

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

  useEffect(() => {
    setManageCategories(categories ?? [])
  }, [categories])
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
