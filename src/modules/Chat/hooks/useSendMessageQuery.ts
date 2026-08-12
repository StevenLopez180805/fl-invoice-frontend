import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { sendMessage } from '../services'
import type { SendMessageResult } from '../types'

interface SendMessageVariables {
  conversationId: string
  content: string
}

export function useSendMessageQuery() {
  const variablesRef = useRef<SendMessageVariables | null>(null)

  const query = useQuery<SendMessageResult>({
    queryKey: ['conversations', 'messages'],
    queryFn: () => {
      const variables = variablesRef.current
      if (!variables) {
        return Promise.reject(new Error('No hay mensaje para enviar'))
      }
      return sendMessage(variables.conversationId, variables.content)
    },
    enabled: false,
    retry: false,
  })

  const send = (variables: SendMessageVariables) => {
    variablesRef.current = variables
    return query.refetch()
  }

  return { ...query, send }
}
