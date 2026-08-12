import type { ExtractedExpense } from '../../types'

interface ExpenseSummaryCardProps {
  readonly expense: ExtractedExpense
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function ExpenseSummaryCard({ expense }: ExpenseSummaryCardProps) {
  return (
    <div className="mx-3 mt-2 mb-3 rounded-xl border border-purple-200 bg-purple-50 p-3 text-sm text-purple-950">
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="font-medium text-purple-600">Comercio</dt>
        <dd className="text-right">{expense.merchantName}</dd>
        <dt className="font-medium text-purple-600">NIT</dt>
        <dd className="text-right">{expense.nit}</dd>
        <dt className="font-medium text-purple-600">Monto</dt>
        <dd className="text-right">{currencyFormatter.format(expense.amount)}</dd>
        <dt className="font-medium text-purple-600">Descripción</dt>
        <dd className="text-right">{expense.description}</dd>
        <dt className="font-medium text-purple-600">Fecha</dt>
        <dd className="text-right">{expense.date}</dd>
      </dl>
    </div>
  )
}
