import { useQuery } from '@tanstack/react-query'
import { fetchExpenses } from '../services/expensesService'

export function useExpensesQuery() {
  return useQuery({
    queryKey: ['expenses', 'list'],
    queryFn: fetchExpenses,
  })
}
