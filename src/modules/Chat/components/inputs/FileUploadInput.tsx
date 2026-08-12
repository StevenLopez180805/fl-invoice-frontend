import { useEffect, useRef, useState, type ChangeEvent } from 'react'

interface FileUploadInputProps {
  readonly onConfirm: (file: File) => void
}

const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg'])
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export function FileUploadInput({ onConfirm }: FileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null
    event.target.value = ''

    if (!selected) return

    if (!ACCEPTED_TYPES.has(selected.type)) {
      setError('Solo se aceptan imágenes JPG o PNG.')
      setFile(null)
      return
    }

    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setError('La imagen no debe superar los 5MB.')
      setFile(null)
      return
    }

    setError(null)
    setFile(selected)
  }

  const handleConfirm = () => {
    if (!file) return
    onConfirm(file)
    setFile(null)
  }

  if (file && previewUrl) {
    return (
      <div className="flex flex-col gap-2 border-t border-gray-200 p-3">
        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
          <img src={previewUrl} alt={file.name} className="w-full object-contain" />
        </div>
        <p className="truncate text-xs text-gray-500">{file.name}</p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white"
          >
            Enviar factura
          </button>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700"
          >
            Elegir otra
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 border-t border-gray-200 p-3">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white"
      >
        📎 Adjuntar factura
      </button>
    </div>
  )
}
