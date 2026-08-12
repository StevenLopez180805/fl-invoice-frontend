import { apiFetch } from '../../Chat/services/httpClient'
import type { ExpenseRecord } from '../types'

export function fetchExpenses(): Promise<ExpenseRecord[]> {
  return apiFetch<ExpenseRecord[]>('/expenses')
}
