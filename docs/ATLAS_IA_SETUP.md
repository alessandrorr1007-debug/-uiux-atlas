# Atlas IA — guía de Groq y lectura de GitHub (v0.4.4)

## Estado inicial
La funcionalidad está implementada y publicada, pero deliberadamente **sin credenciales**. La vista de chat muestra "falta GROQ_API_KEY"; el recomendador y el generador local funcionan sin IA. No necesitas proporcionar una clave a un chat ni hacer otro commit.

## Paso 1: obtener una clave

Abre https://console.groq.com/keys y genera una clave de API de tu propia cuenta Groq. Verifica que la cuenta esté en el plan gratuito y que tenga acceso al modelo multimodal \`qwen/qwen3.8-27b\`.

**Nunca publiques tu clave**, tampoco en mensajes de chat, GitHub Issues, logs, capturas ni código fuente.

## Paso 2: configurar Netlify

En https://app.netlify.com/ abre el proyecto \`uiux-atlas\`:

1. Entra en **Project configuration → Environment variables** (la UI puede cambiar de ubicación).
2. Pulsa **Add a variable**.
3. Key: **GROQ_API_KEY**.
4. Value: pega la clave completa en el campo secreto.
5. Scopes: **Functions**, o **All scopes** si no existe la opción específica.
6. Context: **Production** (y Deploy Previews solo si quieres probar allí).
7. Guarda.

**IMPORTANTE:** las funciones reciben las variables del entorno al desplegarse. Entra en Deploys y haz **Trigger deploy → Deploy site** (o redeploy). No hace falta otro commit: la clave permanece en Netlify.

Referencia: https://docs.netlify.com/build/functions/environment-variables/

## Paso 3: verificar el estado (sin exponer secretos)

En la web, entra en **Atlas IA**. La interfaz llama a **GET /api/atlas/chat**:

- \`configured: false\`: la variable no llegó a la función. Revisa scope y redeploy.
- \`configured: true\`: la variable está presente, pero aún se debe probar una consulta para confirmar validez.

No se devuelve la clave en la respuesta.

## Paso 4: pruebas de aceptación

1. **Crear proyecto:** "Quiero una web para una pollería moderna con delivery y WhatsApp".
2. Solicita colores y patrones, y prueba generar un prompt para Codex.
3. Adjunta una imagen JPG de tu menú o logo. Comprueba que Atlas IA hace observaciones realmente basadas en ella.
4. **Mejorar proyecto:** introduce una URL HTTPS pública y solicita optimizaciones.
5. Prueba un enlace de Instagram que requiera sesión: debe pedir captura, no inventar contenido.
6. Genera un prompt de rediseño que preserve rutas, base de datos, lógica y autenticación.
7. Simula cuota agotada: la interfaz debe permitir el generador local.

## Seguridad y presupuesto

Las funciones configuran límites nativos de Netlify (por dominio+IP, 6 solicitudes por minuto en chat y 10 en lectura de URLs) y un limitador temporal local adicional. Eso no crea una cuota global compartida de solicitudes, y Netlify puede tardar algunos segundos en aplicar límites. El plan Groq Free es limitado, no ilimitado. Supervisa el uso real antes de promocionar Atlas IA a un público numeroso.

Textos e imágenes se transmiten a Groq **solo cuando el visitante envía una petición con la clave configurada**. Enlaces HTTPS públicos se pueden leer en Netlify de forma independiente. No incluyas tokens privados en URLs. No se guardan imágenes ni conversaciones en una base de datos.

## Problemas comunes

- "Falta la clave": guarda \`GROQ_API_KEY\` en Netlify y vuelve a desplegar.
- "Clave no aceptada": verifica que la clave de Groq sea válida, no una clave de Google AI Studio.
- "Cuota agotada": revisa el panel de límites de Groq, no intentes eludirlos, usa el modo local.
- "Instagram no se pudo leer": adjunta una captura de la publicación pública con autorización.
- "API no responde en desarrollo": \`npm run dev\` sirve solo Vite; ejecuta \`npx netlify-cli dev\` para las funciones.
- "El enlace no muestra diseño": leer HTML no equivale a ver una captura. Adjunta la captura.

## Rutas y archivos

\`/api/atlas/chat\` → \`netlify/functions/atlas-chat.mjs\`
\`/api/atlas/inspect\` → \`netlify/functions/atlas-inspect.mjs\`

Modelo fijo inicial: \`qwen/qwen3.8-27b\`. Cuando Groq cambie disponibilidad, actualiza el modelo **solo después de verificar documentación y pruebas**.

Documentación: https://console.groq.com/docs/vision y https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/

## Inspección de proyectos GitHub sin web publicada

1. Abre **Atlas IA → Mejorar proyecto**.
2. Pega la URL **raíz** de un repositorio público, por ejemplo `https://github.com/usuario/proyecto`. En esta versión no se aceptan URLs de `issues`, `blob` ni repositorios privados.
3. Pulsa **Analizar GitHub**: se muestran nombre, rama, frameworks detectados y hasta ocho archivos relacionados con UI/UX. Esto funciona **sin la clave de Groq**.
4. Describe las mejoras que buscas o adjunta capturas de una versión local. Pulsa **Enviar**. Si Groq está configurado, Atlas IA analiza fragmentos de código relevantes y recomienda cambios con referencia a los archivos consultados. Si no lo está, se mantienen las sugerencias y el prompt **local**, sin fingir una revisión por un modelo.
5. Genera un prompt para Codex, Google AI Studio o Antigravity, y valida los cambios en tu proyecto original.

