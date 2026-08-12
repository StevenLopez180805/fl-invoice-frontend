import { useExpensesQuery } from '../hooks/useExpensesQuery'
import { ExpensesTable } from '../components/ExpensesTable'

export function ExpensesPage() {
  const { data, isLoading, isError, error } = useExpensesQuery()

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-6">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">Todos los gastos</h1>

      {isLoading && <p className="text-sm text-gray-600">Cargando gastos...</p>}

      {isError && (
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : 'No fue posible cargar los gastos.'}
        </p>
      )}

      {data && data.length === 0 && (
        <p className="text-sm text-gray-600">No hay gastos registrados todavía.</p>
      )}

      {data && data.length > 0 && <ExpensesTable expenses={data} />}
    </main>
  )
}
