import { useQuery } from "@tanstack/react-query"
import { getCategories } from "#/api/category/category.api"
import type { PaginationParams } from "#/api/types"

export const useFetchCategory = (params?: PaginationParams) => {
  const query = useQuery({ queryKey: ['category', params], queryFn: () => getCategories(params) })
  console.log(query)
  return query
}