**No se ejecuta ni compila el código de GitHub, ni se crea un despliegue temporal.** Las recomendaciones basadas solo en archivos son estáticas y parciales; una captura permite comprobar la apariencia. La herramienta conserva los dos modos originales de Atlas IA.

### API y seguridad de GitHub

- Endpoint nuevo: **`POST /api/atlas/github`** con `{ "url": "https://github.com/usuario/proyecto" }`. Devuelve metadatos y rutas de archivos leídos, **no el código fuente**.
- El servidor usa la API pública GitHub REST, rechaza hosts ajenos y repositorios privados, excluye rutas sensibles y archivos de backend, y restringe las lecturas a ocho archivos pertinentes. Los extractos se acotan y filtran antes de enviarse a Groq.
- La función de lectura aplica límites de solicitudes y una caché temporal (cuando la misma instancia está activa); no hay almacenamiento permanente del repositorio.
- Sin credenciales de GitHub se puede consultar contenido público, pero sujeto a límites de GitHub. Si el uso aumenta, puede añadirse `GITHUB_READ_TOKEN` como variable secreta de **Netlify Functions**. Esto es opcional y no habilita repositorios privados en Atlas IA.
- Los comentarios de código y demás contenido del repositorio se tratan como datos no confiables, no como instrucciones de la aplicación.
- El usuario no debe introducir tokens, contraseñas, cookies o claves de GitHub ni de Groq en el campo de chat.
- El chat de Groq sigue requiriendo la clave `GROQ_API_KEY`, que se configura exclusivamente en Netlify.

### Pruebas nuevas

`node --test tests/atlas-github.test.mjs` usa una API de GitHub y un Groq simulados. No solicita acceso a proyectos reales ni emplea tokens. La CI de GitHub Actions ejecuta este test a través de `npm test`.

## Fallos con tres capturas y GitHub (v0.4.5)

El caso de prueba es **Atlas IA → Mejorar proyecto → repositorio público + hasta tres capturas + consulta Groq**. Si el repositorio aparece con la lista de archivos y el mensaje falla después, la lectura inicial sí funciona y el error está en el envío de la consulta o la respuesta del backend, pero los registros son necesarios para identificar la causa exacta.

La versión 0.4.5 hace las lecturas GitHub en lotes paralelos de 4, comprime las capturas de forma adaptativa (máximo ~320 KB de URL codificada por imagen), valida el tamaño total del mensaje, controla esperas y conserva texto/adjuntos al fallar. No afirma haber comprobado que la clave de Groq sea válida solo porque `GET /api/atlas/chat` informa `configured:true`.

