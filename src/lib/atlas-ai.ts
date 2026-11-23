import { components } from '../data/components'
import type { ComponentInfo, ToolId } from '../types'
import { normalizeText } from './catalog'
import { buildPrompt } from './prompt'

export type AtlasMode = 'create' | 'improve'
export type AtlasImage = { id: string; name: string; dataUrl: string; palette: string[] }
export type SiteInfo = { url: string; title: string; description: string; warning: string; headings?: string[]; excerpt?: string }
export type GitHubRepositoryInfo = {
  url: string
  name: string
  owner: string
  branch: string
  description: string
  frameworks: string[]
  fileCount: number
  files: { path: string; kind: string }[]
  inspected: 'source_code_only'
  truncated: boolean
  warning: string
}
export function isGitHubLink(value: string): boolean {
  try { return new URL(value.trim()).hostname.toLowerCase() === 'github.com' } catch { return false }
}
export type AtlasMessage = { role: 'user' | 'assistant'; content: string; attachments?: string[] }
export type AtlasReply = { reply: string; patternIds: string[]; palette: string[]; prompt: string; site?: SiteInfo | null; repository?: GitHubRepositoryInfo | null; websiteNotice?: string }

const boosts: readonly [RegExp, readonly string[]][] = [
  [/polleria|restaurante|comida|delivery|hamburguesa|cafeteria/,['product-card','hero-section','cart-drawer','product-gallery','sticky-add-to-cart','checkout-steps']],
  [/tienda|producto|compras|catalogo|ecommerce/,['product-card','faceted-filters','product-detail-page','cart-drawer','filter-chips']],
  [/futurista|elegante|premium|moderna|modernizar|tecnologia/,['bento-grid','glassmorphism','mesh-gradient','premium-dark','microinteractions']],
  [/academia|universidad|curso|estudiantes|educacion/,['education-course-progress-tracker','education-grade-breakdown','tabs','calendar-view','stat-cards']],
  [/panel|dashboard|metricas|estadistica|finanzas/,['stat-cards','data-table','line-chart','data-visualization-heatmap']],
  [/app|aplicacion|movil|android/,['bottom-navigation','bottom-sheet','mobile-drawer','onboarding']],
  [/redisen|mejorar|ux|usabilidad/,['bento-grid','sticky-navbar','accordion','skeleton-loading']]
]

export function suggestAtlasPatterns(request: string, selectedIds: string[] = [], max = 7): ComponentInfo[] {
  const text = normalizeText(request)
  const words = text.split(/[^a-z0-9]+/).filter(word => word.length > 3).slice(0,45)
  const hints = new Set(boosts.filter(([regex])=>regex.test(text)).flatMap(([,ids])=>ids))
  const chosen = new Set(selectedIds)
  const ranked = components.map(item => {
    let score = (chosen.has(item.id)?100:0)+(hints.has(item.id)?30:0)
    const name = normalizeText(item.name)
    const detail = normalizeText(item.description + ' ' + item.useCase)
    for (const word of words) score += name.includes(word)?8:detail.includes(word)?2:0
    return {item,score}
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).map(x=>x.item)
  for (const id of ['hero-section','bento-grid','product-card','sticky-navbar','bottom-navigation','accordion','mobile-drawer']) {
    if (ranked.length>=max) break
    const item=components.find(candidate=>candidate.id===id)
    if(item&&!ranked.some(candidate=>candidate.id===id)) ranked.push(item)
  }
  return ranked.slice(0,max)
}

export function composeAtlasPrompt(
  mode: AtlasMode,
  description: string,
  selectedIds: string[],
  tool: ToolId,
  colors: string[],
  site?: SiteInfo | null,
  repository?: GitHubRepositoryInfo | null
): string {
  const chosen=components.filter(item=>selectedIds.includes(item.id)).slice(0,16)
  const items=chosen.length?chosen:suggestAtlasPatterns(description, [], 6)
  const project=description.trim().slice(0,2300) || (mode==='create'?'nuevo proyecto digital':'rediseño de una web existente')
  const intro=mode==='create'
    ? 'Diseña e implementa este proyecto desde cero. Define las secciones y las funcionalidades necesarias, priorizando un MVP útil.'
    : 'Audita y mejora la experiencia visual de este proyecto existente. Revisa el código y conserva estrictamente autenticación, rutas, APIs, base de datos, integraciones, pagos y lógica de negocio. No elimines funciones existentes.'
  const siteText=site?.url
    ? '\nREFERENCIA PÚBLICA: '+site.url+'; '+(site.title||'sin título')+'. Lectura HTML preliminar, no inspección visual confirmada.'
    : ''
  const repoText=repository?.url
    ? '\nREPOSITORIO GITHUB PÚBLICO: '+repository.url+
      '\nRama: '+repository.branch+
      '\nTecnologías identificadas: '+(repository.frameworks.join(', ')||'sin confirmar')+
      '\nArchivos de interfaz leídos: '+repository.files.map(f=>f.path).slice(0,8).join(', ')+
      '\nAl implementar, inspecciona estos archivos y confirma el resultado visual. Esta revisión fue estática y parcial; no se ejecutó ni renderizó el proyecto. No afirmes fallos que no has comprobado.'
    : ''
  const palette=colors.length?'\nPALETA SUGERIDA (extraída aproximadamente de las imágenes o seleccionada): '+colors.join(', ')+'. Mantén contraste suficiente.':''
  const componentText=buildPrompt(items,{
    project, audience:'usuarios de este proyecto', style:'profesional y coherente con las referencias proporcionadas',
    theme:'Ambos',keepLogic:mode==='improve',tool,
    structure:'layout adaptable y jerarquía clara',hero:'portada acorde al sector',
    motion:'microinteracciones discretas',device:'Móvil y escritorio'
  })
  return 'INSTRUCCIONES PARA '+tool.toUpperCase()+'\n'+intro+'\n\nSOLICITUD DEL USUARIO:\n'+project+siteText+repoText+palette+
    '\n\n'+componentText+'\n\nAntes de inventar datos comerciales, precios, reseñas, disponibilidad o características que no se conocen, utiliza marcadores claros y solicita la información que falte. No asumas que una URL pública concede acceso al código.'
}

export function extractApproxPalette(canvas: HTMLCanvasElement): string[] {
  const context=canvas.getContext('2d',{willReadFrequently:true})
  if (!context) return []
  const {width,height}=canvas
  const pixels=context.getImageData(0,0,width,height).data
  const counts=new Map<string,number>()
  const stride=Math.max(4,Math.floor(width*height/1500))*4
  for(let i=0;i<pixels.length;i+=stride) {
    const [r,g,b,a]=[pixels[i],pixels[i+1],pixels[i+2],pixels[i+3]]
    if(a<210 || (r>245&&g>245&&b>245) || (r<16&&g<16&&b<16)) continue
    const hex='#'+[r,g,b].map(v=>Math.min(255,Math.round(v/32)*32).toString(16).padStart(2,'0')).join('').toUpperCase()
    counts.set(hex,(counts.get(hex)||0)+1)
  }
  return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([color])=>color)
}

