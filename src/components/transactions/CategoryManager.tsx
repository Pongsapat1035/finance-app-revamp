import { useMemo, useState } from 'react'
import { ArrowLeft, Check, CircleAlert, Pencil, Plus, Tags, Trash2, X } from 'lucide-react'
import SegmentedTab from '#/components/ui/SegmentedTab'
import Button from '#/components/ui/Button'
import IconButton from '#/components/ui/IconButton'
import InputField from '#/components/ui/InputField'
import { BaseModalBody, BaseModalFooter, BaseModalHeader } from '#/components/ui/BaseModal'
import type { Category } from '#/api/category/category.type'
import { TransactionType } from '#/enum/enum'
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from '#/hooks/useCategory'
import { handleAxiosError } from '#/lib/handleAxiosError'

const CATEGORY_TABS = [
  { label: 'Expense categories', value: TransactionType.EXPEND },
  { label: 'Income categories', value: TransactionType.INCOME },
]

const TYPE_LABEL: Record<TransactionType, string> = {
  [TransactionType.EXPEND]: 'expense',
  [TransactionType.INCOME]: 'income',
  [TransactionType.INVESTMENT]: 'investment',
}

const DEFAULT_COLOR = '#94a3b8'

interface CategoryManagerProps {
  categories: Category[]
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  transactionType: TransactionType
  onBack: () => void
  onClose: () => void
}

