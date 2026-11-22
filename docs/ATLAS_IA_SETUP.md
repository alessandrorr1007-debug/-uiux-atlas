# Atlas IA — guía de activación de la API (v0.4.0)

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
