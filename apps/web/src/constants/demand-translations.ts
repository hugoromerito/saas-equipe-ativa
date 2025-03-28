// src/constants/demand-translations.ts

export const CATEGORY_OPTIONS = [
  { value: 'INFRASTRUCTURE', label: 'Infraestrutura e Serviços Públicos' },
  { value: 'HEALTH', label: 'Saúde Pública' },
  { value: 'EDUCATION', label: 'Educação e Creches' },
  { value: 'SOCIAL_ASSISTANCE', label: 'Assistência Social' },
  { value: 'PUBLIC_SAFETY', label: 'Segurança Pública' },
  { value: 'TRANSPORTATION', label: 'Transporte e Mobilidade' },
  { value: 'EMPLOYMENT', label: 'Emprego e Desenvolvimento Econômico' },
  { value: 'CULTURE', label: 'Cultura, Esporte e Lazer' },
  { value: 'ENVIRONMENT', label: 'Meio Ambiente e Sustentabilidade' },
  { value: 'HUMAN_RIGHTS', label: 'Direitos Humanos e Cidadania' },
  { value: 'TECHNOLOGY', label: 'Tecnologia e Inovação' },
]

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'URGENT', label: 'Urgente' },
]

export const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'RESOLVED', label: 'Resolvida' },
  { value: 'REJECTED', label: 'Rejeitada' },
]

// Funções utilitárias
export const translateCategory = (value: string) =>
  CATEGORY_OPTIONS.find((opt) => opt.value === value)?.label || value

export const translatePriority = (value: string) =>
  PRIORITY_OPTIONS.find((opt) => opt.value === value)?.label || value

export const translateStatus = (value: string) =>
  STATUS_OPTIONS.find((opt) => opt.value === value)?.label || value
