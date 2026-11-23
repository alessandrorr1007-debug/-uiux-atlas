# Guía de implementación de UIUX Atlas

## Selección de patrones

Consulta `patterns.json` buscando por texto de nombre, descripción o caso de uso. Cada entrada tiene ID estable. Usa vocabulario exacto y justifica los patrones, no conviertas el catálogo en una lista indiscriminada.

Por ejemplo, en una pollería normalmente podrían ser útiles: Hero Section, Product Card, Cart Drawer, navegación móvil y estados de pedido, **solo si existen en la fuente**. No afirmes que una demo específica existe salvo comprobación.

## Plantilla sugerida de especificación

1. **Objetivo y público:** sector, necesidad y dispositivos.
2. **Estructura:** páginas, secciones, navegación, jerarquía y diseño móvil.
3. **Funcionalidades:** MVP priorizado; distinguir existente vs propuesto.
4. **Dirección visual:** tono, paleta justificada, tipografía, bordes, iconografía, espaciado y estados.
5. **Patrones UI/UX:** nombres, IDs y aplicación concreta.
6. **Accesibilidad y rendimiento:** contraste WCAG AA cuando aplique, teclado, focos visibles, movimiento reducido, imágenes optimizadas.
7. **Criterios de aceptación:** funcionamiento verificable en móvil y escritorio, estados vacío/error/carga, pruebas.
8. **Límites:** no inventar reseñas, costos, calificaciones ni datos de terceros.

## Plantilla de prompt técnico

> Actúa como diseñador senior de producto y desarrollador. Trabaja con [HERRAMIENTA] en [PROYECTO]. Objetivo: [OBJETIVO]. Público: [USUARIOS].
>
> Implementa [PANTALLAS] con [FUNCIONES CONFIRMADAS] y [FUNCIONES PROPUESTAS ACEPTADAS]. Utiliza los patrones [NOMBRES/IDs] de UIUX Atlas para [USOS].
>
> Dirección visual: [PALETA con origen y HEX si verificables], [TIPOGRAFÍA], [ESPACIADO], [COMPONENTES], [RESPONSIVE], [MICROINTERACCIONES].
>
> Conserva [FUNCIONALIDADES/ENDPOINTS/CONTRATOS EXISTENTES] y aplica únicamente los cambios UI/UX solicitados. No introduzcas autenticación, pagos o bases de datos sin necesidad acordada.
>
> Valida accesibilidad, estados vacíos/carga/error, rendimiento móvil, pruebas y compilación. Documenta los archivos modificados y cualquier dato supuesto.
>
> Entrega una implementación o plan verificable acorde con las herramientas disponibles; no afirmes cambios o pruebas no realizados.

## Revisión de un sitio existente

Si hay URL sin lectura visual, describe solo lo observable (HTML/metadatos accesibles) y separa recomendaciones hipotéticas. Si el usuario sube capturas, la observación visual proviene de ellas. Nada de eso permite garantizar la calidad del código, la seguridad de un login ni el funcionamiento de la compra.

## Ejemplos de uso

- «Quiero una web para una pollería; tengo estas fotos del menú y un logo. Recomiéndame colores, funciones, componentes y un prompt para Codex».
- «Esta es mi web y estas capturas. Rediseña navegación y catálogo sin tocar pagos ni backend».
- «Compárame dos opciones de diseño y dime qué patrones de Atlas usarías para cada una».
