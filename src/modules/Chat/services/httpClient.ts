const API_URL = import.meta.env.VITE_API_URL

interface BackendErrorBody {
  message?: string
  error?: string
  statusCode?: number
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function readErrorMessage(response: Response, path: string): Promise<string> {
  try {
    const body = (await response.json()) as BackendErrorBody
    if (body.message) return body.message
  } catch {
    // el cuerpo no era JSON o estaba vacío; usamos el mensaje genérico
  }
  return `Error ${response.status} al llamar a ${path}`
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      // FormData necesita que el navegador fije su propio Content-Type con el boundary
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response, path), response.status)
  }

  return response.json() as Promise<T>
}
