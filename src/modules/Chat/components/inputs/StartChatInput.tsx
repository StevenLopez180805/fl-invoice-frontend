import { useState, type FormEvent } from 'react'

interface StartChatInputProps {
  readonly onSubmit: (value: string) => void
}

export function StartChatInput({ onSubmit }: StartChatInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!value.trim()) return
    onSubmit(value)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 p-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Escribe un mensaje para comenzar, ej: Hola"
        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-purple-500"
        autoFocus
      />
      <button
        type="submit"
        className="rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-40"
        disabled={!value.trim()}
      >
        Enviar
      </button>
    </form>
  )
}
