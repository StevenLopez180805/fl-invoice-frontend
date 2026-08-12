import { useCallback, useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import { ChatState } from '../types'
import { toChatMessage, toChatMessageWithId, toChatState } from '../services/mappers'
import { useSendMessageQuery } from './useSendMessageQuery'
import { useUploadReceiptQuery } from './useUploadReceiptQuery'
import { useSaveExpenseQuery } from './useSaveExpenseQuery'
import { useStartConversationQuery } from './useStartConversationQuery'

export function useChatFlow() {
  const conversationId = useChatStore((s) => s.conversationId)
  const state = useChatStore((s) => s.state)
  const messages = useChatStore((s) => s.messages)
  const expenseDraft = useChatStore((s) => s.expenseDraft)

  const setConversationId = useChatStore((s) => s.setConversationId)
  const setState = useChatStore((s) => s.setState)
  const addMessage = useChatStore((s) => s.addMessage)
  const setMessages = useChatStore((s) => s.setMessages)
  const appendMessages = useChatStore((s) => s.appendMessages)
  const documentNumber = useChatStore((s) => s.documentNumber)
  const setDocumentNumber = useChatStore((s) => s.setDocumentNumber)
  const setExpenseDraft = useChatStore((s) => s.setExpenseDraft)
  const setPendingFile = useChatStore((s) => s.setPendingFile)
  const reset = useChatStore((s) => s.reset)

  const startConversationQuery = useStartConversationQuery(!conversationId)
  const sendMessageQuery = useSendMessageQuery()
  const uploadReceiptQuery = useUploadReceiptQuery()
  const saveExpenseQuery = useSaveExpenseQuery()

  useEffect(() => {
    const conversation = startConversationQuery.data
    if (!conversation || conversationId) return

    setConversationId(conversation.id)
    setMessages(conversation.message.map(toChatMessage))
    setState(toChatState(conversation.state))
  }, [startConversationQuery.data, conversationId, setConversationId, setMessages, setState])

  const sendDocumentNumber = useCallback(
    async (value: string) => {
      if (state !== ChatState.WAITING_DOCUMENT || !value.trim() || !conversationId) return

      addMessage({ role: 'user', content: value })
      setDocumentNumber(value)

      const { data, error } = await sendMessageQuery.send({ conversationId, content: value })

      if (data) {
        data.messages
          .filter((message) => message.role === 'BOT')
          .forEach((message) => addMessage({ role: 'bot', content: message.content }))
        setState(toChatState(data.state))
      } else {
        addMessage({
          role: 'bot',
          content:
            error instanceof Error
              ? `${error.message}. Verifica el número e intenta de nuevo.`
              : 'No fue posible validar el documento. Intenta de nuevo.',
        })
      }
    },
    [state, conversationId, addMessage, setDocumentNumber, setState, sendMessageQuery],
  )

  const attachReceipt = useCallback(
    async (file: File) => {
      if (state !== ChatState.WAITING_RECEIPT || !conversationId) return

      setPendingFile(file)
      addMessage({
        role: 'user',
        content: 'Adjuntó una factura',
        attachment: { name: file.name },
      })

      const { data, error } = await uploadReceiptQuery.upload({ conversationId, file })

      if (data) {
        appendMessages(data.messages.map(toChatMessageWithId))
        setExpenseDraft(data.expense)
        setState(toChatState(data.state))
      } else {
        addMessage({
          role: 'bot',
          content:
            error instanceof Error
              ? error.message
              : 'No pude leer la factura adjunta. Intenta con otra foto.',
        })
      }

      setPendingFile(null)
    },
    [
      state,
      conversationId,
      addMessage,
      setPendingFile,
      setState,
      uploadReceiptQuery,
      appendMessages,
      setExpenseDraft,
    ],
  )

  const confirmExpense = useCallback(
    async (accepted: boolean) => {
      if (state !== ChatState.CONFIRMING_EXPENSE) return

      addMessage({ role: 'user', content: accepted ? 'Sí' : 'No' })

      if (!accepted) {
        setExpenseDraft(null)
        addMessage({
          role: 'bot',
          content: 'Entendido, por favor adjunta mejores fotos de la factura.',
        })
        setState(ChatState.WAITING_RECEIPT)
        return
      }

      if (!expenseDraft || !documentNumber) return

      const { data } = await saveExpenseQuery.save({
        documentNumber,
        data: expenseDraft,
      })

      if (data) {
        addMessage({ role: 'bot', content: 'Factura guardada correctamente ✅' })
        setExpenseDraft(null)
        addMessage({ role: 'bot', content: '¿Deseas subir otra factura?' })
        setState(ChatState.ASKING_ANOTHER_RECEIPT)
      } else {
        addMessage({
          role: 'bot',
          content: 'No fue posible guardar la factura. Confirmemos de nuevo.',
        })
      }
    },
    [state, addMessage, setExpenseDraft, setState, expenseDraft, documentNumber, saveExpenseQuery],
  )

  const confirmAnotherReceipt = useCallback(
    (accepted: boolean) => {
      if (state !== ChatState.ASKING_ANOTHER_RECEIPT) return

      addMessage({ role: 'user', content: accepted ? 'Sí' : 'No' })

      if (accepted) {
        addMessage({ role: 'bot', content: 'Perfecto, adjunta la nueva factura.' })
        setState(ChatState.WAITING_RECEIPT)
      } else {
        addMessage({ role: 'bot', content: '¡Gracias! Conversación finalizada.' })
        setState(ChatState.COMPLETED)
      }
    },
    [state, addMessage, setState],
  )

  return {
    conversationId,
    state,
    messages,
    expenseDraft,
    isStartingConversation: !conversationId,
    isValidatingDocument: sendMessageQuery.isFetching,
    isProcessingReceipt: uploadReceiptQuery.isFetching,
    isSavingExpense: saveExpenseQuery.isFetching,
    sendDocumentNumber,
    attachReceipt,
    confirmExpense,
    confirmAnotherReceipt,
    startNewConversation: reset,
  }
}
