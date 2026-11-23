# UIUX Atlas v0.4.6 — Referencias multimodales unificadas

## Solicitud del usuario
Tanto **Crear proyecto** como **Mejorar proyecto** deben aceptar varias referencias visuales mediante un único apartado de enlaces (cualquier web, repo GitHub, LinkedIn, Instagram, otras plataformas) y un apartado independiente de imágenes; explicar cómo añadirlas y poder combinarlas en una misma consulta.

## Entrega
- Un único campo **Enlaces** acepta un máximo de cuatro URLs HTTPS; permite agregar con Enter, consultar el contenido público, abrir el enlace original o quitar una tarjeta. Se usan indicadores y nombre de plataforma, pero **no** formularios distintos por plataforma.
- **Imágenes** tiene selector JPG/PNG/WebP independiente, máximo tres, miniaturas removibles y un mensaje de uso.
- **Crear y Mejorar** comparten las mismas capacidades y el mismo flujo. Ninguna función anterior se elimina.
- HTML y metadatos públicos pueden aportar título/descripcion/miniatura Open Graph (opcional, sin garantía de acceso o descarga). Un enlace a Instagram/LinkedIn no equivale a ver su contenido visual; se indica cuando está restringido y se propone captura.
- El backend maneja `sourceUrls` de máximo 4 (y mantiene `sourceUrl` anterior) y devuelve `references` con estados observados. Se limita a un repo GitHub con lectura profunda para proteger tiempos, cuotas y tamaño del prompt.
- El usuario puede combinar hasta cuatro links con tres capturas y un pedido textual. El prompt local conserva todas las URLs, distinguiendo las referencias accesibles de las que solo se añadieron.
- Se preservan diseño suave, 406 patrones, 46 demos, configuración de Groq, proveedor e identidad del plugin.

## Límites
No ejecuta proyectos, no captura sitios automáticamente, no accede a publicaciones privadas, no elude autenticación y no solicita cookies, claves ni contraseñas. La miniatura es una imagen pública de metadatos, no una captura completa.

## Pruebas
`tests/atlas-references.test.mjs`: mezclas de plataformas, deduplicación, máximo 4, URL inválida, lectura parcial, miniaturas y rechazo de múltiples lecturas profundas.
`src/lib/atlas-ai.test.ts`: parser del único campo y prompts locales con múltiples referencias.
También deben pasar todas las pruebas previas y la compilación TypeScript/Vite.
