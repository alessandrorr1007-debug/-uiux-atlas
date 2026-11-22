export const categories = [
  { id: 'navigation', label: 'Navegación', icon: 'compass' },
  { id: 'layouts', label: 'Estructuras', icon: 'layout' },
  { id: 'data', label: 'Datos y paneles', icon: 'chart' },
  { id: 'forms', label: 'Formularios', icon: 'form' },
  { id: 'commerce', label: 'Comercio', icon: 'shopping' },
  { id: 'feedback', label: 'Estados y avisos', icon: 'bell' },
  { id: 'motion', label: 'Interacciones', icon: 'sparkles' },
  { id: 'content', label: 'Contenido', icon: 'type' }
] as const

export type CategoryId = (typeof categories)[number]['id']
export type PreviewKind = CategoryId
export type ToolId = 'Google AI Studio' | 'Codex' | 'Antigravity'
export type ComponentInfo = {
  id: string
  name: string
  category: CategoryId
  description: string
  preview: PreviewKind
  useCase: string
  guidance: string
}
export type PromptConfig = {
  tool: ToolId
  project: string
  style: string
  theme: 'Claro' | 'Oscuro' | 'Ambos'
  keepLogic: boolean
  audience?: string
  structure?: string
  hero?: string
  motion?: string
  device?: string
}
