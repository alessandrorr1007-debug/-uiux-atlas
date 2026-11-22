# UIUX Atlas v0.4.0 — Atlas IA lista para conectar

[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/alessandrorr1007-debug/-uiux-atlas/ci.yml?branch=main&label=Tests)](https://github.com/alessandrorr1007-debug/-uiux-atlas/actions)
[![Version](https://img.shields.io/badge/versión-0.4.0-8b82ff)](./package.json)

**Web pública:** https://uiux-atlas.netlify.app/

UIUX Atlas es un diccionario de **406 patrones UI/UX**, un laboratorio interactivo y una plataforma para crear prompts profesionales. La versión **0.4.0** agrega **Atlas IA**, un asistente conversacional con dos modos únicos:

1. **Crear proyecto:** describe una web o aplicación desde cero, combina texto, imágenes, logos, fotos de menús y enlaces de referencia; descubre patrones, colores, estructura y funciones.
2. **Mejorar proyecto:** comparte una web pública, capturas e instrucciones; recibe recomendaciones para mejorar el diseño sin romper lógica, rutas, autenticación o integraciones.

En ambos modos hay conversación, recomendaciones conectadas con los 406 patrones y generación de un prompt final para **Codex, Google AI Studio o Antigravity**.

## Activación de Atlas IA

**Todo el código está listo, pero el proveedor no se activará hasta introducir una API key válida de Groq en Netlify.** NO almacenes la clave en GitHub ni en el frontend.

1. Crea/consulta tu clave en https://console.groq.com/keys .
2. En Netlify abre el proyecto de UIUX Atlas → **Project configuration** → **Environment variables**.
3. Añade la variable **GROQ_API_KEY** con el valor secreto, usando scope **Functions** (o All scopes) y el contexto Production.
4. Guarda y realiza **un nuevo despliegue** en Netlify (necesario para que la Function reciba la variable). **No se necesita modificar GitHub ni generar otro commit solo para añadir la clave.**
5. Abre **Atlas IA** en la web; el estado indicará "Clave de Groq configurada". Prueba una conversación real y una captura para validar que la clave funciona.

El modelo predeterminado es **qwen/qwen3.8-27b** (visión + texto). El estado "configurada" confirma presencia del secreto, no garantiza que la clave tenga permisos o cuota; el primer mensaje valida la conexión real. Guía completa: [docs/ATLAS_IA_SETUP.md](docs/ATLAS_IA_SETUP.md).

## Qué funciona antes de introducir la clave

- Diseño responsive de Atlas IA y cambio entre sus dos modos.
- Entrada de texto, hasta tres imágenes JPEG/PNG/WebP por consulta (se comprimen en el navegador).
- Extracción aproximada de colores en el navegador (sin consumir tokens).
- Lectura preliminar de HTML público mediante una Netlify Function, con protección de URL. No es una auditoría visual de CSS o JavaScript.
- Recomendaciones **locales basadas en palabras clave** y selección de patrones.
- Generador de prompts **local** sin conexión a IA.
- Etiquetado visible de que las respuestas sin clave son reglas locales, no inteligencia artificial.
- El catálogo anterior, favoritos y los cuatro módulos de Atlas Studio permanecen intactos.

Una vez configurada la clave, Atlas IA envía texto e imágenes mediante la Function de Netlify a Groq para interpretación. Lee la advertencia de privacidad antes de adjuntar información sensible.

## Backend ligero y seguridad

- Endpoint de estado/chat: **GET/POST /api/atlas/chat** (GET consulta el estado sin revelar la clave).
- Endpoint de referencias web: **POST /api/atlas/inspect**.
- Clave: **process.env.GROQ_API_KEY**, exclusivamente en funciones.
- Límite de 3 imágenes por solicitud, compresión local, límites de tamaño, de historial y de tokens.
- Verificación de mismo origen, validación de datos y **rate limiting nativo de Netlify por IP** (6 solicitudes/min al endpoint de IA y 10/min al de enlaces), más un límite de memoria como defensa adicional.
- La lectura de URLs públicas solo permite HTTPS, puerto 443 y dominios con IP pública; las peticiones fijan la IP DNS validada, bloquean direcciones privadas y redirecciones inseguras. No accede a webs que requieren autenticación.
- No se almacenan imágenes ni historiales de chat en una base de datos. El historial de conversación vive solo en memoria mientras está abierta esa sección.
- Un fallo de Groq muestra el error de forma entendible; no cambia automáticamente a un plan pagado.
- Groq ofrece cuotas gratuitas limitadas **dependientes de la cuenta y el modelo**. No hay garantía de uso ilimitado; revisa límites y costes del proveedor.

**Limitación de seguridad y costes:** el rate limiting por IP no es una cuota global entre todos los visitantes; una web pública puede agotar los límites de Groq con varios usuarios. Mantén la cuenta en Free, revisa el consumo y considera autenticación y cuotas persistentes antes de permitir un volumen elevado.

## Investigación de enlaces e Instagram

- Un enlace web permite leer **solo el HTML público accesible**, sus encabezados y metadatos. No permite afirmar que se observaron estilos reales, animaciones, comportamiento móvil, autenticación ni el código del sitio.
- Instagram puede impedir el acceso automático; Atlas IA ofrece subir capturas públicas o propias en esos casos.
- Las imágenes sí pueden analizarse visualmente por un modelo con visión, después de configurar la API.
- El texto obtenido de webs es contenido **no confiable**; no debe seguirse como instrucciones del sistema.

## Catálogo y herramientas ya existentes

- **406 patrones**: 80 base + 38 de v0.2 + 288 nuevos de v0.3 en 24 familias.
- **24 demostraciones individuales** y previews por categoría para el resto, etiquetados honestamente.
- **20 plantillas por rubro**, 22 criterios de auditoría manual, 54 estilos para prompts fotográficos.
- Filtros, búsqueda, favoritos, modo claro/oscuro y generador independiente de prompts.

## Desarrollo local

Necesitas Node.js 22.

\`\`\`bash
npm install
npm test
npm run build
npm run dev
\`\`\`

Para probar **también las Netlify Functions** localmente usa:

\`\`\`bash
npx netlify-cli dev
\`\`\`

Opcionalmente configura una clave local en un \`.env\` ignorado por Git. **Nunca la incluyas en variables VITE_, en \`netlify.toml\`, ni en el repositorio**.

- \`src/components/AtlasIA.tsx\`: UI conversacional.
- \`src/lib/atlas-ai.ts\`: recomendador local, generador de respaldo, compresión y colores.
- \`netlify/functions/atlas-chat.mjs\`: orquestador, contexto e integración Groq.
- \`netlify/functions/atlas-inspect.mjs\`: lector de enlaces.
- \`netlify/functions/lib/security.mjs\`: validación de origen y URL, SSRF y rate limiting.
- \`netlify/functions/lib/knowledge.mjs\`: índice compacto de los **406 patrones** para el backend, seleccionados según la consulta. **Sincronízalo cuando agregues patrones al catálogo.**
- \`tests/atlas-functions.test.mjs\`: tests de backend con proveedor simulado.
- \`src/lib/atlas-ai.test.ts\`: tests del modo local.

**La API no puede probarse con una clave real hasta que la configures.** GitHub Actions prueba la lógica con simulaciones, sin llamar a Groq. La cuenta, cuotas y redes externas quedan por verificar en producción.

La plataforma no entrena un modelo propio; utiliza un modelo multimodal alojado y un índice propio de conocimientos de UI/UX. A partir de referencias externas se redactan recomendaciones originales, respetando privacidad, propiedad intelectual y límites de acceso.
