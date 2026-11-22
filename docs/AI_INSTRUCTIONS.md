# Instrucciones para agentes IA (Codex, Antigravity, Google AI Studio)

## Objetivo
UIUX Atlas es una aplicación React + TypeScript de referencia UI/UX con catálogo de 80 patrones, demos y generador de prompts.

## Restricciones
- No agregues backend, credenciales o llamadas innecesarias.
- Mantén los datos del catálogo en `src/data/components.ts`.
- Conserva identificadores de componentes estables, ya que los favoritos se guardan por `id` en localStorage.
- Mantén las vistas accesibles: teclado, foco visible, contraste, botones reales y preferencias de movimiento reducido.
- Las demostraciones son ejemplos educativos, no implementaciones completas de cada patrón. Identifica claramente los ejemplos.
- Nunca presentes un elemento simulado como integración real.
- Conserva y amplía las pruebas al cambiar filtros, catálogo o generador de prompts.

## Comandos
```bash
npm ci
npm run dev
npm test
npm run build
```

## Flujo recomendado
1. Revisa qué archivos toca el cambio y conserva funciones existentes.
2. Cambia componentes/datos de manera incremental.
3. Ejecuta pruebas y compilación; corrige errores antes de dar el trabajo por terminado.
4. Describe los archivos afectados y cómo comprobarlo manualmente.
