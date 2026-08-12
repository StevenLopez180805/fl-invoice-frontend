import {
  ChatState,
  type BackendMessage,
  type BackendMessageWithId,
  type ChatMessage,
} from '../types'

export function toChatMessage(message: BackendMessage): ChatMessage {
  return {
    id: message.id,
    role: message.role === 'BOT' ? 'bot' : 'user',
    content: message.content,
    timestamp: new Date(message.created_at).getTime(),
  }
}

export function toChatMessageWithId(message: BackendMessageWithId): ChatMessage {
  return {
    id: message.id,
    role: message.role === 'BOT' ? 'bot' : 'user',
    content: message.content,
    timestamp: Date.now(),
  }
}

const VALID_STATES = new Set<string>(Object.values(ChatState))

export function toChatState(state: string): ChatState {
  if (VALID_STATES.has(state)) {
    return state as ChatState
  }

  console.warn(`Estado desconocido recibido del backend: ${state}`)
  return ChatState.WAITING_DOCUMENT
}
