interface ConfirmButtonsProps {
  readonly onConfirm: (accepted: boolean) => void
}

export function ConfirmButtons({ onConfirm }: ConfirmButtonsProps) {
  return (
    <div className="flex justify-center gap-3 border-t border-gray-200 p-3">
      <button
        type="button"
        onClick={() => onConfirm(true)}
        className="rounded-full bg-purple-600 px-6 py-2 text-sm font-medium text-white cursor-pointer"
      >
        Sí
      </button>
      <button
        type="button"
        onClick={() => onConfirm(false)}
        className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 cursor-pointer"
      >
        No
      </button>
    </div>
  )
}
