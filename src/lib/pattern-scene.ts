import type { ComponentInfo } from '../types'

/**
 * Every catalog entry receives its OWN deterministic visual specification.
 * The renderer uses recognizable screen archetypes with per-pattern copy,
 * per-pattern composition and seeded shapes instead of an eight-category fallback.
 * These are illustrative wireframes, not screenshots of an existing product.
 */
export type SceneKind =
  | 'sidebar' | 'navbar' | 'tabs' | 'menu' | 'steps' | 'tree' | 'search'
  | 'hero' | 'grid' | 'columns' | 'dashboard' | 'cards' | 'editor'
  | 'chart' | 'table' | 'calendar' | 'kanban' | 'timeline' | 'map' | 'heatmap'
  | 'form' | 'choice' | 'slider' | 'upload' | 'auth'
  | 'product' | 'cart' | 'checkout' | 'pricing' | 'receipt' | 'offer'
  | 'alert' | 'progress' | 'status' | 'empty'
  | 'canvas' | 'gesture' | 'motion' | 'article' | 'media' | 'chat' | 'quiz'

export type PatternScene = {
  id: string
  kind: SceneKind
  variation: number
  seed: number
  heading: string
  supporting: string
  feature: string
  emphasis: string
}

const exact: Record<string, SceneKind> = {
  sidebar:'sidebar', 'sticky-navbar':'navbar', 'bottom-navigation':'navbar', 'mega-menu':'menu',
  breadcrumbs:'steps', tabs:'tabs', 'command-palette':'search', pagination:'steps',
  'step-navigation':'steps', 'mobile-drawer':'sidebar',
  'bento-grid':'grid', 'hero-section':'hero', 'split-layout':'columns','masonry-grid':'grid',
  'card-grid':'cards','dashboard-shell':'dashboard','master-detail':'columns',
  'resizable-panels':'columns','sticky-section':'article','responsive-columns':'columns',
  'stat-cards':'dashboard','data-table':'table','analytics-dashboard':'dashboard',
  'line-chart':'chart','bar-chart':'chart','donut-chart':'chart',
  'kanban-board':'kanban',timeline:'timeline','calendar-view':'calendar','activity-feed':'timeline',
  'text-input':'form','search-field':'search','select-dropdown':'choice',
  'multi-select':'choice','toggle-switch':'choice','checkbox-group':'choice','radio-group':'choice',
  'form-wizard':'steps','date-picker':'calendar','file-uploader':'upload',
  'product-card':'product','product-gallery':'product','cart-drawer':'cart',
  'checkout-steps':'checkout','pricing-table':'pricing','discount-badge':'offer',
  'quantity-selector':'cart','filter-chips':'search','review-summary':'status','order-tracker':'timeline',
  toast:'alert','alert-banner':'alert',modal:'alert','skeleton-loading':'progress',
  'empty-state':'empty','progress-bar':'progress','status-badge':'status',
  'inline-validation':'form','confirmation-dialog':'alert','success-screen':'status',
  'hover-effects':'motion',microinteractions:'motion','scroll-reveal':'motion',
  'animated-counter':'dashboard','page-transition':'motion','drag-and-drop':'gesture',
  carousel:'media',parallax:'motion','button-loading':'progress','expand-collapse':'tabs',
  accordion:'tabs','testimonial-card':'cards','feature-list':'cards',
  'comparison-table':'table','code-block':'editor',tooltip:'alert',popover:'menu',
  'avatar-stack':'status','faq-section':'article','onboarding-tour':'steps',
  'zigzag-layout':'columns', 'glassmorphism':'cards', 'mesh-gradient':'hero',
  'custom-cursor':'gesture', 'text-reveal':'motion'
}

