# UIUX Atlas

**UIUX Atlas** es una biblioteca educativa de **80 patrones de UI/UX**, con búsqueda, filtros, favoritos, demostraciones interactivas por familia y un constructor de prompts para **Google AI Studio, Codex y Antigravity**.

![Estado](https://img.shields.io/badge/versión-0.1.0-7c85ff) ![Stack](https://img.shields.io/badge/stack-React%20%2B%20TypeScript-blue)

## Funcionalidades
- Explorar 80 patrones divididos en 8 categorías.
- Buscar ignorando mayúsculas y tildes; filtrar por categoría y favoritos.
- Abrir una ficha con una demostración interactiva **representativa de su categoría**.
- Seleccionar múltiples patrones y generar un prompt personalizado y copiable.
- Cambiar tema (claro/oscuro) y color de acento.
- Guardar favoritos y preferencias localmente (localStorage).
- Layout responsive, navegación por teclado y movimiento reducido.

> **Alcance v0.1:** las demos reutilizan prototipos interactivos por familia; todavía no existe una demo individual exhaustiva para cada patrón. Sin backend, cuentas, pagos ni servicios de IA conectados. El generador compone texto localmente y no consume tokens.

## Desarrollo
Requiere Node.js 20.19+ (se recomienda Node.js 22).
```bash
npm install
npm run dev
npm test
npm run build
```
Abrir la dirección local mostrada por Vite.

## Despliegue
Compatible con **Netlify** (comando `npm run build`, carpeta `dist`) y **Vercel**. La configuración de SPA se incluye en `netlify.toml` y `vercel.json`. No hay variables de entorno necesarias.

## Estructura
- `src/data/components.ts`: catálogo editable
- `src/components/Preview.tsx`: vistas interactivas de ejemplo
- `src/lib/prompt.ts`: generador de prompts
- `src/lib/catalog.ts`: búsquedas y filtros
- `src/lib/storage.ts`: preferencias y favoritos locales
- `docs/AI_INSTRUCTIONS.md`: normas para agentes IA

## Privacidad
Sin analítica, sin inicio de sesión y sin envío de información a servidores. Solo se guardan preferencias/favoritos en el navegador; el portapapeles se usa cuando lo solicita el usuario.

## Próximos pasos
Demos específicas por patrón, snippets de código revisados, exportación/importación de colecciones, editor de design tokens y pruebas E2E.
