export const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Gestor' },
  { value: 'CLERK', label: 'Assistente' },
  { value: 'ANALYST', label: 'Analista' },
]

export const translateRole = (value: string) =>
  ROLE_OPTIONS.find((opt) => opt.value === value)?.label || value