const CategoryManager = ({
  categories,
  isLoading = false,
  error,
  onRetry,
  transactionType,
  onBack,
  onClose,
}: CategoryManagerProps) => {
  const [activeType, setActiveType] = useState<TransactionType>(transactionType)
  const [newCategory, setNewCategory] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string>()
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutateAsync: updateCategory, isPending: isSaving } = useUpdateCategory()
  const { mutateAsync: removeCategory, isPending: isRemoving } = useDeleteCategory()

  const filtered = useMemo(
    () => categories.filter((category) => category.type === activeType),
    [activeType, categories],
  )

  const getActionError = (action: 'create' | 'rename' | 'delete', error: unknown) => {
    const { message, statusCode } = handleAxiosError(error)
    if (statusCode === null) {
      return `Could not ${action} the category. Check your connection and try again.`
    }

    return `${message}. Try again.`
  }

  const addCategory = async () => {
    const title = newCategory.trim()
    if (!title || isLoading || error) return

    setActionError(undefined)

    try {
      await createCategory({ title, type: activeType, color: DEFAULT_COLOR })
      setNewCategory('')
    } catch (createError) {
      setActionError(getActionError('create', createError))
    }
  }

  const saveEdit = async (id: number) => {
    const title = editingName.trim()
    const category = categories.find((item) => item.id === id)
    if (!title || !category) return

    setActionError(undefined)

    try {
      await updateCategory({ id, payload: { title, type: category.type, color: category.color } })
      setEditingId(null)
      setEditingName('')
    } catch (updateError) {
      setActionError(getActionError('rename', updateError))
    }
  }

  const deleteCategory = async (id: number) => {
    setActionError(undefined)

    try {
      await removeCategory(id)
      setDeletingId(null)
    } catch (deleteError) {
      setActionError(getActionError('delete', deleteError))
    }
  }

  return (
    <>
      <BaseModalHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <IconButton onClick={onBack} className="-mt-1" aria-label="Back to transaction">
              <ArrowLeft size={17} />
            </IconButton>
            <div>
              <h2 id="transaction-dialog-title" className="text-xl font-medium tracking-tight">
                Manage categories
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Create, rename, or remove your categories.
              </p>
            </div>
          </div>
          <IconButton onClick={onClose} aria-label="Close dialog">
            <X size={17} />
          </IconButton>
        </div>
      </BaseModalHeader>

      <BaseModalBody>
        <SegmentedTab
          tabs={CATEGORY_TABS}
          active={activeType}
          onChange={(type) => {
            setActiveType(type)
            setEditingId(null)
            setDeletingId(null)
            setActionError(undefined)
          }}
          ariaLabel="Category type"
        />

        <div className="mt-5 flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <InputField
              id="new-category"
              label="New category name"
              hideLabel
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') addCategory()
              }}
              placeholder={`New ${TYPE_LABEL[activeType]} category`}
              disabled={isLoading || Boolean(error) || isCreating}
            />
          </div>
          <Button
            variant="dark"
            height="h-11"
            padding="px-3.5"
            fullWidth={false}
            onClick={addCategory}
            disabled={isLoading || Boolean(error) || isCreating}
            prefixIcon={<Plus size={15} />}
          >
            Add
          </Button>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-[12px] leading-5 text-destructive-text"
          >
            <CircleAlert size={15} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        <div className="mt-5 max-h-88 overflow-y-auto rounded-lg border" aria-busy={isLoading}>
          {isLoading ? (
            <div className="divide-y" aria-label="Loading categories">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex items-center gap-3 p-3">
                  <span className="size-8 shrink-0 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
                  <span className="h-4 w-32 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="px-5 py-10 text-center">
              <CircleAlert className="mx-auto text-destructive-text" size={22} strokeWidth={1.5} />
              <p className="mt-3 text-sm font-medium">Could not load categories</p>
              <p className="mt-1 text-xs text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                height="h-9"
                padding="px-3"
                fullWidth={false}
                className="mt-4"
                onClick={onRetry}
              >
                Retry
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Tags className="mx-auto text-muted-foreground" size={22} strokeWidth={1.5} />
              <p className="mt-3 text-sm font-medium">No categories yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add a category to organize transactions.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((category) => {
                const isEditing = editingId === category.id
                const isDeleting = deletingId === category.id
                return (
                  <div key={category.id} className="p-3">
                    {isDeleting ? (
                      <div className="flex flex-wrap items-center gap-3 rounded-sm bg-[#fff1f0] p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-destructive-text">
                            Delete {category.title}?
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Existing transactions keep their history.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          height="h-8"
                          padding="px-2.5"
                          fullWidth={false}
                          onClick={() => setDeletingId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          height="h-8"
                          padding="px-2.5"
                          fullWidth={false}
                          onClick={() => deleteCategory(category.id)}
                          disabled={isRemoving}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : isEditing ? (
                      <div className="flex items-center gap-2">
                        <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-muted text-xs font-semibold">
                          {category.title.charAt(0)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <InputField
                            id={`rename-${category.id}`}
                            label={`Rename ${category.title}`}
                            hideLabel
                            value={editingName}
                            onChange={(event) => setEditingName(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') saveEdit(category.id)
                            }}
                          />
                        </div>
                        <IconButton
                          variant="filled"
                          onClick={() => saveEdit(category.id)}
                          disabled={isSaving}
                          aria-label="Save category name"
                        >
                          <Check size={15} />
                        </IconButton>
                        <IconButton
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          aria-label="Cancel rename"
                        >
                          <X size={15} />
                        </IconButton>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-muted text-xs font-semibold">
                          {category.title.charAt(0)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{category.title}</p>
                        </div>
                        <IconButton
                          onClick={() => {
                            setEditingId(category.id)
                            setEditingName(category.title)
                            setActionError(undefined)
                          }}
                          aria-label={`Rename ${category.title}`}
                        >
                          <Pencil size={14} />
                        </IconButton>
                        <IconButton
                          variant="ghost-destructive"
                          onClick={() => setDeletingId(category.id)}
                          aria-label={`Delete ${category.title}`}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </BaseModalBody>

      <BaseModalFooter className="flex justify-end">
        <Button variant="dark" height="h-10" fullWidth={false} onClick={onBack}>
          Done
        </Button>
      </BaseModalFooter>
    </>
  )
}

export default CategoryManager
