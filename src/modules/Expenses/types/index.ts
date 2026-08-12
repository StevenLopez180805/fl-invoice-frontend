export interface ExpenseDriver {
  dni: string
  nombres: string
}

export type ExpenseStatus = 'PENDING' | 'CONFIRMED'

export interface ExpenseRecord {
  id: string
  nit: string
  companyName: string
  amount: number
  description: string
  date: string
  status: ExpenseStatus
  driver: ExpenseDriver
}
