import type { ExtractedExpense, SavedExpense } from '../types'
import { simulatedDelay } from './simulatedDelay'

export async function saveExpense(
  documentNumber: string,
  data: ExtractedExpense,
): Promise<SavedExpense> {
  await simulatedDelay(1000)

  return {
    ...data,
    documentNumber,
    savedAt: new Date().toISOString(),
  }
}
