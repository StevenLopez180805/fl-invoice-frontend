export type MessageRole = 'user' | 'bot'

export enum ChatState {
  WAITING_DOCUMENT = 'WAITING_DOCUMENT',
  WAITING_RECEIPT = 'WAITING_RECEIPT',
  CONFIRMING_EXPENSE = 'CONFIRMING_EXPENSE',
  ASKING_ANOTHER_RECEIPT = 'ASKING_ANOTHER_RECEIPT',
  COMPLETED = 'COMPLETED',
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  attachment?: {
    name: string
    url?: string
  }
}

export interface ExtractedExpense {
  id: string
  nit: string
  merchantName: string
  amount: number
  description: string
  date: string
}

export interface SavedExpense extends ExtractedExpense {
  documentNumber: string
  savedAt: string
}

export type BackendMessageRole = 'BOT' | 'USER'

export interface BackendMessage {
  id: string
  is_active: boolean
  created_at: string
  updated_at: string
  role: BackendMessageRole
  content: string
}

export interface Conversation {
  id: string
  is_active: boolean
  created_at: string
  updated_at: string
  state: string
  message: BackendMessage[]
}

export interface SendMessageResult {
  state: string
  messages: Array<{
    role: BackendMessageRole
    content: string
  }>
}

export interface BackendMessageWithId {
  id: string
  role: BackendMessageRole
  content: string
}

export interface UploadReceiptResult {
  state: string
  messages: BackendMessageWithId[]
  expense: ExtractedExpense | null
}
