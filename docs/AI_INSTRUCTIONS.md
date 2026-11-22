# Guía para IA — UIUX Atlas v0.2.0

## Enfoque
Aplicación React + TypeScript + Vite + Tailwind CSS. **Sin backend** ni secretos. La interfaz permite aprender componentes de diseño, probar demostraciones locales y componer prompts de implementación.

## Arquitectura a respetar
- `src/data/components.ts` es la lista original de 80 patrones, con IDs de favoritos persistentes; nunca renombres ni elimines sus IDs.
- `src/data/additions.ts` contiene 38 ampliaciones: evita nombres/IDs duplicados.
- `src/data/sectors.ts`, `src/data/photography.ts`, `src/data/audit.ts` son los datasets originales de los módulos.
- `src/components/PatternDemo.tsx` registra 24 demos individuales; `Preview.tsx` es genérico.
- `src/components/Workspace.tsx` aloja laboratorio, sectores, auditoría y fotografía.
- Los generadores de prompts están en `src/lib/prompt.ts` y `src/lib/studio.ts`.
- `src/lib/storage.ts` encapsula almacenamiento local con fallback.

## Restricciones
1. No introducir cuentas, API de pago, backend, analítica o llamadas a modelos.
2. Preservar la lógica y funcionalidades existentes al retocar interfaces.
3. Evitar copiar prompts largos, material gráfico o textos de guías ajenas.
4. Etiquetar las demostraciones y números ficticios como ejemplos, nunca como integraciones verdaderas.
5. Asegurar navegación con teclado, contraste, foco visible, movilidad y prefers-reduced-motion.
6. No presentar un diagnóstico de auditoría como automático: es una autoevaluación manual.
7. Guardar preferencias solo en el navegador; contemplar almacenamiento deshabilitado.
8. Mantener la carga diferida del módulo `Workspace`.

## Verificación
```bash
npm install
npm test
npm run build
```
Comprueba manualmente los cuatro módulos y móvil/desktop; comprueba que el constructor copia prompts y conserva la lógica.

## Próximas mejoras
Añadir tests de interacción E2E, accesibilidad de foco de los diálogos, más demos individuales y documentar acciones reales de usuario.