Para diagnosticar un fallo persistente:
1. Probar una solicitud de texto simple a Atlas IA sin imágenes ni GitHub.
2. Repetir con una sola captura y, después, con tres capturas sin GitHub.
3. Probar GitHub sin imágenes; después combinar GitHub y una captura.
4. En **Netlify → Logs → Functions** (ubicación variable según versión), revisar la llamada `/api/atlas/chat`. Anotar duración, código HTTP y mensaje de error, **nunca el valor de GROQ_API_KEY ni el contenido privado**.
5. Si Groq devuelve error de cuota, clave inválida, formato de respuesta o modelo no disponible, seguir el mensaje correspondiente; no atribuirlo automáticamente al tamaño de la imagen.
6. Si solo falla en una red móvil, probar con otra conexión. Evitar VPNs o bloqueadores que puedan interrumpir el envío.

No se cambió el modelo `qwen/qwen3.8-27b`; Groq documenta su compatibilidad con imágenes y JSON mode. El límite público de ejecución síncrona de Netlify es 60 segundos, pero una pérdida de conexión del navegador puede producirse antes. En los tests de CI las llamadas de red están simuladas, por lo que el comportamiento real debe validarse en Netlify.

## Cómo poner referencias en Atlas IA — v0.4.6

### 1. Elegir objetivo
- **Crear proyecto:** quieres comenzar desde cero y proporcionar estilos, logos, inspiraciones y enlaces de ejemplo.
- **Mejorar proyecto:** tienes una web, repo o prototipo y quieres rediseñarlo sin romper la lógica.
Las áreas de enlaces e imágenes son iguales en ambos modos.

### 2. Enlaces: **un único campo**
1. Copia la URL pública completa desde el navegador (por ejemplo `https://instagram.com/p/...`, `https://www.linkedin.com/posts/...`, `https://github.com/usuario/repositorio` o `https://ejemplo.com`).
2. Pégala en **Enlaces** y pulsa **Agregar** o Enter.
3. Repite hasta cuatro veces para combinar referencias. Puedes consultar y eliminar cada tarjeta.
4. Cuando se pueden leer metadatos públicos, se muestran título/descripción/miniatura Open Graph. La miniatura no equivale a ver un diseño funcionando. GitHub permite leer código estático; el primer repo se inspecciona a fondo y los restantes se mencionan como referencias.
5. Instagram, LinkedIn y otras redes pueden bloquear la lectura. Si aparece «Lectura limitada», **sube una captura**. No se solicitan credenciales ni se intenta eludir login.

### 3. Imágenes: **separadas de enlaces**
1. Pulsa **Agregar imágenes**, abre la galería/archivos y selecciona hasta tres JPG, PNG o WebP.
2. Úsalas para enseñar capturas de Instagram/LinkedIn, logos, menús, secciones o diseños.
3. Verifica las miniaturas; puedes quitar cada imagen. Atlas prepara una paleta aproximada localmente.

### 4. Pedir recomendaciones
Escribe qué quieres lograr o conservar; pulsa **Enviar**. Con Groq configurado, el asistente analiza los datos accesibles y las capturas; sin Groq funciona el recomendador y el prompt local. En **Mejorar proyecto**, preservar rutas, compras, autenticación, APIs y demás lógica salvo orden explícita.

### Contrato técnico
- `POST /api/atlas/chat` admite `sourceUrls: string[]` con máximo cuatro HTTPS públicos, más `images` con máximo tres imágenes; por compatibilidad también acepta `sourceUrl: string`.
- `netlify/functions/lib/atlas-references.mjs` valida/deduplica URLs, reconoce proveedores y consulta enlaces en paralelo; solo el primer GitHub tiene lectura profunda de código.
- Devuelve `references` con estado `read`, `metadata`, `limited` o `link_only`, con título/miniatura solo cuando estén disponibles. El contenido de código no se devuelve al navegador.
- El frontend no debe clasificar el título/metadato/thumbnail como «vista visual confirmada».
- `netlify/functions/lib/security.mjs` valida la URL pública de `og:image` sin descargarla desde Netlify; cuando se visualiza, el navegador usa carga diferida y sin referrer. Este recurso externo puede no estar disponible.
- Los tests de `tests/atlas-references.test.mjs` y `src/lib/atlas-ai.test.ts` verifican proveedor, input unificado, privacidad, lectura limitada y prompts con múltiples enlaces.

### Limitaciones explícitas
No hay vista previa completa de publicaciones privadas, fotos detrás de inicio de sesión ni render automático de aplicaciones. No pedir al usuario datos de autenticación. El usuario puede adjuntar capturas para una referencia visual real.
