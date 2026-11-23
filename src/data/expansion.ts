import type { ComponentInfo, CategoryId } from '../types'

/**
 * UIUX Atlas: 288 nuevos patrones organizados en 24 familias de 12 entradas.
 * Nombres técnicos y explicaciones originales. Identificadores estables.
 * Cada elemento tiene una maqueta individual en PatternVisual; algunas entradas incluyen demo interactiva.
 */
export type ExpansionFamily = {
  id: string
  label: string
  category: CategoryId
  kind: 'component' | 'pattern' | 'visualization' | 'interaction'
  context: string
  rule: string
  patterns: readonly (readonly [name: string, description: string])[]
}

export const expansionFamilies: readonly ExpansionFamily[] = [
  {
    "id": "navigation-advanced",
    "label": "Navegación avanzada",
    "category": "navigation",
    "kind": "component",
    "context": "Herramientas de navegación en aplicaciones con múltiples espacios y destinos",
    "rule": "Mantén la ubicación actual visible y ofrece interacción por teclado",
    "patterns": [
      [
        "Navigation Rail",
        "Barra vertical compacta con accesos principales e indicadores de selección."
      ],
      [
        "Context Menu",
        "Menú de acciones relacionadas con el elemento seleccionado."
      ],
      [
        "Overflow Menu",
        "Agrupa acciones secundarias que no caben en la barra principal."
      ],
      [
        "App Switcher",
        "Permite cambiar entre aplicaciones dentro de un mismo ecosistema."
      ],
      [
        "Workspace Switcher",
        "Cambia entre equipos, proyectos o entornos de trabajo."
      ],
      [
        "Jump Links",
        "Enlaces directos a apartados específicos de una página."
      ],
      [
        "Section Index",
        "Índice navegable que refleja la estructura del contenido."
      ],
      [
        "Tree Navigation",
        "Navegación jerárquica con nodos expandibles y contraíbles."
      ],
      [
        "Secondary Navigation",
        "Navegación adicional dentro de una sección principal."
      ],
      [
        "Floating Navigation Dock",
        "Accesos flotantes y compactos a herramientas frecuentes."
      ],
      [
        "Quick Access Toolbar",
        "Agrupa comandos recurrentes para ejecutarlos rápidamente."
      ],
      [
        "Notification Center",
        "Centro unificado para consultar y administrar notificaciones."
      ]
    ]
  },
  {
    "id": "interface-layouts",
    "label": "Estructuras de interfaz",
    "category": "layouts",
    "kind": "pattern",
    "context": "Pantallas complejas, escritorios y aplicaciones profesionales",
    "rule": "Verifica el reflujo responsive y evita desbordamientos",
    "patterns": [
      [
        "Holy Grail Layout",
        "Estructura con cabecera, pie y contenido central flanqueado por columnas."
      ],
      [
        "Mosaic Dashboard",
        "Panel en mosaico cuyas tarjetas admiten diferentes tamaños."
      ],
      [
        "Dockable Panels",
        "Paneles que pueden acoplarse, desacoplarse y reordenarse."
      ],
      [
        "Three-Pane Workspace",
        "Distribución simultánea de lista, contenido e inspector."
      ],
      [
        "Focus Mode Layout",
        "Oculta controles secundarios para priorizar la tarea activa."
      ],
      [
        "Picture-in-Picture Panel",
        "Ventana pequeña superpuesta que conserva una vista en paralelo."
      ],
      [
        "Inspector Panel",
        "Panel contextual con propiedades del elemento elegido."
      ],
      [
        "CSS Subgrid",
        "Alineación de elementos anidados usando pistas de una retícula principal."
      ],
      [
        "Container-Query Layout",
        "Componentes que cambian según el ancho de su contenedor."
      ],
      [
        "Multi-Column Article",
        "Contenido editorial distribuido en columnas equilibradas."
      ],
      [
        "Overlapping Card Stack",
        "Tarjetas superpuestas que muestran profundidad o secuencia."
      ],
      [
        "Sticky Aside",
        "Columna complementaria que permanece a la vista mientras se desplaza."
      ]
    ]
  },
  {
    "id": "reading-content",
    "label": "Contenido y lectura",
    "category": "content",
    "kind": "pattern",
    "context": "Documentación, lectura editorial y portales informativos",
    "rule": "Prioriza lectura, contraste y soporte para teclado",
    "patterns": [
      [
        "Reading Progress Indicator",
        "Señala el porcentaje del artículo recorrido por el lector."
      ],
      [
        "Pull Quote",
        "Resalta una cita breve separada del cuerpo principal."
      ],
      [
        "Drop Cap",
        "Letra inicial ampliada para abrir una sección editorial."
      ],
      [
        "Read-More Text",
        "Revela texto adicional sin navegar a otra página."
      ],
      [
        "Footnote Popover",
        "Muestra notas de referencia cerca del fragmento citado."
      ],
      [
        "Citation Card",
        "Presenta autor, fuente y vínculo de una referencia."
      ],
      [
        "Article Table of Contents",
        "Índice de títulos y secciones de un artículo."
      ],
      [
        "Inline Glossary",
        "Define términos técnicos dentro del texto mediante ayudas."
      ],
      [
        "Documentation Callout",
        "Bloque contextual de advertencia, consejo o información."
      ],
      [
        "Copyable Deep Link",
        "Permite copiar un enlace a una sección específica."
      ],
      [
        "Estimated Reading Time",
        "Comunica una estimación de duración de lectura."
      ],
      [
        "Source Bibliography Panel",
        "Agrupa fuentes citadas para consulta posterior."
      ]
    ]
  },
  {
    "id": "input-controls",
    "label": "Controles de entrada",
    "category": "forms",
    "kind": "component",
    "context": "Formularios con entradas especializadas y validaciones precisas",
    "rule": "Proporciona etiquetas, mensajes de error y alternativas accesibles",
    "patterns": [
      [
        "OTP Code Input",
        "Entrada segmentada para códigos temporales de verificación."
      ],
      [
        "Password Strength Meter",
        "Indica la robustez estimada de una contraseña mientras se escribe."
      ],
      [
        "Password Visibility Toggle",
        "Muestra u oculta temporalmente el contenido de una contraseña."
      ],
      [
        "Input Mask",
        "Da formato orientativo a un valor durante la escritura."
      ],
      [
        "Currency Input",
        "Entrada de importes con formato monetario y validación numérica."
      ],
      [
        "Phone Number Input",
        "Campo telefónico con prefijo internacional y validación."
      ],
      [
        "Address Autocomplete",
        "Propone direcciones a partir de lo escrito por el usuario."
      ],
      [
        "Tag Input",
        "Permite crear y eliminar etiquetas desde un solo campo."
      ],
      [
        "Combobox",
        "Combina entrada editable y selección de opciones sugeridas."
      ],
      [
        "Dual-Handle Range Slider",
        "Selecciona un rango mediante dos controles deslizantes."
      ],
      [
        "Time Picker",
        "Selector de hora compatible con formato horario."
      ],
      [
        "Color Picker",
        "Selector de color con vista previa y código editable."
      ]
    ]
  },
  {
    "id": "form-workflows",
    "label": "Flujos de formularios",
    "category": "forms",
    "kind": "pattern",
    "context": "Procesos de registro, edición y recopilación de datos",
    "rule": "Conserva datos mientras el usuario avanza y resume errores",
    "patterns": [
      [
        "Conditional Fields",
        "Muestra campos distintos según respuestas anteriores."
      ],
      [
        "Repeater Field Group",
        "Permite agregar múltiples grupos de campos similares."
      ],
      [
        "Fieldset",
        "Agrupa controles relacionados bajo una leyenda descriptiva."
      ],
      [
        "Inline Editing",
        "Edita un valor directamente desde su vista de lectura."
      ],
      [
        "Autosave Draft",
        "Guarda borradores mientras el usuario continúa trabajando."
      ],
      [
        "Unsaved Changes Guard",
        "Advierte sobre cambios pendientes antes de abandonar una vista."
      ],
      [
        "Review Before Submit",
        "Ofrece una revisión final antes del envío definitivo."
      ],
      [
        "Error Summary",
        "Resume errores del formulario y enlaza a cada campo."
      ],
      [
        "Signature Pad",
        "Recoge una firma dibujada con puntero o tacto."
      ],
      [
        "Branching Form",
        "Adapta las siguientes preguntas según respuestas previas."
      ],
      [
        "Bulk Edit Form",
        "Actualiza propiedades compartidas por múltiples registros."
      ],
      [
        "Progressive Disclosure Form",
        "Muestra complejidad adicional solo cuando resulta necesaria."
      ]
    ]
  },
  {
    "id": "search-discovery",
    "label": "Búsqueda y descubrimiento",
    "category": "forms",
    "kind": "pattern",
    "context": "Buscadores y catálogos con grandes volúmenes de información",
    "rule": "Expón estados vacíos, filtros activos y resultados claros",
    "patterns": [
      [
        "Fuzzy Search",
        "Encuentra resultados a pesar de errores leves de escritura."
      ],
      [
        "Recent Searches",
        "Permite recuperar búsquedas ejecutadas anteriormente."
      ],
      [
        "Saved Searches",
        "Almacena filtros y consultas para reutilizarlos."
      ],
      [
        "Search Scope Selector",
        "Restringe una búsqueda a un área, tipo o colección."
      ],
      [
        "Query Builder",
        "Compone búsquedas mediante condiciones visuales."
      ],
      [
        "Search Operators",
        "Admite filtros especiales y operadores en la consulta."
      ],
      [
        "Highlighted Matches",
        "Destaca las coincidencias dentro de los resultados."
      ],
      [
        "Grouped Search Results",
        "Organiza coincidencias en grupos por categoría."
      ],
      [
        "No-Results Suggestions",
        "Propone alternativas cuando no hay coincidencias."
      ],
      [
        "Search Correction",
        "Sugiere corregir consultas posiblemente mal escritas."
      ],
      [
        "Filter Presets",
        "Aplica combinaciones de filtros predefinidas."
      ],
      [
        "Sort Control",
        "Cambia el orden de los resultados por un criterio."
      ]
    ]
  },
  {
    "id": "enterprise-tables",
    "label": "Tablas empresariales",
    "category": "data",
    "kind": "component",
    "context": "Grillas extensas y operaciones de administración de registros",
    "rule": "Conserva navegación con teclado y explica ordenaciones",
    "patterns": [
      [
        "Column Pinning",
        "Fija una o más columnas mientras se desplaza la tabla."
      ],
      [
        "Column Visibility",
        "Permite mostrar u ocultar columnas seleccionadas."
      ],
      [
        "Column Reordering",
        "Cambia el orden de columnas mediante controles accesibles."
      ],
      [
        "Row Grouping",
        "Agrupa filas que comparten un atributo."
      ],
      [
        "Tree Table",
        "Tabla jerárquica con filas expandibles y contraíbles."
      ],
      [
        "Pivot Table",
        "Resume y reorganiza datos mediante dimensiones y medidas."
      ],
      [
        "Editable Data Grid",
        "Permite modificar valores directamente en celdas."
      ],
      [
        "Virtualized Table",
        "Renderiza filas visibles para manejar listas muy extensas."
      ],
      [
        "Bulk Selection Toolbar",
        "Muestra acciones para múltiples filas seleccionadas."
      ],
      [
        "Sticky Table Header",
        "Mantiene visibles los encabezados al desplazarse verticalmente."
      ],
      [
        "Expandable Row Detail",
        "Despliega detalles adicionales dentro de una fila."
      ],
      [
        "Table Export Menu",
        "Ofrece exportar los datos visibles en formatos compatibles."
      ]
    ]
  },
  {
    "id": "data-visualization",
    "label": "Gráficos y visualizaciones",
    "category": "data",
    "kind": "visualization",
    "context": "Paneles analíticos e informes visuales",
    "rule": "Incluye descripciones textuales y evita usar el color como única señal",
    "patterns": [
      [
        "Heatmap",
        "Muestra intensidad de datos mediante una matriz de colores."
      ],
      [
        "Treemap",
        "Representa proporciones jerárquicas con rectángulos anidados."
      ],
      [
        "Sunburst",
        "Representa jerarquías como anillos y segmentos radiales."
      ],
      [
        "Sankey Diagram",
        "Visualiza flujos cuantificados entre etapas o categorías."
      ],
      [
        "Scatter Plot",
        "Relaciona dos variables mediante puntos en un plano."
      ],
      [
        "Bubble Chart",
        "Añade una tercera magnitud usando tamaños de burbuja."
      ],
      [
        "Radar Chart",
        "Compara múltiples dimensiones sobre ejes radiales."
      ],
      [
        "Funnel Chart",
        "Muestra disminución de cantidades entre etapas de un proceso."
      ],
      [
        "Waterfall Chart",
        "Desglosa contribuciones positivas y negativas a un total."
      ],
      [
        "Candlestick Chart",
        "Representa apertura, cierre, máximos y mínimos por periodo."
      ],
      [
        "Box Plot",
        "Resume distribución, mediana y dispersión de valores."
      ],
      [
        "Gauge Chart",
        "Indica un valor respecto a una escala o un objetivo."
      ]
    ]
  },
  {
    "id": "dashboard-analytics",
    "label": "Dashboards y analítica",
    "category": "data",
    "kind": "pattern",
    "context": "Monitoreo de métricas y exploración de tendencias",
    "rule": "Diferencia siempre datos reales de cifras de ejemplo",
    "patterns": [
      [
        "KPI Drilldown",
        "Abre el detalle que explica el valor de un indicador."
      ],
      [
        "Chart Drilldown",
        "Explora segmentos más específicos desde un gráfico."
      ],
      [
        "Cross-Filtering",
        "Filtra otras visualizaciones al seleccionar una parte del panel."
      ],
      [
        "Dashboard Comparison Mode",
        "Compara periodos o conjuntos de métricas en paralelo."
      ],
      [
        "Date Range Toolbar",
        "Permite fijar un intervalo temporal para los datos visibles."
      ],
      [
        "Cohort Retention Matrix",
        "Visualiza retención por grupos y periodos de inicio."
      ],
      [
        "Threshold Alert",
        "Señala cuándo un indicador supera un límite establecido."
      ],
      [
        "Target vs Actual Card",
        "Compara un resultado real con su objetivo definido."
      ],
      [
        "Anomaly Timeline",
        "Ubica desviaciones destacadas sobre una línea temporal."
      ],
      [
        "Interactive Legend",
        "Permite mostrar u ocultar series desde la leyenda."
      ],
      [
        "Forecast Confidence Band",
        "Representa incertidumbre alrededor de una proyección."
      ],
      [
        "Saved Dashboard Views",
        "Guarda configuraciones de filtros y paneles para recuperarlas."
      ]
    ]
  },
  {
    "id": "content-editors",
    "label": "Editores de contenido",
    "category": "content",
    "kind": "component",
    "context": "Herramientas de autoría, documentación y publicación",
    "rule": "Implementa deshacer, estados editables y guardado sin pérdida de datos",
    "patterns": [
      [
        "Rich Text Editor",
        "Editor visual que aplica estilos a texto enriquecido."
      ],
      [
        "Markdown Editor",
        "Editor de texto con sintaxis Markdown y vista previa."
      ],
      [
        "Code Editor",
        "Área de programación con numeración, indentación y resaltado."
      ],
      [
        "Block-Based Editor",
        "Composición de documentos mediante bloques editables."
      ],
      [
        "Floating Formatting Toolbar",
        "Barra contextual de formato sobre texto seleccionado."
      ],
      [
        "Slash Command Menu",
        "Menú de comandos insertado al escribir una barra."
      ],
      [
        "Block Drag Handle",
        "Control para mover bloques de contenido de forma accesible."
      ],
      [
        "Mention Picker",
        "Sugiere personas o entidades después de un símbolo de mención."
      ],
      [
        "Emoji Picker",
        "Panel para buscar e insertar símbolos emoji."
      ],
      [
        "Formula Editor",
        "Entrada y representación de expresiones matemáticas."
      ],
      [
        "Diff Viewer",
        "Compara cambios entre versiones de texto o código."
      ],
      [
        "Split Editor View",
        "Muestra editor y resultado en paneles paralelos."
      ]
    ]
  },
  {
    "id": "diagrams-canvas",
    "label": "Canvas y diagramas",
    "category": "motion",
    "kind": "pattern",
    "context": "Herramientas visuales con nodos, capas y manipulación directa",
    "rule": "Ofrece zoom, orientación y alternativas al arrastre",
    "patterns": [
      [
        "Node Graph Editor",
        "Permite diseñar procesos con nodos y conexiones."
      ],
      [
        "Connection Handles",
        "Puntos interactivos que unen nodos compatibles."
      ],
      [
        "Canvas Minimap",
        "Vista pequeña para orientarse en un lienzo grande."
      ],
      [
        "Zoom Controls",
        "Acerca, aleja y restablece la escala de una superficie visual."
      ],
      [
        "Alignment Guides",
        "Guías temporales para alinear objetos al moverlos."
      ],
      [
        "Snap-to-Grid",
        "Ajusta elementos a una cuadrícula al posicionarlos."
      ],
      [
        "Lasso Selection",
        "Selecciona varios objetos trazando una región."
      ],
      [
        "Layers Panel",
        "Lista de capas con visibilidad, orden y selección."
      ],
      [
        "Component Inspector",
        "Edita propiedades del objeto elegido en el lienzo."
      ],
      [
        "Undo/Redo History",
        "Revierte y reaplica operaciones realizadas en el editor."
      ],
      [
        "Comment Pins",
        "Anotaciones ubicadas en coordenadas específicas del documento."
      ],
      [
        "Infinite Canvas",
        "Superficie desplazable sin límites fijos de página."
      ]
    ]
  },
  {
    "id": "media-documents",
    "label": "Multimedia y documentos",
    "category": "content",
    "kind": "component",
    "context": "Visualizadores, reproducción y anotaciones de archivos",
    "rule": "Respeta formatos, controles accesibles y permisos de archivo",
    "patterns": [
      [
        "Image Lightbox",
        "Abre imágenes ampliadas en una vista superpuesta."
      ],
      [
        "Before/After Slider",
        "Compara dos imágenes mediante un divisor desplazable."
      ],
      [
        "Image Cropper",
        "Permite recortar una fotografía con previsualización."
      ],
      [
        "Aspect Ratio Picker",
        "Ajusta una proporción de encuadre predefinida."
      ],
      [
        "Media Timeline",
        "Organiza medios y eventos sobre una línea de tiempo."
      ],
      [
        "Video Trimmer",
        "Selecciona el segmento inicial y final de un vídeo."
      ],
      [
        "Audio Waveform",
        "Representa la forma de onda de una grabación."
      ],
      [
        "Audio Player",
        "Reproductor de sonido con controles de tiempo y volumen."
      ],
      [
        "PDF Viewer",
        "Visualiza páginas de un PDF dentro de la aplicación."
      ],
      [
        "Document Thumbnail Strip",
        "Muestra miniaturas navegables de páginas."
      ],
      [
        "360° Product Viewer",
        "Permite rotar la representación de un producto."
      ],
      [
        "Image Annotation Tool",
        "Añade marcas o notas localizadas sobre una imagen."
      ]
    ]
  },
  {
    "id": "maps-geolocation",
    "label": "Mapas y geolocalización",
    "category": "data",
    "kind": "component",
    "context": "Exploración geográfica, ubicaciones y rutas",
    "rule": "Protege la privacidad y no presentes coordenadas inventadas como reales",
    "patterns": [
      [
        "Interactive Map",
        "Mapa navegable con capas y controles de zoom."
      ],
      [
        "Clustered Markers",
        "Agrupa marcadores cercanos cuando la escala es reducida."
      ],
      [
        "Geofence Overlay",
        "Representa límites de una zona geográfica definida."
      ],
      [
        "Route Planner",
        "Permite definir origen, destino y paradas de una ruta."
      ],
      [
        "Nearby Places List",
        "Relaciona lugares encontrados con sus ubicaciones en mapa."
      ],
      [
        "Map/List Toggle",
        "Alterna entre resultados geográficos y lista textual."
      ],
      [
        "Location Picker",
        "Permite elegir manualmente un punto o dirección."
      ],
      [
        "Radius Search",
        "Busca elementos dentro de una distancia seleccionada."
      ],
      [
        "Geographic Heatmap",
        "Representa densidad de datos en regiones del mapa."
      ],
      [
        "Street View Preview",
        "Ofrece una vista panorámica cuando existe cobertura autorizada."
      ],
      [
        "Indoor Floor Plan",
        "Representa niveles y espacios de un edificio."
      ],
      [
        "Route ETA Timeline",
        "Muestra tiempos estimados de llegada a lo largo de una ruta."
      ]
    ]
  },
  {
    "id": "ecommerce",
    "label": "Comercio electrónico",
    "category": "commerce",
    "kind": "pattern",
    "context": "Catálogos, pedidos y experiencias de compra",
    "rule": "Evita afirmar disponibilidad o descuentos no verificados",
    "patterns": [
      [
        "Product Variant Selector",
        "Permite elegir tallas, colores u opciones de producto."
      ],
      [
        "Size Guide",
        "Consulta medidas y equivalencias antes de comprar."
      ],
      [
        "Stock Availability",
        "Indica la disponibilidad real o desconocida de un producto."
      ],
      [
        "Wishlist",
        "Lista personal de productos guardados para después."
      ],
      [
        "Product Comparison",
        "Permite contrastar atributos de productos seleccionados."
      ],
      [
        "Bundle Builder",
        "Configura conjuntos de varios productos elegidos."
      ],
      [
        "Coupon Field",
        "Aplica y valida códigos promocionales."
      ],
      [
        "Shipping Estimator",
        "Estima costes de envío a partir de datos del pedido."
      ],
      [
        "Delivery Slot Picker",
        "Selecciona una franja de entrega disponible."
      ],
      [
        "Guest Checkout",
        "Permite completar una compra sin registrar cuenta."
      ],
      [
        "Sticky Order Summary",
        "Mantiene visible el desglose del pedido durante checkout."
      ],
      [
        "Returns Portal",
        "Presenta solicitudes y estado de devoluciones."
      ]
    ]
  },
  {
    "id": "billing-subscriptions",
    "label": "Pagos y suscripciones",
    "category": "commerce",
    "kind": "pattern",
    "context": "Productos de suscripción y gestión de facturación",
    "rule": "Utiliza importes verificables y conserva transparencia en condiciones",
    "patterns": [
      [
        "Usage Meter",
        "Muestra cuánto recurso contratado se ha consumido."
      ],
      [
        "Paywall Screen",
        "Explica beneficios y límites antes de solicitar suscripción."
      ],
      [
        "Plan Selector",
        "Compara y permite elegir entre niveles de servicio."
      ],
      [
        "Trial Countdown",
        "Muestra el tiempo restante de una prueba activa."
      ],
      [
        "Invoice Preview",
        "Previsualiza una factura antes de descargarla."
      ],
      [
        "Billing History",
        "Lista facturas, cargos y fechas de facturación."
      ],
      [
        "Proration Explainer",
        "Explica cargos proporcionales por cambios de plan."
      ],
      [
        "Upgrade Nudge",
        "Sugiere una mejora de plan en contexto y sin presión indebida."
      ],
      [
        "Seat Quantity Stepper",
        "Configura el número de licencias o puestos."
      ],
      [
        "Credit Balance",
        "Muestra saldo de créditos disponibles y movimientos."
      ],
      [
        "Renewal Reminder",
        "Avisa sobre una fecha de renovación próxima."
      ],
      [
        "Failed Payment Recovery",
        "Guía la actualización de pago tras un cargo rechazado."
      ]
    ]
  },
  {
    "id": "identity-security",
    "label": "Identidad y seguridad",
    "category": "forms",
    "kind": "pattern",
    "context": "Acceso a cuentas, recuperación y gestión de permisos",
    "rule": "Evita mostrar secretos y aplica políticas seguras en servidor",
    "patterns": [
      [
        "Email Verification",
        "Confirma que una dirección de correo pertenece al usuario."
      ],
      [
        "Passkey Sign In",
        "Inicio de sesión mediante una credencial sin contraseña."
      ],
      [
        "Biometric Authentication Prompt",
        "Solicita verificación biométrica cuando el sistema la soporta."
      ],
      [
        "Two-Factor Authentication Flow",
        "Guía la comprobación de un segundo factor."
      ],
      [
        "Password Reset",
        "Permite solicitar y completar una recuperación de contraseña."
      ],
      [
        "Consent Preferences Center",
        "Gestiona preferencias de consentimiento por finalidad."
      ],
      [
        "Account Switcher",
        "Permite alternar entre identidades autorizadas."
      ],
      [
        "Permission Primer",
        "Explica por qué una función necesita un permiso."
      ],
      [
        "Account Recovery",
        "Ofrece alternativas de acceso cuando fallan credenciales."
      ],
      [
        "Active Sessions List",
        "Permite consultar y revocar sesiones abiertas."
      ],
      [
        "Security Activity Log",
        "Muestra eventos de seguridad vinculados a la cuenta."
      ],
      [
        "Role-Based Access Matrix",
        "Visualiza permisos asignados a roles y recursos."
      ]
    ]
  },
  {
    "id": "collaboration",
    "label": "Colaboración",
    "category": "content",
    "kind": "pattern",
    "context": "Equipos, documentos compartidos y tareas coordinadas",
    "rule": "Separa edición, revisión y aprobación con estados claros",
    "patterns": [
      [
        "Presence Indicator",
        "Muestra participantes conectados o activos en un recurso."
      ],
      [
        "Live Cursors",
        "Representa la ubicación del cursor de colaboradores autorizados."
      ],
      [
        "Comment Thread",
        "Conversación vinculada a un elemento o documento."
      ],
      [
        "Inline Mentions",
        "Menciona colaboradores directamente en el contenido."
      ],
      [
        "Shared Document Status",
        "Indica sincronización, edición y acceso compartido."
      ],
      [
        "Approval Queue",
        "Agrupa elementos pendientes de aprobación."
      ],
      [
        "Assignee Picker",
        "Permite asignar responsables a una tarea."
      ],
      [
        "Task Dependencies",
        "Visualiza relaciones entre tareas y bloqueos."
      ],
      [
        "Recurring Task Builder",
        "Configura repetición y vencimiento de tareas."
      ],
      [
        "Availability Grid",
        "Cruza disponibilidad horaria de varias personas."
      ],
      [
        "Version History",
        "Consulta y restaura versiones anteriores de contenido."
      ],
      [
        "Merge Conflict Resolution",
        "Presenta diferencias simultáneas para resolver un conflicto."
      ]
    ]
  },
  {
    "id": "states-errors",
    "label": "Estados y errores",
    "category": "feedback",
    "kind": "pattern",
    "context": "Situaciones de carga, error, sincronización y recuperación",
    "rule": "Comunica claramente acción, causa y alternativa de recuperación",
    "patterns": [
      [
        "Undo Snackbar",
        "Mensaje breve con opción de deshacer una acción reciente."
      ],
      [
        "Retry State",
        "Ofrece reintentar una tarea que falló."
      ],
      [
        "Offline Banner",
        "Avisa de pérdida de conectividad y trabajo sin red."
      ],
      [
        "Optimistic UI",
        "Refleja una acción antes de confirmar su persistencia."
      ],
      [
        "Sync Status",
        "Muestra si los cambios están sincronizados o pendientes."
      ],
      [
        "Connection Indicator",
        "Informa del estado de la conexión en tiempo real."
      ],
      [
        "Service Outage Notice",
        "Comunica una interrupción temporal de un servicio."
      ],
      [
        "Maintenance Page",
        "Pantalla de información durante tareas de mantenimiento."
      ],
      [
        "Partial Failure Summary",
        "Describe qué partes de una operación terminaron y cuáles fallaron."
      ],
      [
        "Background Job Progress",
        "Muestra avance de tareas que siguen ejecutándose."
      ],
      [
        "Conflict Notice",
        "Advierte de modificaciones incompatibles entre versiones."
      ],
      [
        "Rate Limit Message",
        "Explica que existe un límite temporal y cómo continuar."
      ]
    ]
  },
  {
    "id": "mobile-gestures",
    "label": "Gestos e interfaces móviles",
    "category": "motion",
    "kind": "interaction",
    "context": "Aplicaciones táctiles y dispositivos móviles",
    "rule": "Ofrece alternativas visibles sin depender solo de gestos",
    "patterns": [
      [
        "Swipeable Card Stack",
        "Conjunto de tarjetas desplazables lateralmente para decidir."
      ],
      [
        "Long-Press Context Menu",
        "Muestra acciones contextuales tras una pulsación sostenida."
      ],
      [
        "Edge Swipe Back",
        "Permite volver deslizando desde el borde de pantalla."
      ],
      [
        "Haptic Feedback",
        "Proporciona una respuesta táctil compatible con el dispositivo."
      ],
      [
        "Peek Sheet",
        "Muestra parte de un panel que puede ampliarse."
      ],
      [
        "Collapsing Large Title",
        "Reduce una cabecera amplia al desplazarse."
      ],
      [
        "Bottom App Bar",
        "Barra inferior con acciones contextualizadas."
      ],
      [
        "Pull-up Action Menu",
        "Despliega acciones desde un control inferior."
      ],
      [
        "Swipe to Confirm",
        "Solicita un deslizamiento deliberado para confirmar."
      ],
      [
        "Swipe to Dismiss",
        "Permite descartar una tarjeta mediante un gesto lateral."
      ],
      [
        "Drag Reorder List",
        "Reorganiza filas con arrastre y alternativa accesible."
      ],
      [
        "QR Scanner Overlay",
        "Muestra guías de encuadre sobre la vista de cámara."
      ]
    ]
  },
  {
    "id": "accessibility",
    "label": "Accesibilidad",
    "category": "feedback",
    "kind": "pattern",
    "context": "Interfaces inclusivas para teclado, lectores de pantalla y tacto",
    "rule": "Cumple criterios WCAG y prueba alternativas de interacción",
    "patterns": [
      [
        "Skip to Content",
        "Acceso directo al contenido para omitir navegación repetida."
      ],
      [
        "Keyboard Shortcut Overlay",
        "Muestra combinaciones de teclado disponibles."
      ],
      [
        "Focus Trap",
        "Mantiene temporalmente el foco dentro de un diálogo modal."
      ],
      [
        "High Contrast Toggle",
        "Ofrece una presentación con contraste reforzado."
      ],
      [
        "Text Scaling",
        "Permite adaptar tamaño de texto manteniendo el diseño."
      ],
      [
        "Reduced Motion Toggle",
        "Reduce animaciones cuando el usuario lo solicita."
      ],
      [
        "Screen Reader Live Announcement",
        "Notifica cambios relevantes a tecnologías asistivas."
      ],
      [
        "Non-drag Reordering",
        "Permite reorganizar sin utilizar arrastre."
      ],
      [
        "Captions Toggle",
        "Activa o desactiva subtítulos disponibles de un vídeo."
      ],
      [
        "Audio Description Toggle",
        "Controla una pista descriptiva cuando está disponible."
      ],
      [
        "Language Switcher",
        "Permite elegir idioma y anuncia correctamente el cambio."
      ],
      [
        "Accessible Error Navigation",
        "Ayuda a localizar campos inválidos desde un resumen."
      ]
    ]
  },
  {
    "id": "ai-interfaces",
    "label": "Interfaces para IA",
    "category": "content",
    "kind": "component",
    "context": "Chats, agentes y herramientas que incorporan modelos de IA",
    "rule": "Distingue resultados del modelo, fuentes reales y solicitudes de aprobación",
    "patterns": [
      [
        "Chat Composer",
        "Campo de conversación con archivos adjuntos y controles de envío."
      ],
      [
        "Streaming Message",
        "Muestra una respuesta de IA mientras se va recibiendo."
      ],
      [
        "Prompt Suggestions",
        "Presenta ejemplos de instrucciones que pueden elegirse."
      ],
      [
        "Model Picker",
        "Permite seleccionar entre modelos disponibles."
      ],
      [
        "Tool Execution Card",
        "Describe el estado y resultado de una herramienta del agente."
      ],
      [
        "Source Citations",
        "Permite inspeccionar referencias que sostienen una respuesta."
      ],
      [
        "Artifact Preview",
        "Visualiza documentos o código producidos por un asistente."
      ],
      [
        "Human Approval Gate",
        "Solicita autorización antes de ejecutar una acción importante."
      ],
      [
        "Uncertainty Indicator",
        "Comunica límites, dudas o evidencia insuficiente del modelo."
      ],
      [
        "Regenerate Response",
        "Vuelve a solicitar una respuesta conservando contexto."
      ],
      [
        "Agent Task Progress",
        "Muestra etapas de una tarea ejecutada por un agente."
      ],
      [
        "Context Attachments",
        "Gestiona archivos aportados como contexto del diálogo."
      ]
    ]
  },
  {
    "id": "marketing-conversion",
    "label": "Marketing y conversión",
    "category": "commerce",
    "kind": "pattern",
    "context": "Páginas comerciales y captación transparente de contactos",
    "rule": "No inventes testimonios ni utilices patrones engañosos",
    "patterns": [
      [
        "Interactive Pricing Calculator",
        "Calcula importes según cantidades o características seleccionadas."
      ],
      [
        "Social Proof Gallery",
        "Agrupa evidencias auténticas sobre experiencia de clientes."
      ],
      [
        "Lead Capture Form",
        "Recoge datos de contacto con consentimiento explícito."
      ],
      [
        "Newsletter Signup",
        "Permite suscribirse y administrar el boletín informativo."
      ],
      [
        "Interactive Case Study",
        "Presenta un caso con detalles ampliables y resultados."
      ],
      [
        "Customer Story Page",
        "Desarrolla la experiencia documentada de un cliente."
      ],
      [
        "Feature Highlight Tour",
        "Recorre funcionalidades principales de forma guiada."
      ],
      [
        "Product Hotspots",
        "Marca zonas interactivas sobre una imagen de producto."
      ],
      [
        "FAQ Search",
        "Busca respuestas dentro de preguntas frecuentes."
      ],
      [
        "Sticky Lead CTA",
        "Mantiene visible la acción de contacto donde resulta útil."
      ],
      [
        "Campaign Landing Variant",
        "Adapta mensajes y estructura a una campaña específica."
      ],
      [
        "Trust Center Page",
        "Reúne compromisos verificables sobre seguridad y privacidad."
      ]
    ]
  },
  {
    "id": "education",
    "label": "Educación",
    "category": "content",
    "kind": "pattern",
    "context": "Plataformas de enseñanza, cursos y seguimiento académico",
    "rule": "Presenta estados de aprendizaje y evaluaciones con claridad",
    "patterns": [
      [
        "Lesson Outline",
        "Organiza unidades y temas de una clase."
      ],
      [
        "Course Progress Tracker",
        "Señala módulos terminados y pendientes."
      ],
      [
        "Interactive Quiz",
        "Evalúa respuestas y comunica resultados de aprendizaje."
      ],
      [
        "Flashcard Stack",
        "Tarjetas de repaso que alternan pregunta y respuesta."
      ],
      [
        "Video Chapter Markers",
        "Accesos a momentos relevantes de un vídeo educativo."
      ],
      [
        "Assignment Submission",
        "Permite adjuntar y entregar una actividad."
      ],
      [
        "Grade Breakdown",
        "Desglosa calificaciones, pesos y evaluaciones."
      ],
      [
        "Timetable Grid",
        "Muestra asignaturas y actividades en una cuadrícula horaria."
      ],
      [
        "Attendance Matrix",
        "Representa asistencia por alumno y fecha."
      ],
      [
        "Learning Path Map",
        "Visualiza la secuencia recomendada de contenidos."
      ],
      [
        "Certificate Preview",
        "Muestra una vista previa del certificado disponible."
      ],
      [
        "Peer Review Flow",
        "Guía la evaluación entre estudiantes."
      ]
    ]
  },
  {
    "id": "point-of-sale",
    "label": "POS y operaciones comerciales",
    "category": "commerce",
    "kind": "pattern",
    "context": "Sistemas de ventas presenciales, inventario y caja",
    "rule": "Usa estados verificables para cobros, stocks y operaciones offline",
    "patterns": [
      [
        "Barcode Scan Overlay",
        "Guía el encuadre de códigos durante el escaneo."
      ],
      [
        "Quick Sale Grid",
        "Muestra productos frecuentes para registrar ventas rápidas."
      ],
      [
        "Weighted Product Entry",
        "Captura peso, unidad e importe de productos a granel."
      ],
      [
        "Product Lookup Drawer",
        "Busca productos mediante nombre, código u otra referencia."
      ],
      [
        "Cash Tender Keypad",
        "Teclado numérico para registrar efectivo recibido."
      ],
      [
        "Change Due Panel",
        "Calcula y muestra el vuelto a entregar."
      ],
      [
        "Split Payment Workflow",
        "Permite distribuir una venta entre varios medios de pago."
      ],
      [
        "Receipt Preview",
        "Previsualiza el comprobante antes de imprimirlo."
      ],
      [
        "Offline Sales Queue",
        "Encola ventas locales cuando no hay conectividad."
      ],
      [
        "Shift Closing Report",
        "Resume operaciones y efectivo al terminar un turno."
      ],
      [
        "Stock Adjustment Panel",
        "Registra cambios justificados de inventario."
      ],
      [
        "Refund/Exchange Flow",
        "Guía devoluciones o cambios con validaciones."
      ]
    ]
  }
] as ExpansionFamily[]

const toSlug = (name: string): string =>
  name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const expansion: ComponentInfo[] = expansionFamilies.flatMap(group =>
  group.patterns.map(([name, description]) => ({
    id: `${group.id}-${toSlug(name)}`,
    name,
    description,
    category: group.category,
    preview: group.category,
    useCase: group.context,
    guidance: `Al implementar ${name}, ${group.rule.charAt(0).toLowerCase() + group.rule.slice(1)}. ${description}`,
    family: group.id,
    kind: group.kind
  }))
)
