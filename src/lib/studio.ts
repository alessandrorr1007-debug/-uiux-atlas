import type { AuditCriterion } from '../data/audit'
import type { SectorPreset } from '../data/sectors'
import type { PhotoStyle } from '../data/photography'
import { components } from '../data/components'

export function buildSectorPrompt(item: SectorPreset): string {
  const names = item.components.map(id => components.find(c=>c.id===id)?.name).filter(Boolean).join(', ')
  return `Diseña ${item.kind === 'web' ? 'un sitio web' : 'una aplicación móvil'} para el rubro de ${item.name}.
PÚBLICO: ${item.audience}.
OBJETIVO: ${item.goal}.
ESTRUCTURA RECOMENDADA: ${names}.
EXPERIENCIA: navegación funcional, responsive, estados vacío/carga/error, tipografía legible, controles accesibles y diseño coherente.
IMPLEMENTACIÓN: primero revisa el proyecto; no inventes datos de negocio ni integraciones; reutiliza componentes y conserva la lógica, las rutas, las cuentas y los servicios existentes.
VALIDACIÓN: comprueba móvil y escritorio, estados de botones, accesibilidad de teclado y compilación. Entrega cambios aplicados y verificables.`
}

export function buildPhotoPrompt(product: string, style: PhotoStyle, ratio: string, finish: string): string {
  const subject = product.trim().slice(0,140) || '[DESCRIBE TU PRODUCTO]'
  return `Genera una fotografía comercial de ${subject}. Dirección creativa: ${style.scene}. Iluminación: ${style.lighting}. Composición: ${style.framing}. Tratamiento visual: ${finish}. Relación de aspecto: ${ratio}. Prioriza materiales, proporciones, identidad y rasgos auténticos del producto de referencia. Fondo visual coherente, imagen nítida, sin marcas añadidas, sin textos inventados y sin productos extra. Si una característica no es visible, no la inventes.`
}

export function buildAuditPrompt(pending: AuditCriterion[]): string {
  if (!pending.length) return ''
  return `Audita y mejora exclusivamente la interfaz de mi proyecto. He identificado manualmente estos problemas:\n${pending.map((x,i)=>`${i+1}. ${x.title}: ${x.detail} Corrección sugerida: ${x.fix}`).join('\n')}\n\nREGLAS: conserva funcionalidades, flujos, autenticación y base de datos existentes; corrige diseño y accesibilidad sin agregar datos ficticios ni promesas comerciales. Verifica móviles, escritorio, teclado, contrastes, rendimiento, pruebas y compilación. Resume los cambios y cómo comprobarlos.`
}
