import type { ComponentInfo, PromptConfig } from '../types'

export function buildPrompt(items: ComponentInfo[], config: PromptConfig): string {
  const project = config.project.trim() || 'mi aplicación web'
  if (items.length === 0) return ''
  const descriptions = items.map((item, index) =>
    `${index + 1}. ${item.name}: ${item.description} ${item.guidance}`
  ).join('\n')
  const safeguard = config.keepLogic
    ? 'No modifiques autenticación, lógica de negocio, APIs, base de datos, rutas, contratos ni funciones existentes. Limita los cambios a UI/UX salvo correcciones imprescindibles y explícitamente justificadas.'
    : 'Integra los componentes con la arquitectura existente y explica cualquier cambio funcional.'
  return `Actúa como diseñador UI/UX senior y desarrollador frontend especializado en ${config.tool}.

PROYECTO: ${project}.
OBJETIVO: implementar los siguientes componentes de forma coherente y funcional:
${descriptions}

ESTILO: ${config.style}. TEMA: ${config.theme}.
REQUISITOS:
- Diseño responsive, accesible (teclado, foco visible, etiquetas ARIA y contraste) y rápido en móviles modestos.
- Componentes reutilizables, estados reales (vacío, cargando, error, éxito), navegación y acciones funcionales.
- Microinteracciones discretas, respetando prefers-reduced-motion.
- Evita elementos decorativos que no funcionen, datos falsos, dependencias innecesarias y estilos inconsistentes.
- ${safeguard}
- Valida compilación y pruebas, y resume archivos modificados y cómo verificar los resultados.

ENTREGA: código implementado y comprobable, no solamente una propuesta visual.`
}
