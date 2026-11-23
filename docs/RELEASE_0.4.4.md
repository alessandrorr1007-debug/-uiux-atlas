# UIUX Atlas v0.4.4 — Análisis de GitHub desde Atlas IA

**Un solo cambio de producto:** permitir recomendar mejoras UI/UX para proyectos web todavía no publicados. No añade un tercer modo: se integra dentro de **Mejorar proyecto**.

## Funciones
- Reconoce enlaces raíz a repositorios **públicos de GitHub**, HTTPS solamente.
- Lee metadatos de la rama principal, estructura y **hasta ocho archivos** del frontend con la API pública de GitHub, sin clonar ni ejecutar el repositorio.
- Clasifica frameworks típicos (React, Next.js, Vue, Svelte, Angular, Vite, Tailwind) cuando `package.json` resulta legible.
- Ofrece una ficha de inspección con nombre, rama, tecnologías y rutas de archivos revisados. El código no se expone en la respuesta del endpoint de inspección.
- Groq puede recibir fragmentos relevantes y filtrados para formular recomendaciones específicas por archivo. Deberá separar evidencias de inferencias, priorizar mejoras y conservar negocio, autenticación, APIs, pagos y rutas.
- Sin Groq, el usuario puede consultar el repositorio público y generar **un prompt local** que enumere archivos concretos a revisar.
- Compatibilidad con enlaces web HTML e imágenes, y con los dos modos del asistente.

## Límites y seguridad
- Solo URLs `https://github.com/owner/repo`; no lectura de repositorios privados, enlaces arbitrarios ni ejecución del código.
- GitHub REST bajo un host fijo, límites de respuesta, 8 archivos, filtro de backend/secretos y líneas sensibles, y caché temporal de 5 minutos.
- Rate limiting del endpoint; `GITHUB_READ_TOKEN` opcional guardado solo en Netlify Functions para mejorar cuota de lectura pública.
- Lectura **estática y parcial**: no prueba interfaz renderizada, UX de usuario, comportamiento real, accesibilidad ni seguridad. Para corroborar visualmente se requieren capturas.
- El material del repositorio es dato externo, no instrucciones para el asistente.

## Validación
`npm test` ejecuta pruebas de parsers, exclusión de secretos, privacidad de metadatos, lectura con API simulada y chat simulado. `npm run build` verifica TypeScript y Vite. No se requieren nuevas dependencias.

## Implementación
- `netlify/functions/lib/github-repo.mjs`
- `netlify/functions/atlas-github.mjs`
- `netlify/functions/atlas-chat.mjs`
- `src/components/AtlasIA.tsx`
- `src/lib/atlas-ai.ts`
- `src/atlas-ai.css`
- `tests/atlas-github.test.mjs`
