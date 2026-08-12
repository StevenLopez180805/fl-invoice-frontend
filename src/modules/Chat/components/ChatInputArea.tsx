import { ChatState } from '../types'
import type { useChatFlow } from '../hooks/useChatFlow'
import { NumericInput } from './inputs/NumericInput'
import { FileUploadInput } from './inputs/FileUploadInput'
import { ConfirmButtons } from './inputs/ConfirmButtons'
import { LoadingIndicator } from './inputs/LoadingIndicator'
import { CompletedNotice } from './inputs/CompletedNotice'

type ChatFlow = ReturnType<typeof useChatFlow>

interface ChatInputAreaProps {
  readonly flow: ChatFlow
}

export function ChatInputArea({ flow }: ChatInputAreaProps) {
  if (flow.isStartingConversation) {
    return <LoadingIndicator label="Iniciando conversación..." />
  }

  switch (flow.state) {
    case ChatState.WAITING_DOCUMENT:
      return flow.isValidatingDocument ? (
        <LoadingIndicator label="Validando documento..." />
      ) : (
        <NumericInput onSubmit={flow.sendDocumentNumber} />
      )

    case ChatState.WAITING_RECEIPT:
      return flow.isProcessingReceipt ? (
        <LoadingIndicator label="Analizando factura..." />
      ) : (
        <FileUploadInput onConfirm={flow.attachReceipt} />
      )

    case ChatState.CONFIRMING_EXPENSE:
      return flow.isSavingExpense ? (
        <LoadingIndicator label="Guardando factura..." />
      ) : (
        <ConfirmButtons onConfirm={flow.confirmExpense} />
      )

    case ChatState.ASKING_ANOTHER_RECEIPT:
      return <ConfirmButtons onConfirm={flow.confirmAnotherReceipt} />

    case ChatState.COMPLETED:
      return <CompletedNotice onRestart={flow.startNewConversation} />

    default:
      return null
  }
}