const rules: readonly [RegExp, SceneKind][] = [
  [/heatmap|cohort|matrix|geographic heat|retention/i,'heatmap'],
  [/map|geofence|geo|route planner|nearby|location|radius search|street view|floor plan|route eta/i,'map'],
  [/kanban|task depend|approval queue|task builder/i,'kanban'],
  [/calendar|date picker|time picker|timetable|attendance|availability grid|delivery slot/i,'calendar'],
  [/barcode|scanner|qr|camera|image annotation|cropper|hotspots/i,'media'],
  [/scatter|bubble|radar|funnel|waterfall|candlestick|sunburst|sankey|treemap|gauge|box plot|chart|graph|forecast|anomaly|legend/i,'chart'],
  [/pivot|table|grid|column|row|bulk selection|data export|history|sessions|role-based|stock adjustment/i,'table'],
  [/billing|invoice|receipt|refund|payment|cash tender|checkout|order summary|split payment/i,'receipt'],
  [/paywall|plan selector|proration|subscription|seat quantity|renewal|upgrade|credit balance/i,'pricing'],
  [/wishlist|product|variant|stock availability|shipping|returns|bundle|size guide|catalog|quick sale/i,'product'],
  [/cart|coupon|quantity|stepper|weighted product/i,'cart'],
  [/email verification|passkey|biometric|two-factor|password reset|account recovery|consent|permission|password strength|code input|otp/i,'auth'],
  [/search|query|filter|sort|match|autocomplete|lookup/i,'search'],
  [/editor|markdown|code|syntax|formula|diff viewer|split editor|document|mention|slash command/i,'editor'],
  [/canvas|diagram|node|connection handle|alignment|snap-to-grid|lasso|layer|inspector|undo\/redo|comment pins/i,'canvas'],
  [/image|video|audio|media|pdf|player|lightbox|waveform|thumbnail|before\/after|360/i,'media'],
  [/chat|streaming|prompt|model picker|tool execution|agent task|context attachment/i,'chat'],
  [/lesson|quiz|flashcard|grade|course|assignment|learning path|certificate|peer review/i,'quiz'],
  [/toast|error|notice|alert|offline|sync|connection|retry|conflict|rate limit|maintenance|outage|announcement/i,'alert'],
  [/progress|meter|loading|countdown|target vs actual/i,'progress'],
  [/status|indicator|presence|session|success|threshold|badge|proof|trust|review/i,'status'],
  [/empty|no-results|blank/i,'empty'],
  [/slider|picker|range|color|ratio|zoom/i,'slider'],
  [/file|upload|dropzone|submission/i,'upload'],
  [/switch|toggle|radio|checkbox|tag|combobox|mask|input|form|field|signature|currency|phone number/i,'form'],
  [/navigation|navbar|app bar|dock|rail|toolbar|switcher|jump link/i,'navbar'],
  [/sidebar|aside|drawer|panel|inspector/i,'sidebar'],
  [/breadcrumb|step|wizard|tour|flow|recovery/i,'steps'],
  [/tab|segmented|expand|accordion|read.more/i,'tabs'],
  [/menu|popover|dropdown|context/i,'menu'],
  [/tree|outline|index|table of contents/i,'tree'],
  [/hero|landing|campaign|banner|cover/i,'hero'],
  [/dashboard|kpi|stat|metric|analytics|report/i,'dashboard'],
  [/mosaic|bento|masonry|subgrid|card stack|grid layout/i,'grid'],
  [/column|three-pane|layout|responsive|split|focus mode|holy grail/i,'columns'],
  [/card|testimonial|story|feature|case study/i,'cards'],
  [/pricing|lead|offer|discount|signup|newsletter/i,'offer'],
  [/article|quote|reading|footnote|citation|glossary|bibliography|documentation|content/i,'article'],
  [/swipe|drag|gesture|haptic|pull-up|long-press|cursor/i,'gesture'],
  [/animation|motion|transition|scroll|parallax|hover|reveal/i,'motion']
]

const categoryFallback: Record<ComponentInfo['category'], SceneKind> = {
  navigation:'navbar',layouts:'grid',data:'dashboard',forms:'form',
  commerce:'product',feedback:'alert',motion:'motion',content:'article'
}

