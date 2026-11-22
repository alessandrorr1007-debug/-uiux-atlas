# Release 0.2.0 — UIUX Atlas

## Entrega
- 118 patrones (80 originales + 38 nuevos).
- 24 demos individuales con controles reales y estados locales.
- 20 plantillas (12 web, 8 app); cada una puede abrir el constructor con una preselección.
- 54 propuestas fotográficas originales en seis categorías.
- 12 errores + 10 reglas evaluables manualmente y prompt generado de mejoras.
- Generador de 6 decisiones, sin IA conectada.

## Límites explícitos
- No se ejecuta generación de imágenes ni de código con un servicio externo.
- No hay sistema de cuentas, sincronización ni almacenamiento remoto.
- La auditoría es una lista de comprobación manual; no analiza capturas automáticamente.
- Las 94 fichas restantes conservan demos educativas genéricas por categoría.
- Las demostraciones no son bibliotecas de producción listas para instalar en otro producto.
- El despliegue se realiza de forma independiente; el repositorio solo incluye configuración.

## Criterios de revisión
- `npm test` y `npm run build` finalizan sin errores.
- Todos los IDs únicos y las referencias de plantillas válidas.
- La navegación entre diccionario, laboratorio, plantillas, auditoría y fotografía funciona.
- Pueden copiarse los prompts y elegirse variantes.
- Persisten los favoritos y los estados de auditoría con localStorage disponible.
- Dispositivos móviles y teclado básico utilizables; seguir trabajando en foco de overlays.

## Reconocimiento
El proyecto usa patrones de UI/UX de dominio general con prompts originales. Material de referencia e inspiración: Capa Zero, https://capazero.app/#diccionario . No se redistribuye la guía ni sus ilustraciones.
