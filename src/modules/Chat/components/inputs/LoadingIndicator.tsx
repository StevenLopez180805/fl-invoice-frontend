interface LoadingIndicatorProps {
  readonly label: string
}

export function LoadingIndicator({ label }: LoadingIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 border-t border-gray-200 p-4 text-sm text-gray-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
      {label}
    </div>
  )
}
