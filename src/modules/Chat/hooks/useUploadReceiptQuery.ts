import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { uploadReceipt } from '../services'
import type { UploadReceiptResult } from '../types'

interface UploadReceiptVariables {
  conversationId: string
  file: File
}

export function useUploadReceiptQuery() {
  const variablesRef = useRef<UploadReceiptVariables | null>(null)

  const query = useQuery<UploadReceiptResult>({
    queryKey: ['conversations', 'receipt'],
    queryFn: () => {
      const variables = variablesRef.current
      if (!variables) {
        return Promise.reject(new Error('No hay factura para subir'))
      }
      return uploadReceipt(variables.conversationId, variables.file)
    },
    enabled: false,
    retry: false,
  })

  const upload = (variables: UploadReceiptVariables) => {
    variablesRef.current = variables
    return query.refetch()
  }

  return { ...query, upload }
}
