import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useChatStore } from '../store/chatStore'
import { ChatState } from '../types'
import { toChatMessage, toChatMessageWithId, toChatState } from '../services/mappers'
import { useSendMessageQuery } from './useSendMessageQuery'
import { useUploadReceiptQuery } from './useUploadReceiptQuery'
import { useStartConversationQuery } from './useStartConversationQuery'

export function useChatFlow() {
  const conversationId = useChatStore((s) => s.conversationId)
  const state = useChatStore((s) => s.state)
  const messages = useChatStore((s) => s.messages)
  const expenseDraft = useChatStore((s) => s.expenseDraft)

  const setConversationId = useChatStore((s) => s.setConversationId)
  const setState = useChatStore((s) => s.setState)
  const addMessage = useChatStore((s) => s.addMessage)
  const appendMessages = useChatStore((s) => s.appendMessages)
  const setDocumentNumber = useChatStore((s) => s.setDocumentNumber)
  const setExpenseDraft = useChatStore((s) => s.setExpenseDraft)
  const setPendingFile = useChatStore((s) => s.setPendingFile)
  const reset = useChatStore((s) => s.reset)

  const [hasTriggeredStart, setHasTriggeredStart] = useState(false)

  const queryClient = useQueryClient()
  const startConversationQuery = useStartConversationQuery(hasTriggeredStart && !conversationId)
  const sendMessageQuery = useSendMessageQuery()
  const uploadReceiptQuery = useUploadReceiptQuery()

  useEffect(() => {
    const conversation = startConversationQuery.data
    if (!conversation || conversationId) return

    setConversationId(conversation.id)
    appendMessages(conversation.message.map(toChatMessage))
    setState(toChatState(conversation.state))
  }, [startConversationQuery.data, conversationId, setConversationId, appendMessages, setState])

  const startConversation = useCallback(
    (value: string) => {
      if (conversationId || hasTriggeredStart || !value.trim()) return

      addMessage({ role: 'user', content: value })
      setHasTriggeredStart(true)
    },
    [conversationId, hasTriggeredStart, addMessage],
  )

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
      if (state !== ChatState.CONFIRMING_EXPENSE || !conversationId) return

      const content = accepted ? 'SI' : 'NO'
      addMessage({ role: 'user', content })

      const { data, error } = await sendMessageQuery.send({ conversationId, content })

      if (data) {
        data.messages
          .filter((message) => message.role === 'BOT')
          .forEach((message) => addMessage({ role: 'bot', content: message.content }))

        const nextState = toChatState(data.state)
        if (nextState !== ChatState.CONFIRMING_EXPENSE) {
          setExpenseDraft(null)
        }
        setState(nextState)
      } else {
        addMessage({
          role: 'bot',
          content:
            error instanceof Error
              ? error.message
              : 'No fue posible confirmar la factura. Intenta de nuevo.',
        })
      }
    },
    [state, conversationId, addMessage, setExpenseDraft, setState, sendMessageQuery],
  )

  const confirmAnotherReceipt = useCallback(
    async (accepted: boolean) => {
      if (state !== ChatState.ASKING_ANOTHER_RECEIPT || !conversationId) return

      const content = accepted ? 'SI' : 'NO'
      addMessage({ role: 'user', content })

      const { data, error } = await sendMessageQuery.send({ conversationId, content })

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
              ? error.message
              : 'No fue posible continuar. Intenta de nuevo.',
        })
      }
    },
    [state, conversationId, addMessage, setState, sendMessageQuery],
  )

  const startNewConversation = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['conversations', 'start'] })
    reset()
    setHasTriggeredStart(false)
  }, [queryClient, reset])

  return {
    conversationId,
    state,
    messages,
    expenseDraft,
    awaitingStart: !conversationId && !hasTriggeredStart,
    isStartingConversation: hasTriggeredStart && !conversationId,
    isValidatingDocument: sendMessageQuery.isFetching,
    isProcessingReceipt: uploadReceiptQuery.isFetching,
    isConfirmingExpense: sendMessageQuery.isFetching,
    isAskingAnotherReceipt: sendMessageQuery.isFetching,
    startConversation,
    sendDocumentNumber,
    attachReceipt,
    confirmExpense,
    confirmAnotherReceipt,
    startNewConversation,
  }
}
