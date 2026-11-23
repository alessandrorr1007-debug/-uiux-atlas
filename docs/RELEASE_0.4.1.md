# UIUX Atlas v0.4.1 — Diseño Soft Balance

## Cambios visuales

- Paleta suave **mineral**: fondos gris-azulados, lavanda, azul niebla, salvia y arcilla, sin negros absolutos ni blancos intensos.
- Apariencia inicial: **Niebla suave**; se conservan la preferencia guardada y el modo alternativo **Noche suave**.
- Acentos adaptativos a ambos temas, buscando contraste suficiente para texto e interacción.
- Portada con mensaje sencillo, CTA hacia Atlas IA y biblioteca, y datos claros del catálogo.
- Tres accesos de inicio: biblioteca de patrones, Atlas IA y laboratorio interactivo.
- Menú lateral organizado por objetivo: **Empezar, Diccionario, Herramientas de diseño y Mis recursos**.
- Categorías expandibles para reducir ruido en desktop y móvil, sin eliminar categorías ni funciones.
- Mejoras en barras, filtros, tarjetas, espacios, bordes, sombras y estados de foco; los estilos de Atlas IA y de Atlas Studio siguen usando las variables del tema.
- Corrige el estado visual del botón «Todos» cuando se está filtrando por una familia, y evita que el dock de prompts tape otras herramientas.

## Garantías

- Se conservan los **406 patrones**, sus IDs, favoritos, selección y generador de prompts.
- El cambio **no activa Groq** ni modifica la API; sigue pendiente `GROQ_API_KEY` en Netlify.
- Se mantiene el flujo de enlaces públicos, imágenes y los **dos modos** de Atlas IA.
- Corrige el comando de pruebas `npm test` para evitar que Vitest descubra también las pruebas Node (`tests/*.test.mjs`). Ahora ejecuta `vitest run src` y después `npm run test:server`.
- `npm run build` sigue verificando TypeScript y Vite. No se cambian dependencias.

## Checklist de validación manual después del deploy

- Comparar la apariencia de inicio, tarjetas y Atlas IA en vista ancha y móvil.
- Alternar «Niebla suave» y «Noche suave» y cambiar los 4 acentos; comprobar lectura y contraste.
- Abrir el menú móvil, desplegar categorías y visitar una categoría; la selección debe quedar destacada.
- Navegar desde cada acceso rápido, filtrar 406 patrones y comprobar favoritos persistentes.
- Abrir y copiar prompts, visitar las 4 herramientas, probar el modo local de Atlas IA sin clave.
- Validar que los tests y el build de CI pasen.
