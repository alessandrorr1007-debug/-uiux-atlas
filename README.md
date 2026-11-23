# UIUX Atlas v0.4.4 — Atlas IA analiza repositorios GitHub públicos

[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/alessandrorr1007-debug/-uiux-atlas/ci.yml?branch=main&label=Tests)](https://github.com/alessandrorr1007-debug/-uiux-atlas/actions)
[![Version](https://img.shields.io/badge/versión-0.4.4-8b82ff)](./package.json)

**Web pública:** https://uiux-atlas.netlify.app/

UIUX Atlas es un diccionario de **406 patrones UI/UX**, un laboratorio interactivo y una plataforma para crear prompts profesionales. La versión **0.4.0** agrega **Atlas IA**, un asistente conversacional con dos modos únicos:

1. **Crear proyecto:** describe una web o aplicación desde cero, combina texto, imágenes, logos, fotos de menús y enlaces de referencia; descubre patrones, colores, estructura y funciones.
2. **Mejorar proyecto:** comparte una web publicada, un repositorio GitHub público aún sin desplegar o capturas. Obtén recomendaciones concretas para mejorar UI/UX sin romper rutas, autenticación, pagos o integraciones.

En ambos modos hay conversación, recomendaciones conectadas con los 406 patrones y generación de un prompt final para **Codex, Google AI Studio o Antigravity**.

**Flujo unificado de prompts:** Atlas IA concentra la generación de instrucciones. El antiguo constructor independiente fue retirado del menú y de los diálogos. Desde la biblioteca se pueden seleccionar varios patrones y abrir Atlas IA con ellos; desde cada detalle se puede enviar el patrón directamente al asistente. Las plantillas por rubro abren Atlas IA con su objetivo y sus patrones precargados. Se conservan favoritos, demos y la selección persistida localmente.

## Catálogo visual completo (v0.4.3)

Cada uno de los 406 patrones muestra una mini maqueta propia basada en su nombre, categoría y función. Puedes pulsar la maqueta para ampliar y ver una explicación del patrón, cuándo usarlo, buenas prácticas y su prompt. Los 46 patrones con demo ofrecen además un área interactiva **separada de la ilustración**. Los dibujos no son capturas reales ni demostraciones funcionales cuando no se indica expresamente. Más detalles: [docs/RELEASE_0.4.3.md](docs/RELEASE_0.4.3.md).

## Diseño Soft Balance (v0.4.1)

Interfaz renovada con colores suaves, modo «Niebla suave» por defecto y «Noche suave», navegación simplificada por objetivos, categorías expandibles y accesos rápidos a la biblioteca, Atlas IA y el laboratorio. Se conservan los 406 patrones y todas las funciones de la versión anterior. [Notas de actualización](docs/RELEASE_0.4.1.md).

## UIUX Atlas para ChatGPT y Codex (Skill + Plugin)

La plataforma incluye también un **paquete portable de Plugin con un Skill de diseño UI/UX**, ubicado en [`plugins/uiux-atlas/`](plugins/uiux-atlas/). La distribución de desarrollo está declarada en [`.agents/plugins/marketplace.json`](.agents/plugins/marketplace.json).

- Dos flujos: **Crear proyecto** y **Mejorar proyecto** con texto, referencias accesibles y recomendaciones de patrones.
- **406 patrones empaquetados**, consultables por IA sin conectarse a la página ni consumir la API de Groq.
- Prompts para Codex, Google AI Studio y Antigravity, accesibilidad y conservación de funcionalidades existentes.
- Instalación local y pruebas documentadas en [`docs/ATLAS_PLUGIN.md`](docs/ATLAS_PLUGIN.md).

**Estado:** paquete preparado en el repositorio; **no está instalado en ninguna cuenta ni publicado en el directorio público**. La instalación y eventual revisión/publicación se realizan después desde el cliente compatible. Esto no reemplaza la web ni activa Groq.

## Analizar repositorios GitHub públicos — v0.4.4

En **Atlas IA → Mejorar proyecto**, pega un enlace HTTPS como `https://github.com/usuario/proyecto` y pulsa **Analizar GitHub**. También puedes pegar el enlace y enviar directamente una consulta. El proyecto **no necesita estar desplegado**.

El lector de Netlify **`POST /api/atlas/github`** usa la API oficial de GitHub para obtener solo metadatos y un máximo de **8 archivos relevantes de frontend**, por ejemplo `src/App.tsx`, estilos, páginas y `package.json`. El navegador muestra la rama, frameworks y nombres de archivos; **no recibe extractos del código fuente** de la función de inspección. Las credenciales de GitHub no son necesarias para repositorios públicos.

- **Sin GROQ_API_KEY:** lectura de metadatos, lista de archivos inspeccionados, selección de patrones y **prompt local** que indica qué archivos debería revisar la herramienta de desarrollo. No atribuir hallazgos de código a una IA inexistente.
- **Con GROQ_API_KEY:** el backend vuelve a usar la lectura segura (con caché breve) y envía extractos de código de interfaz seleccionados, junto al mensaje del usuario, a Groq. Atlas IA debe citar los archivos leídos, separar observaciones e inferencias y recomendar mejoras por prioridad.
- **Repositorios privados:** no se leen sin una futura conexión autorizada; no se piden tokens, contraseñas ni claves en el chat. El usuario puede compartir capturas.
- **Limitaciones:** análisis estático y parcial, no renderiza la web ni verifica visualmente componentes, seguridad o funcionalidad. Complementa con capturas para validar la apariencia.
- **Seguridad y cuotas:** URL HTTPS estricta a github.com, endpoints fijos api.github.com, exclusión de backend/secretos/lockfiles, extractos acotados, filtros de líneas sensibles, límites por IP y caché temporal de cinco minutos. GitHub tiene límites de API; opcionalmente configura `GITHUB_READ_TOKEN` **solo en Functions** para consultas públicas de mayor volumen (jamás en cliente). No concede lectura de repos privados aunque se configure.

Ver [instrucciones y pruebas](docs/ATLAS_IA_SETUP.md) y [notas de la versión](docs/RELEASE_0.4.4.md).

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
- **406 maquetas SVG identificadas por patrón**: composición visual semántica de cada componente (sin imágenes externas, plantillas de geometría y datos ilustrativos), no una sola vista reciclada por categoría.
- **46 demostraciones interactivas**: 24 originales y 22 nuevas con controles locales y estados funcionales; el resto muestra su propia maqueta ilustrativa, sin afirmar interacciones inexistentes.
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
