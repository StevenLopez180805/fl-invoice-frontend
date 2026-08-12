import { useState, type FormEvent } from 'react'

interface NumericInputProps {
  readonly placeholder?: string
  readonly onSubmit: (value: string) => void
}

export function NumericInput({
  placeholder = 'Número de documento',
  onSubmit,
}: NumericInputProps) {
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
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
        placeholder={placeholder}
        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-purple-500"
        autoFocus
      />
      <button
        type="submit"
        className="rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
        disabled={!value.trim()}
      >
        Enviar
      </button>
    </form>
  )
}
