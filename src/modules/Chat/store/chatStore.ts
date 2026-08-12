import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatState, type ChatMessage, type ExtractedExpense } from '../types'

interface ChatStoreState {
  conversationId: string | null
  state: ChatState
  messages: ChatMessage[]
  documentNumber: string | null
  expenseDraft: ExtractedExpense | null
  pendingFile: File | null
}

interface ChatStoreActions {
  setConversationId: (conversationId: string) => void
  setState: (state: ChatState) => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setMessages: (messages: ChatMessage[]) => void
  appendMessages: (messages: ChatMessage[]) => void
  setDocumentNumber: (documentNumber: string | null) => void
  setExpenseDraft: (draft: ExtractedExpense | null) => void
  setPendingFile: (file: File | null) => void
  reset: () => void
}

type ChatStore = ChatStoreState & ChatStoreActions

const initialState: ChatStoreState = {
  conversationId: null,
  state: ChatState.WAITING_DOCUMENT,
  messages: [],
  documentNumber: null,
  expenseDraft: null,
  pendingFile: null,
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      ...initialState,

      setConversationId: (conversationId) => set({ conversationId }),
      setState: (state) => set({ state }),

      addMessage: (message) =>
        set((store) => ({
          messages: [
            ...store.messages,
            { ...message, id: crypto.randomUUID(), timestamp: Date.now() },
          ],
        })),

      setMessages: (messages) => set({ messages }),

      appendMessages: (newMessages) =>
        set((store) => ({ messages: [...store.messages, ...newMessages] })),

      setDocumentNumber: (documentNumber) => set({ documentNumber }),
      setExpenseDraft: (expenseDraft) => set({ expenseDraft }),
      setPendingFile: (pendingFile) => set({ pendingFile }),

      reset: () => set(initialState),
    }),
    {
      name: 'fl-invoice-chat',
      partialize: (store) => ({
        conversationId: store.conversationId,
        state: store.state,
        messages: store.messages,
        documentNumber: store.documentNumber,
        expenseDraft: store.expenseDraft,
      }),
    },
  ),
)
