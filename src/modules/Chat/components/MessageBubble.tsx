import type { ChatMessage } from '../types'

interface MessageBubbleProps {
  readonly message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] whitespace-pre-line rounded-2xl px-4 py-2 text-sm shadow-sm ${
          isUser
            ? 'rounded-br-sm bg-purple-600 text-white'
            : 'rounded-bl-sm bg-gray-100 text-gray-900'
        }`}
      >
        {message.attachment && (
          <p className="mb-1 text-xs font-medium opacity-80">{message.attachment.name}</p>
        )}
        {message.content}
      </div>
    </div>
  )
}