export function resolveSceneKind(item: ComponentInfo): SceneKind {
  const direct=exact[item.id]
  if (direct) return direct
  const text=(item.name+' '+item.id).toLowerCase()
  for (const [pattern,kind] of rules) if(pattern.test(text)) return kind
  return categoryFallback[item.category]
}

export function hashPatternId(id: string): number {
  let code=2166136261
  for (let index=0;index<id.length;index++) {
    code=Math.imul(code ^ id.charCodeAt(index),16777619)
  }
  return code>>>0
}

export function createPatternScene(item: ComponentInfo): PatternScene {
  const seed=hashPatternId(item.id)
  const words=item.name.replace(/([a-z])([A-Z])/g,'$1 $2').split(/\s+/).filter(Boolean)
  const heading=item.name.length>29?item.name.slice(0,27)+'…':item.name
  const supporting=item.description.length>56?item.description.slice(0,53)+'…':item.description
  const feature=(words[words.length-1] || 'UI').replace(/[^a-zA-ZÁÉÍÓÚáéíóú0-9]/g,'').slice(0,18)
  const emphasis=item.family?.replace(/-/g,' ') ?? item.category
  return {id:item.id,kind:resolveSceneKind(item),variation:seed%5,seed,heading,supporting,feature,emphasis}
}

export const sceneGuides: Record<SceneKind,string> = {
  sidebar:'Guía de zonas laterales, selección y contenido principal.',
  navbar:'Vista de navegación con destino activo y jerarquía.',
  tabs:'Vista de pestañas y área de información intercambiable.',
  menu:'Menú contextual con acciones agrupadas.',
  steps:'Proceso dividido en etapas o rutas de navegación.',
  tree:'Árbol jerárquico de páginas y elementos.',
  search:'Consulta, filtros y resultados agrupados.',
  hero:'Portada con mensaje, propuesta de valor y llamada a la acción.',
  grid:'Distribución visual de bloques y tarjetas de distinto tamaño.',
  columns:'Paneles que separan información y área de trabajo.',
  dashboard:'Indicadores y resumen de información clave.',
  cards:'Tarjetas de contenido que comparten estructura.',
  editor:'Superficie de edición con barra de herramientas.',
  chart:'Representación de datos con una gráfica adaptada.',
  table:'Filas, columnas y estados para consultar registros.',
  calendar:'Vista temporal de fechas, sesiones o eventos.',
  kanban:'Tareas organizadas en columnas por estado.',
  timeline:'Eventos mostrados como una secuencia ordenada.',
  map:'Plano esquemático con puntos, zonas o recorridos.',
  heatmap:'Celdas de intensidad para comparar valores.',
  form:'Campos con etiquetas y acciones de formulario.',
  choice:'Opciones y selección de una preferencia.',
  slider:'Control de rango o valor visual ajustable.',
  upload:'Zona de selección y previsualización de archivos.',
  auth:'Acceso, verificación o confirmación de identidad.',
  product:'Ficha comercial con imagen, descripción y acciones.',
  cart:'Resumen de productos, cantidades y subtotal.',
  checkout:'Compra organizada en un proceso de pasos.',
  pricing:'Comparación de alternativas, niveles o consumo.',
  receipt:'Resumen detallado de una operación.',
  offer:'Oferta o llamada a la acción comercial.',
  alert:'Aviso de confirmación, error o estado.',
  progress:'Avance de tarea con indicadores visibles.',
  status:'Estado identificable con etiqueta y detalle.',
  empty:'Pantalla sin resultados y acción para continuar.',
  canvas:'Superficie de nodos o edición en un lienzo.',
  gesture:'Elementos preparados para gestos o movimiento.',
  motion:'Representación de estados y transiciones.',
  article:'Bloques de texto jerarquizado para lectura.',
  media:'Reproductor, fotografía o documento en contexto.',
  chat:'Conversación con respuestas y área de escritura.',
  quiz:'Actividad educativa con pregunta y opciones.'
}
