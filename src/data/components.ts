import { categories, type CategoryId, type ComponentInfo, type PreviewKind } from '../types'

type Row = readonly [id: string, name: string, description: string, useCase: string]
const rows: Record<CategoryId, readonly Row[]> = {
  navigation: [
    ['sidebar', 'Sidebar', 'Menú lateral con secciones y rutas persistentes.', 'Aplicaciones de escritorio y paneles administrativos.'],
    ['sticky-navbar', 'Sticky Navbar', 'Barra superior que permanece visible al desplazarse.', 'Sitios con múltiples secciones.'],
    ['bottom-navigation', 'Bottom Navigation', 'Accesos principales al pie de la pantalla.', 'Aplicaciones móviles.'],
    ['mega-menu', 'Mega Menu', 'Menú desplegable con grupos, categorías y enlaces.', 'Portales y tiendas con muchas categorías.'],
    ['breadcrumbs', 'Breadcrumbs', 'Ruta de navegación que muestra la jerarquía actual.', 'Documentación y catálogos.'],
    ['tabs', 'Tabs', 'Pestañas para alternar vistas relacionadas.', 'Perfiles, ajustes y detalles.'],
    ['command-palette', 'Command Palette', 'Buscador unificado de páginas y comandos.', 'Herramientas para usuarios avanzados.'],
    ['pagination', 'Pagination', 'Navegación entre páginas de resultados.', 'Listados y búsquedas grandes.'],
    ['step-navigation', 'Step Navigation', 'Navegación secuencial entre pasos de un proceso.', 'Onboarding y configuración.'],
    ['mobile-drawer', 'Mobile Drawer', 'Panel lateral que aparece sobre el contenido en móvil.', 'Menús compactos en pantallas pequeñas.']
  ],
  layouts: [
    ['bento-grid', 'Bento Grid', 'Cuadrícula de tarjetas con tamaños y jerarquías distintas.', 'Landing pages y portafolios.'],
    ['hero-section', 'Hero Section', 'Zona de portada con propuesta de valor y llamada a la acción.', 'Páginas comerciales.'],
    ['split-layout', 'Split Layout', 'Composición de dos columnas para explicar y demostrar.', 'Presentación de funciones y productos.'],
    ['masonry-grid', 'Masonry Grid', 'Cuadrícula de elementos de alturas variables.', 'Galerías y colecciones.'],
    ['card-grid', 'Card Grid', 'Conjunto de tarjetas consistente y adaptable.', 'Cursos, proyectos y artículos.'],
    ['dashboard-shell', 'Dashboard Shell', 'Estructura con navegación, cabecera y contenido principal.', 'Sistemas administrativos.'],
    ['master-detail', 'Master Detail', 'Lista maestra y vista de detalle vinculadas.', 'Correo, clientes y registros.'],
    ['resizable-panels', 'Resizable Panels', 'Paneles que pueden ajustar su anchura.', 'Editores y herramientas profesionales.'],
    ['sticky-section', 'Sticky Section', 'Sección que permanece anclada durante parte del scroll.', 'Narrativas visuales y documentación.'],
    ['responsive-columns', 'Responsive Columns', 'Columnas que cambian según el espacio disponible.', 'Cualquier interfaz multidispositivo.']
  ],
  data: [
    ['stat-cards', 'Stat Cards', 'Tarjetas compactas para cifras y tendencias.', 'Indicadores clave del negocio.'],
    ['data-table', 'Data Table', 'Tabla de datos con columnas y acciones.', 'Administración de inventarios.'],
    ['analytics-dashboard', 'Analytics Dashboard', 'Panel de métricas, tendencias y comparaciones.', 'Analítica de productos y ventas.'],
    ['line-chart', 'Line Chart', 'Gráfico para evolución temporal de una métrica.', 'Tráfico e ingresos por período.'],
    ['bar-chart', 'Bar Chart', 'Barras para comparar valores entre categorías.', 'Informes de rendimiento.'],
    ['donut-chart', 'Donut Chart', 'Gráfico circular para proporciones de un total.', 'Segmentos y distribución.'],
    ['kanban-board', 'Kanban Board', 'Tablero de tarjetas agrupadas por estado.', 'Gestión visual de tareas.'],
    ['timeline', 'Timeline', 'Secuencia cronológica de eventos relevantes.', 'Historial y auditoría.'],
    ['calendar-view', 'Calendar View', 'Visualización de actividades por fecha.', 'Reservas, horario y planificación.'],
    ['activity-feed', 'Activity Feed', 'Lista ordenada de eventos recientes.', 'Notificaciones e historial de cambios.']
  ],
  forms: [
    ['text-input', 'Text Input', 'Campo de texto con etiqueta, ayuda y errores.', 'Registro y captura de datos.'],
    ['search-field', 'Search Field', 'Entrada optimizada para búsquedas y sugerencias.', 'Exploración de información.'],
    ['select-dropdown', 'Select Dropdown', 'Lista de opciones para elegir un valor.', 'Preferencias y formularios.'],
    ['multi-select', 'Multi Select', 'Selector de varios elementos con etiquetas.', 'Filtros avanzados.'],
    ['toggle-switch', 'Toggle Switch', 'Interruptor binario para opciones inmediatas.', 'Configuración de una función.'],
    ['checkbox-group', 'Checkbox Group', 'Opciones múltiples con selección independiente.', 'Filtros y permisos.'],
    ['radio-group', 'Radio Group', 'Opciones excluyentes entre sí.', 'Decisiones de una sola alternativa.'],
    ['form-wizard', 'Form Wizard', 'Formulario dividido en etapas con validación.', 'Inscripción y procesos extensos.'],
    ['date-picker', 'Date Picker', 'Control para elegir fechas fácilmente.', 'Reservas y planificación.'],
    ['file-uploader', 'File Uploader', 'Zona de selección o arrastre de archivos.', 'Adjuntar documentos e imágenes.']
  ],
  commerce: [
    ['product-card', 'Product Card', 'Tarjeta con producto, precio e intención de compra.', 'Catálogos y comercios electrónicos.'],
    ['product-gallery', 'Product Gallery', 'Galería de imágenes ampliables de un producto.', 'Fichas de producto.'],
    ['cart-drawer', 'Cart Drawer', 'Carrito lateral editable sin salir del catálogo.', 'Tiendas online.'],
    ['checkout-steps', 'Checkout Steps', 'Proceso de compra guiado y verificable.', 'Pedidos y pagos.'],
    ['pricing-table', 'Pricing Table', 'Comparación clara entre planes y beneficios.', 'Software como servicio.'],
    ['discount-badge', 'Discount Badge', 'Etiqueta pequeña para promociones verificadas.', 'Ofertas comerciales.'],
    ['quantity-selector', 'Quantity Selector', 'Control de unidades con límites válidos.', 'Añadir productos al carrito.'],
    ['filter-chips', 'Filter Chips', 'Filtros en forma de etiquetas seleccionables.', 'Búsqueda de productos.'],
    ['review-summary', 'Review Summary', 'Resumen de reseñas y valoración.', 'Decisiones de compra informadas.'],
    ['order-tracker', 'Order Tracker', 'Seguimiento visual de etapas de un pedido.', 'Comercio y logística.']
  ],
  feedback: [
    ['toast', 'Toast', 'Aviso discreto que confirma acciones o errores.', 'Notificaciones breves.'],
    ['alert-banner', 'Alert Banner', 'Mensaje contextual importante dentro del contenido.', 'Avisos que deben permanecer visibles.'],
    ['modal', 'Modal', 'Diálogo enfocado para una decisión o edición.', 'Confirmaciones y formularios rápidos.'],
    ['skeleton-loading', 'Skeleton Loading', 'Marcadores de posición durante la carga.', 'Interfaces con datos asíncronos.'],
    ['empty-state', 'Empty State', 'Vista explicativa cuando no existen resultados.', 'Carritos vacíos o listas sin datos.'],
    ['progress-bar', 'Progress Bar', 'Barra que representa avance cuantificable.', 'Carga de archivos y procesos.'],
    ['status-badge', 'Status Badge', 'Indicador textual del estado de un registro.', 'Pagos, pedidos y aprobación.'],
    ['inline-validation', 'Inline Validation', 'Errores y ayudas junto al campo pertinente.', 'Formularios con validación.'],
    ['confirmation-dialog', 'Confirmation Dialog', 'Confirmación explícita para una acción delicada.', 'Eliminar o descartar cambios.'],
    ['success-screen', 'Success Screen', 'Vista final que confirma y orienta siguientes pasos.', 'Compras, registros y solicitudes.']
  ],
  motion: [
    ['hover-effects', 'Hover Effects', 'Respuestas visuales al pasar el puntero.', 'Elementos clicables de escritorio.'],
    ['microinteractions', 'Microinteractions', 'Pequeñas reacciones a cambios de estado.', 'Botones, guardado y navegación.'],
    ['scroll-reveal', 'Scroll Reveal', 'Entrada progresiva de contenido al desplazarse.', 'Presentaciones de producto.'],
    ['animated-counter', 'Animated Counter', 'Transición de valores numéricos.', 'Métricas y cifras clave.'],
    ['page-transition', 'Page Transition', 'Cambio suave entre vistas sin perder contexto.', 'Aplicaciones con varias rutas.'],
    ['drag-and-drop', 'Drag and Drop', 'Mover elementos con arrastre y alternativas accesibles.', 'Tableros y organizadores.'],
    ['carousel', 'Carousel', 'Colección navegable de contenido horizontal.', 'Testimonios y galerías.'],
    ['parallax', 'Parallax', 'Capas visuales con desplazamiento a velocidades diferentes.', 'Portadas editoriales.'],
    ['button-loading', 'Loading Button', 'Botón que refleja una acción en curso.', 'Guardar o enviar formularios.'],
    ['expand-collapse', 'Expand / Collapse', 'Expansión fluida de paneles de información.', 'Preguntas frecuentes y detalles.']
  ],
  content: [
    ['accordion', 'Accordion', 'Bloques de información desplegables.', 'Preguntas frecuentes.'],
    ['testimonial-card', 'Testimonial Card', 'Tarjeta para presentar una opinión con contexto.', 'Testimonios verificados.'],
    ['feature-list', 'Feature List', 'Listado visual de funciones y beneficios.', 'Páginas de productos digitales.'],
    ['comparison-table', 'Comparison Table', 'Comparación por características.', 'Evaluación de planes o herramientas.'],
    ['code-block', 'Code Block', 'Bloque legible con código y opción de copiar.', 'Documentación de desarrolladores.'],
    ['tooltip', 'Tooltip', 'Pista breve asociada a un elemento.', 'Explicaciones de iconos y controles.'],
    ['popover', 'Popover', 'Panel flotante con información contextual.', 'Acciones secundarias.'],
    ['avatar-stack', 'Avatar Stack', 'Conjunto compacto de personas o participantes.', 'Equipos y colaboraciones.'],
    ['faq-section', 'FAQ Section', 'Sección completa de preguntas y respuestas.', 'Soporte y páginas comerciales.'],
    ['onboarding-tour', 'Onboarding Tour', 'Guía contextual de primeras acciones.', 'Primer uso de aplicaciones.']
  ]
}

const recommendations: Record<CategoryId, string> = {
  navigation: 'Incluye estado activo, navegación con teclado, foco visible y versión móvil.',
  layouts: 'Respeta jerarquía tipográfica, espaciado consistente y adaptación responsive.',
  data: 'Incluye estados vacíos y datos de ejemplo claramente identificados; no inventes métricas reales.',
  forms: 'Usa etiquetas reales, validación clara, errores accesibles y estados deshabilitados.',
  commerce: 'Asegura precios consistentes, acciones funcionales y estados de carrito coherentes.',
  feedback: 'Comunica resultados con claridad; usa ARIA live y evita interrumpir innecesariamente.',
  motion: 'Optimiza rendimiento, respeta prefers-reduced-motion y nunca bloquees acciones.',
  content: 'Organiza información legible, accesible, útil y bien jerarquizada.'
}

export const components: ComponentInfo[] = categories.flatMap(category =>
  rows[category.id].map(([id, name, description, useCase]) => ({
    id,
    name,
    description,
    category: category.id,
    preview: category.id as PreviewKind,
    useCase,
    guidance: recommendations[category.id]
  }))
)

export function getComponent(id: string) {
  return components.find(item => item.id === id)
}
