import type { ComponentInfo, PromptConfig } from '../types'

export function buildPrompt(items: ComponentInfo[], config: PromptConfig): string {
  if (items.length === 0) return ''
  const project = config.project.trim() || 'mi aplicación web'
  const audience = (config.audience || 'usuarios del proyecto').trim()
  const structure = (config.structure || 'layout adaptable según necesidades del contenido').trim()
  const hero = (config.hero || 'portada clara con una acción principal').trim()
  const motion = (config.motion || 'microinteracciones discretas').trim()
  const device = (config.device || 'Móvil y escritorio').trim()
  const chosen = items.map((item,index) =>
    `${index+1}. ${item.name}: ${item.description} ${item.guidance}`
  ).join('\n')
  const safeguard = config.keepLogic
    ? 'No modifiques autenticación, lógica de negocio, APIs, base de datos, rutas, contratos ni funcionalidades existentes. Limita los cambios a la UI/UX salvo correcciones explícitas imprescindibles.'
    : 'Integra el diseño en la arquitectura existente y justifica cada cambio funcional antes de realizarlo.'

  return `Actúa como diseñador de producto senior y desarrollador frontend trabajando con ${config.tool}.

1. QUÉ ES: ${project}.
2. PARA QUIÉN: ${audience}.
3. ESTILO: ${config.style}; apariencia: ${config.theme}.
4. ESTRUCTURA: ${structure}; portada: ${hero}.
5. DETALLES E INTERACCIÓN: ${motion}; componentes solicitados:
${chosen}
6. PANTALLA: ${device}.

CRITERIOS:
- Jerarquía tipográfica consistente, diseño responsive, componentes reutilizables y contraste WCAG AA.
- Incluye estados hover, focus, pressed, disabled, vacío, carga, error y confirmación cuando apliquen.
- Usa etiquetas accesibles y navegación por teclado. Respeta prefers-reduced-motion.
- No inventes reseñas, imágenes de clientes, estadísticas ni información comercial real.
- Evita efectos costosos y dependencias innecesarias; optimiza para móviles modestos.
- ${safeguard}
- Ejecuta pruebas y compilación y documenta archivos cambiados.

ENTREGA: implementación real y verificable, no solo un mockup o una descripción.`
}
