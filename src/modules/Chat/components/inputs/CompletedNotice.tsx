interface CompletedNoticeProps {
  readonly onRestart: () => void
}

export function CompletedNotice({ onRestart }: CompletedNoticeProps) {
  return (
    <div className="flex flex-col items-center gap-2 border-t border-gray-200 p-4">
      <p className="text-sm text-gray-600">Conversación finalizada.</p>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white"
      >
        Iniciar nueva conversación
      </button>
    </div>
  )
}
