import { useQuery } from '@tanstack/react-query'
import { startConversation } from '../services'
import type { Conversation } from '../types'

export function useStartConversationQuery(enabled: boolean) {
  return useQuery<Conversation>({
    queryKey: ['conversations', 'start'],
    queryFn: startConversation,
    enabled,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
