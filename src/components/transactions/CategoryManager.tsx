import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { ArrowLeft, Check, Pencil, Plus, Tags, Trash2, X } from 'lucide-react'
import SegmentedTab from '#/components/ui/SegmentedTab'
import Button from '#/components/ui/Button'
import IconButton from '#/components/ui/IconButton'
import InputField from '#/components/ui/InputField'
import type { Category } from '#/api/category/category.type'
import { TransactionType } from '#/enum/enum'
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from '#/hooks/useCategory'

const CATEGORY_TABS = [
  { label: 'Expense categories', value: TransactionType.EXPEND },
  { label: 'Income categories', value: TransactionType.INCOME },
]

const TYPE_LABEL: Record<TransactionType, string> = {
  [TransactionType.EXPEND]: 'expense',
  [TransactionType.INCOME]: 'income',
}

const DEFAULT_COLOR = '#94a3b8'

interface CategoryManagerProps {
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
  transactionType: TransactionType
  onBack: () => void
  onClose: () => void
}

const CategoryManager = ({
  categories,
  setCategories,
  transactionType,
  onBack,
  onClose,
}: CategoryManagerProps) => {
  const [activeType, setActiveType] = useState<TransactionType>(transactionType)
  const [newCategory, setNewCategory] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutateAsync: updateCategory, isPending: isSaving } = useUpdateCategory()
  const { mutateAsync: removeCategory, isPending: isRemoving } = useDeleteCategory()

  const filtered = useMemo(
    () => categories.filter((category) => category.type === activeType),
    [activeType, categories],
  )

  const addCategory = async () => {
    const title = newCategory.trim()
    if (!title) return
    setNewCategory('')

    try {
      const created = await createCategory({ title, type: activeType, color: DEFAULT_COLOR })
      setCategories((prev) => [...prev, created])
    } catch {
      setNewCategory(title)
    }
  }

  const saveEdit = async (id: number) => {
    const title = editingName.trim()
    const category = categories.find((item) => item.id === id)
    if (!title || !category) return

    const previousTitle = category.title
    setCategories((prev) => prev.map((item) => (item.id === id ? { ...item, title } : item)))
    setEditingId(null)
    setEditingName('')

    try {
      await updateCategory({ id, payload: { title, type: category.type, color: category.color } })
    } catch {
      setCategories((prev) =>
        prev.map((item) => (item.id === id ? { ...item, title: previousTitle } : item)),
      )
    }
  }

  const deleteCategory = async (id: number) => {
    const removed = categories.find((item) => item.id === id)
    setCategories((prev) => prev.filter((category) => category.id !== id))
    setDeletingId(null)

    try {
      await removeCategory(id)
    } catch {
      if (removed) setCategories((prev) => [...prev, removed])
    }
  }

  return (
    <>
      <div className="border-b px-5 py-4 sm:px-6">
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
      </div>

      <div className="p-5 sm:p-6">
        <SegmentedTab
          tabs={CATEGORY_TABS}
          active={activeType}
          onChange={(type) => {
            setActiveType(type)
            setEditingId(null)
            setDeletingId(null)
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
            />
          </div>
          <Button
            variant="dark"
            height="h-11"
            padding="px-3.5"
            fullWidth={false}
            onClick={addCategory}
            disabled={isCreating}
            prefixIcon={<Plus size={15} />}
          >
            Add
          </Button>
        </div>

        <div className="mt-5 max-h-88 overflow-y-auto rounded-lg border">
          {filtered.length === 0 ? (
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
                          <p className="text-xs font-medium text-destructive">
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

        <div className="mt-5 flex justify-end border-t pt-5">
          <Button variant="dark" height="h-10" fullWidth={false} onClick={onBack}>
            Done
          </Button>
        </div>
      </div>
    </>
  )
}

export default CategoryManager
