# UIUX Atlas

**UIUX Atlas v0.2.0** es una biblioteca interactiva en español para aprender patrones de interfaces, probarlos y crear instrucciones profesionales para Google AI Studio, Codex y Antigravity.

**Proyecto:** [GitHub](https://github.com/alessandrorr1007-debug/-uiux-atlas)

## Qué hay en la versión 0.2.0

- **118 patrones de UI/UX:** conserva los 80 IDs iniciales y agrega 38 conceptos complementarios sin reemplazar favoritos.
- **Laboratorio:** 24 demostraciones con controles y estados locales, distintas para cada patrón.
- **Constructor de prompts:** seis decisiones (proyecto, público, estilo, estructura/portada, interacciones, pantalla) y componentes seleccionados.
- **20 plantillas por rubro:** 12 sitios web y 8 aplicaciones, con propuestas originales.
- **Auditoría manual:** 12 errores frecuentes y 10 buenas prácticas; marca qué cumple y qué debe mejorar, y genera un prompt de correcciones.
- **Estudio fotográfico:** 54 estilos originales en seis rubros (comida, bebidas, ropa, cosmética, tecnología, joyería); crea prompts, **no genera imágenes**.
- **Biblioteca:** búsqueda, filtros, favoritos, modo claro y oscuro, cuatro acentos, selecciones para el generador.
- **Privacidad:** favoritos, configuración y progreso de auditoría guardados localmente sin cuentas, backend ni API de IA.

> Importante: además de las 24 demostraciones individuales, las demás fichas ofrecen una demostración **representativa de su familia**, no una implementación específica exhaustiva. Las auditorías requieren una evaluación manual; la plataforma no rastrea sitios ni analiza capturas automáticamente. Las plantillas son propuestas orientativas y sus cifras o ejemplos no son datos de negocio reales.

## Requisitos y comandos

Node.js 20.19+ (recomendado Node.js 22).

```bash
npm install
npm run dev
npm test
npm run build
```

Para uso en red local, Vite muestra una dirección al iniciar el servidor. Los tests usan Vitest. GitHub Actions ejecuta instalación, tests y compilación.

## Arquitectura

- `src/data/components.ts` — catálogo base estable; `src/data/additions.ts` — ampliaciones.
- `src/data/sectors.ts` — 20 rubros.
- `src/data/photography.ts` — 54 estilos.
- `src/data/audit.ts` — 22 criterios de revisión manual.
- `src/components/Workspace.tsx` — las cuatro áreas nuevas.
- `src/components/PatternDemo.tsx` — 24 demostraciones individuales.
- `src/components/Preview.tsx` — ejemplos generales de las ocho categorías.
- `src/lib/prompt.ts` y `src/lib/studio.ts` — generadores de texto de prompts.
- `src/lib/storage.ts` — preferencias del navegador con tratamiento de errores.
- `docs/AI_INSTRUCTIONS.md` — normas para asistentes de programación.

## Despliegue

La web es estática. Incluye `netlify.toml` y `vercel.json`. En Netlify: comando `npm run build`, carpeta `dist`; no son necesarias variables de entorno. **No se despliega automáticamente al crear este repositorio.**

## Seguridad, calidad y crédito

El usuario mantiene el control de sus datos; se guarda localmente solo información de preferencias y auditoría, sin envío al servidor por parte de esta aplicación. El portapapeles se usa por acción explícita. El contenido educativo es original, basado en terminología UI/UX de uso general y en la inspiración de la guía pública Capa Zero; no se copian literalmente sus prompts ni sus recursos gráficos. Referencia educativa: https://capazero.app/#diccionario

La prioridad de cada rediseño es preservar la lógica funcional y comprobar accesibilidad, rendimiento móvil y compilación. Consulta `docs/RELEASE_0.2.md` para el alcance y las limitaciones.

## Próximas versiones

Demostraciones individuales adicionales para el resto del catálogo, exportación/importación de colecciones, navegación avanzada accesible, pruebas E2E y editor de design tokens.
