# UIUX Atlas v0.4.3 — 406 maquetas individuales y 46 demos

Esta versión agrupa las mejoras previstas de v0.4.2 (visualización integral) y v0.4.3 (ficha ampliada y laboratorio mejorado) en **un solo commit a main** para evitar múltiples despliegues Netlify.

## Antes y después

Antes, los 406 patrones compartían únicamente ocho vistas de ejemplo por categoría; solo 24 tenían una demo dedicada.

Ahora:
- Cada entrada se representa con una **maqueta SVG identificada por su ID, nombre y semántica**. La escena incluye composición determinista y ejemplos de interfaz relacionados con el patrón. Existe una familia de representaciones reconocibles (navegación, tablas, gráficos, mapas, búsqueda, formularios, comercio, multimedia, etc.), con variaciones por patrón. **No son 406 demos programadas de forma independiente ni capturas de productos reales**.
- Las tarjetas muestran siempre el ejemplo visual y una etiqueta precisa: «MAQUETA INDIVIDUAL» o «DEMO PARA PROBAR».
- Pulsar una maqueta abre la ficha ampliada con: ilustración a mayor escala, explicación del esquema, definición, caso de uso, práctica de implementación y prompt copiable.
- Para **46 patrones** hay además controles interactivos de demostración: las 24 demos previas más 22 nuevas (Hero Section, Pricing Table, Calendar View, Search Field, Filter Chips, Progress Bar, Kanban Board, Carousel, Tooltip, Popover, File Uploader, Product Gallery, Checkout Steps, Order Tracker, Alert Banner, Date Picker, Activity Feed, Inline Validation, Heatmap, Pricing Calculator, Interactive Map esquemático e Interactive Quiz).
- El laboratorio incorpora las 46 demos. Las interacciones usan estados y datos exclusivamente locales; no ejecutan pagos, geolocalización real ni cargas al servidor.
- Se preserva el diseño Soft Balance en sus temas claro/oscuro, responsive, preferencias, favoritos, prompts, Atlas IA y el plugin.

## Diseño y rendimiento

- Dibujos SVG propios generados en el frontend sin imágenes externas ni archivos por patrón.
- Solo se renderizan las entradas visibles según la paginación del catálogo; la ficha expandida dibuja un único patrón.
- Geometría distinta según el tipo de interfaz y detalles por ID; los ejemplos se marcan como ilustrativos.
- Atributos de accesibilidad, estados de foco, controles con etiquetas, y movimiento reducido.

## Validación automática

`npm test`: incluye revisión de 406 escenas válidas y distintas, diversidad de arquetipos, salida SVG por elemento, existencia de 46 IDs de demos reales, integridad previa del diccionario, backend Groq mock y paquete plugin.

`npm run build`: TypeScript y Vite. Antes de declarar la entrega válida verificar el CI de GitHub Actions.

## Pendientes que no se inventan

- Las 360 entradas sin demo no son interactuables, aunque cada una tenga una maqueta propia. Se podrán agregar más demos según demanda.
- Las ilustraciones son esquemas didácticos originales, no fotografías ni interfaces listas para producción.
- Atlas IA sigue necesitando `GROQ_API_KEY` en Netlify para el chat real.
