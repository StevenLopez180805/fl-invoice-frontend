import { ChatState } from '../types'
import { useChatFlow } from '../hooks/useChatFlow'
import { MessageList } from './MessageList'
import { ChatInputArea } from './ChatInputArea'
import { ExpenseSummaryCard } from './inputs/ExpenseSummaryCard'

export function ChatWindow() {
  const flow = useChatFlow()
  return (
    <div className="mx-auto flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
      <header className="border-b border-gray-200 p-4">
        <h1 className="text-lg font-semibold text-gray-900">Asistente de Facturas</h1>
      </header>

      <MessageList messages={flow.messages} />
      {flow.state === ChatState.CONFIRMING_EXPENSE && flow.expenseDraft && (
        <ExpenseSummaryCard expense={flow.expenseDraft} />
      )}
      <ChatInputArea flow={flow} />
    </div>
  )
}
