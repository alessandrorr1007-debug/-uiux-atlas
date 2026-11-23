# UIUX Atlas v0.4.5 — Resistencia a fallos en análisis multimodal

## Problema observado

En móvil, el usuario pudo leer un repositorio GitHub público (8 archivos de 174), adjuntó 3 capturas, y al enviar una consulta de rediseño recibió **`Failed to fetch`**. El estado de la clave solo comprobaba la presencia de `GROQ_API_KEY` en Netlify, no una comunicación exitosa con Groq.

No se dispone de los logs privados de la función, por lo que no puede afirmarse una causa raíz única. Posibles factores: latencia acumulada de leer código e inferir con tres imágenes, tamaño del envío o interrupción de red en el navegador.

## Solución

- **Lectura de repositorios más rápida:** lotes de hasta 4 archivos GitHub en paralelo, con límites previos de tipos, tamaños, rutas y contexto, sin ejecutar código.
- **Imágenes más ligeras:** codificación JPEG adaptativa (lado máximo de 960 px con reducciones sucesivas si es necesario) y máximo de 320 000 caracteres por imagen; capacidad de hasta 3 imágenes.
- **Validación previa de carga:** aviso si el JSON supera 1.6 MB; control de espera de 48 segundos en navegadores compatibles.
- **Respuesta segura:** cuando Netlify devuelva HTTP de error o contenido no JSON, el cliente lo explica en español. Se normaliza `Failed to fetch` y los errores de timeout.
- **Recuperación:** en caso de fallo, se conservan capturas, repositorio y borrador; se ofrecen recomendaciones o prompts locales identificados como tales.
- **Estado honesto:** banner de Groq indica «clave detectada» hasta completar una consulta real.

No se cambian modelos, tokens de API, claves, rutas de Groq, el catálogo de 406 patrones ni las funciones existentes de Atlas Studio.

## Pruebas

- Simulación de compresión con canvas y bitmap, incluido el límite por imagen.
- Simulación de Netlify/Groq y carga simultánea de archivos GitHub.
- Normalización de errores de red y tiempo de espera.
- Ejecución de `npm test` y `npm run build` en GitHub Actions después del commit.

## Verificación en producción

Confirmar el despliegue de Netlify y probar, en este orden: texto solo, una captura, GitHub solo y GitHub + tres capturas. Si falla, buscar registros de `/api/atlas/chat` en Netlify sin compartir credenciales.
