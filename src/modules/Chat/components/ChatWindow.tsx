import { useChatFlow } from '../hooks/useChatFlow'
import { MessageList } from './MessageList'
import { ChatInputArea } from './ChatInputArea'

export function ChatWindow() {
  const flow = useChatFlow()
  console.log({flow})
  return (
    <div className="mx-auto flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
      <header className="border-b border-gray-200 p-4">
        <h1 className="text-lg font-semibold text-gray-900">Asistente de Facturas</h1>
      </header>

      <MessageList messages={flow.messages} />
      <ChatInputArea flow={flow} />
    </div>
  )
}