export function describeAtlasRequestError(error: unknown): string {
  const failure=error instanceof Error?error.message:'Fallo al consultar Atlas IA.'
  if(error instanceof Error&&(error.name==='TimeoutError'||error.name==='AbortError'))
    return 'La consulta tardó demasiado. Prueba a enviar primero una imagen o analiza el repositorio por separado.'
  if(/failed to fetch|networkerror|network request failed|load failed|connection lost/i.test(failure))
    return 'No se recibió respuesta de Netlify. Comprueba la conexión y reintenta con menos imágenes.'
  return failure
}

export const ATLAS_IMAGE_DATA_URL_LIMIT=320_000

export async function prepareAtlasImage(file: File): Promise<AtlasImage> {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Usa una imagen JPG, PNG o WebP.')
  if (file.size > 8_000_000) throw new Error('La imagen supera 8 MB. Elige una más pequeña.')
  const image=await createImageBitmap(file)
  try {
    let palette:string[]=[]
    let dataUrl=''
    // Keep three images below ~1 MB combined. Re-render directly from the
    // original bitmap if needed, preserving more detail than repeated scaling.
    for(const [side,quality] of [[960,.72],[840,.69],[740,.65],[640,.60]]){
      const scale=Math.min(1,side/Math.max(image.width,image.height))
      const canvas=document.createElement('canvas')
      canvas.width=Math.max(1,Math.round(image.width*scale))
      canvas.height=Math.max(1,Math.round(image.height*scale))
      const ctx=canvas.getContext('2d')
      if(!ctx)throw new Error('No se pudo procesar la imagen.')
      ctx.fillStyle='#ffffff'
      ctx.fillRect(0,0,canvas.width,canvas.height)
      ctx.drawImage(image,0,0,canvas.width,canvas.height)
      if(!palette.length)palette=extractApproxPalette(canvas)
      dataUrl=canvas.toDataURL('image/jpeg',quality)
      if(dataUrl.length<=ATLAS_IMAGE_DATA_URL_LIMIT)break
    }
    if(dataUrl.length>ATLAS_IMAGE_DATA_URL_LIMIT)
      throw new Error('La imagen sigue siendo demasiado grande. Recórtala antes de enviarla.')
    return {id:String(Date.now())+'-'+Math.random().toString(36).slice(2),name:file.name.slice(0,75),dataUrl,palette}
  } finally { image.close() }
}
