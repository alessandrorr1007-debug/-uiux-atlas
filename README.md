# UIUX Atlas — v0.3.0

[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/alessandrorr1007-debug/-uiux-atlas/ci.yml?branch=main&label=Tests)](https://github.com/alessandrorr1007-debug/-uiux-atlas/actions)
[![Version](https://img.shields.io/badge/versión-0.3.0-8b82ff)](./package.json)

**UIUX Atlas** es un diccionario interactivo de **406 patrones y conceptos UI/UX** en español, con nombres técnicos, explicaciones, casos de uso y generador de prompts para Google AI Studio, Codex y Antigravity.

**Web:** https://uiux-atlas.netlify.app/

## Catálogo v0.3.0

- **118 entradas anteriores conservadas**, con los mismos IDs para mantener favoritos y selecciones.
- **288 patrones adicionales** organizados en **24 familias especializadas** de 12 elementos cada una. Los nombres son únicos en todo el catálogo.
- **8 categorías generales** para navegación sencilla y filtro adicional por familia (selector con grupos).
- Búsqueda por nombre técnico, descripción, caso de uso y familia en español (ignora mayúsculas y tildes).
- Fichas individuales con descripción, cuándo utilizarlo, recomendaciones y prompt listo para copiar.
- Demostraciones **individuales** de 24 patrones base; las demás fichas muestran un ejemplo educativo **representativo de su categoría**, no una simulación específica del patrón.
- Favoritos y selección múltiple de patrones guardados en el navegador.
- Generador de prompts de seis decisiones; sin claves de API, IA externa ni consumo de tokens.

### Las 24 familias nuevas

| Área | Familias (12 patrones cada una) |
|---|---|
| Navegación y estructura | Navegación avanzada, Estructuras de interfaz, Contenido y lectura |
| Interacción y datos | Controles de entrada, Flujos de formularios, Búsqueda y descubrimiento, Tablas empresariales, Gráficos y visualizaciones, Dashboards y analítica |
| Herramientas especializadas | Editores de contenido, Canvas y diagramas, Multimedia y documentos, Mapas y geolocalización |
| Negocio y usuarios | Comercio electrónico, Pagos y suscripciones, Identidad y seguridad, Colaboración |
| Experiencia digital | Estados y errores, Gestos e interfaces móviles, Accesibilidad, Interfaces para IA, Marketing y conversión, Educación, POS y operaciones comerciales |

Datos: `src/data/expansion.ts`, que exporta `expansionFamilies` (24) y `expansion` (288). Los campos `family` y `kind` son opcionales para preservar compatibilidad con las 118 fichas anteriores.

## Funcionalidades existentes de v0.2.0

- Laboratorio con 24 demostraciones específicas interactivas.
- 20 plantillas originales (12 webs y 8 aplicaciones).
- Auditoría de 12 errores frecuentes y 10 criterios de interfaz comercial, **manual**.
- Estudio con 54 propuestas originales de fotografía; **genera prompts de texto**, no imágenes.
- Modo claro/oscuro, cuatro acentos y diseño responsive.

## Desarrollo

Node.js 20.19+ (recomendado Node.js 22):

```bash
npm install
npm run dev
npm test
npm run build
```

GitHub Actions ejecuta instalación, pruebas y compilación. La configuración de `netlify.toml` admite despliegues automáticos desde GitHub; publicar los cambios de `main` puede activar Netlify.

## Arquitectura

- `src/data/components.ts` — unión de 80 entradas base, 38 ampliaciones v0.2 y 288 patrones v0.3.
- `src/data/additions.ts` — 38 entradas anteriores que conservan su ID.
- `src/data/expansion.ts` — familias y patrones nuevos, organizados como datos.
- `src/types.ts` — contrato de componentes, con metadatos opcionales.
- `src/lib/catalog.ts` — búsqueda y filtrado por categoría/familia.
- `src/lib/prompt.ts` — generador local de instrucciones.
- `src/components/Preview.tsx` — ejemplos representativos de las ocho categorías.
- `src/components/PatternDemo.tsx` — demostraciones específicas existentes.
- `src/components/Workspace.tsx` — laboratorio, plantillas, auditoría y estudio fotográfico.
- `docs/RELEASE_0.3.md` — alcance de la ampliación.

## Alcance y honestidad del catálogo

Las 406 entradas abarcan componentes, patrones, comportamientos, visualizaciones y flujos de interfaz: **no todas son componentes de código independientes**. Sus textos y prompts son originales; algunas entradas representan variantes avanzadas de conceptos relacionados. Las demostraciones individuales de los 288 patrones añadidos **no están implementadas en esta versión**. No se ha integrado Atlas AI, y no hay backend, autenticación, análisis de capturas, generación de imágenes ni servicios de IA conectados.

Referencias de investigación y terminología (consulta educativa; no redistribución de código ajeno): [IBM Carbon](https://carbondesignsystem.com/), [Ant Design](https://ant.design/components/overview/), [PatternFly](https://www.patternfly.org/), [MUI X](https://mui.com/x/), [AWS Cloudscape](https://cloudscape.design/), [W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/), [GOV.UK Design System](https://design-system.service.gov.uk/), [React Flow](https://reactflow.dev/), [tldraw](https://tldraw.dev/), [Vercel AI Elements](https://elements.ai-sdk.dev/). Los nombres descriptivos son vocabulario general del sector.
