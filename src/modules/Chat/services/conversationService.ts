import type { Conversation, SendMessageResult, UploadReceiptResult } from '../types'
import { apiFetch } from './httpClient'

export function startConversation(): Promise<Conversation> {
  return apiFetch<Conversation>('/conversations', { method: 'POST' })
}

export function sendMessage(conversationId: string, content: string): Promise<SendMessageResult> {
  return apiFetch<SendMessageResult>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export function uploadReceipt(conversationId: string, file: File): Promise<UploadReceiptResult> {
  const formData = new FormData()
  formData.append('file', file)

  return apiFetch<UploadReceiptResult>(`/conversations/${conversationId}/receipt`, {
    method: 'POST',
    body: formData,
  })
}
