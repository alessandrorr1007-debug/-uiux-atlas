# Release UIUX Atlas v0.4.0 — Atlas IA preparada

## Implementación
- Nueva sección de menú «Atlas IA» con **Crear proyecto** y **Mejorar proyecto**.
- Chat contextual en memoria; texto, URL pública e imágenes JPG/PNG/WebP.
- Compresión de imágenes cliente, vista de adjuntos, extracción local aproximada de paleta HEX, selección de patrones.
- Conocimiento del diccionario con 406 patrones, selección de un subconjunto relevante por solicitud para ahorrar tokens.
- Prompt profesional para Codex, Google AI Studio o Antigravity.
- Flujo local de recomendación/prompts mientras no exista una clave Groq, señalado como **sin IA**.
- API \`/api/atlas/chat\` (estado + conversación); API \`/api/atlas/inspect\` (HTML público).
- Seguridad: origen, límites de cuerpo/imagen/historial, SSRF robusto, limitación por IP vía Netlify, validación de salida y errores de proveedor.
- Pruebas automatizadas de recomendaciones y de Netlify Functions con Groq simulado.

## Pendiente de activación
- Configurar \`GROQ_API_KEY\` como variable privada de Netlify, scope Functions y redeploy.
- Verificar una llamada real, cuota del modelo y compatibilidad en producción.
- Verificación visual en navegador móvil/escritorio después del despliegue.

## Limitaciones documentadas
- No puede consultar publicaciones de Instagram privadas ni saltarse su autenticación.
- La lectura de un enlace se limita al HTML público; no usa un navegador de capturas ni inspecciona CSS dinámico.
- No entrena modelos propios y no ofrece uso gratuito ilimitado.
- Sin cuentas ni historial persistente compartido.
- Las demos del catálogo siguen siendo 24 individuales; las restantes son ejemplos por categoría.
- Los límites por IP no son un límite global de consumo multiusuario.
