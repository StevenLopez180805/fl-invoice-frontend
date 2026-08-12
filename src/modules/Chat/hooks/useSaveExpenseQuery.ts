import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { saveExpense } from '../services'
import type { ExtractedExpense, SavedExpense } from '../types'

interface SaveExpenseVariables {
  documentNumber: string
  data: ExtractedExpense
}

export function useSaveExpenseQuery() {
  const variablesRef = useRef<SaveExpenseVariables | null>(null)

  const query = useQuery<SavedExpense>({
    queryKey: ['expenses', 'save'],
    queryFn: () => {
      const variables = variablesRef.current
      if (!variables) {
        return Promise.reject(new Error('No hay datos de gasto para guardar'))
      }
      return saveExpense(variables.documentNumber, variables.data)
    },
    enabled: false,
    retry: false,
  })

  const save = (variables: SaveExpenseVariables) => {
    variablesRef.current = variables
    return query.refetch()
  }

  return { ...query, save }
}
