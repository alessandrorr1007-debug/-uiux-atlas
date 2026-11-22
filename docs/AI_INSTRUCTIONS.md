# Instrucciones para agentes — UIUX Atlas v0.3.0

## Meta
Diccionario y estudio UI/UX estático, basado en React + TypeScript + Vite + Tailwind CSS. **Sin backend, tokens de IA ni cuentas.**

## Garantías de compatibilidad
- Preserva los **80 IDs base** en `src/data/components.ts`.
- Preserva los **38 IDs** de `src/data/additions.ts`.
- Mantén los **288 IDs estables** de `src/data/expansion.ts`. Son 24 familias de 12 patrones.
- El total debe ser 406, sin duplicados de `id` ni `name` normalizado.
- Cada entrada nueva debe mostrar nombre, descripción, caso de uso, guía de implementación, categoría y familia.
- Las ocho categorías originales son principales; las 24 familias nuevas son filtros secundarios para no saturar el menú.
- No elimines favoritos, preferencias o selecciones de localStorage ni cambies sus claves.
- Si agregas una demo individual, regístrala en `PatternDemo.tsx`, con sus pruebas.
- En todas las otras fichas indica que la demostración es representativa de la categoría, nunca una demo específica inexistente.

## Restricciones
- No agregar APIs externas ni introducir secretos al frontend.
- No copiar código, prompts extensos o gráficos de guías y sitios de terceros sin revisar licencia.
- No inventar reseñas, precios, métricas, transacciones o resultados reales.
- Conservar estilos, modo claro y oscuro, accesibilidad, foco, movimiento reducido y rendimiento móvil.
- No alterar funciones existentes al editar UI/UX.

## Archivos principales
- `src/data/expansion.ts`: 24 familias de términos nuevos.
- `src/data/components.ts`: composición del catálogo de 406.
- `src/lib/catalog.ts`: búsqueda por texto, categorías y familia.
- `src/lib/catalog.test.ts`: pruebas de integridad del catálogo.
- `src/App.tsx`: filtros, fichas, favoritos y generador de prompts.
- `src/studio.css`: estilos del filtro familiar y módulos especializados.

## Verificaciones requeridas
```bash
npm install
npm test
npm run build
```

Antes de subir, valida IDs, nombres, familias y referencias de plantillas. No aumentes versiones ni el tamaño del catálogo sin pruebas actualizadas.

## Siguientes mejoras
Implementar demos individuales para nuevos patrones progresivamente, exportación e importación de colecciones, filtros de tipo de patrón y revisión de accesibilidad con pruebas E2E.
