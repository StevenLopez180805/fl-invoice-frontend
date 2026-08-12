import type { ExpenseRecord } from '../types'

interface ExpensesTableProps {
  readonly expenses: ExpenseRecord[]
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

const statusStyles: Record<ExpenseRecord['status'], string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
}

const statusLabels: Record<ExpenseRecord['status'], string> = {
  CONFIRMED: 'Confirmado',
  PENDING: 'Pendiente',
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Fecha</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Comercio</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">NIT</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Descripción</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">Monto</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Estado</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Conductor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">{expense.date}</td>
              <td className="px-4 py-3 text-gray-900">{expense.companyName}</td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">{expense.nit}</td>
              <td className="px-4 py-3 text-gray-700">{expense.description}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-gray-900">
                {currencyFormatter.format(expense.amount)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[expense.status]}`}
                >
                  {statusLabels[expense.status]}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                <div>{expense.driver.nombres}</div>
                <div className="text-xs text-gray-400">{expense.driver.dni}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
