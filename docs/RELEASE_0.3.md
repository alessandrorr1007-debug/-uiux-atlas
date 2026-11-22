# UIUX Atlas v0.3.0 — expansión del diccionario

## Alcance confirmado de código
- 118 patrones anteriores conservados.
- 288 patrones nuevos en 24 familias de 12.
- Total: **406 entradas**, con IDs y nombres únicos.
- Cada patrón nuevo contiene descripción, contexto de uso y guía original para generar instrucciones.
- Búsqueda por etiqueta de familia en español y selector de 24 familias agrupadas en ocho categorías amplias.
- Actualización de cifras, textos, tests y documentación.

## Límites explícitos
- No hay 288 nuevas demos individuales; los patrones añadidos muestran previews representativos de su categoría.
- No se añadieron servicios de IA ni consumo de API.
- El diccionario integra patrones de naturaleza diversa (componentes, interacciones, visualizaciones y procesos).
- Se conservan los módulos de la versión 0.2.0.

## Verificación
Ejecutar:
```bash
npm install
npm test
npm run build
```
Comprobar manualmente que la página publique 406 entradas y permita filtrar, buscar y copiar prompts. Verifica las categorías, las 24 familias, favoritos anteriores y estados móviles.

## Fuentes de referencia
IBM Carbon, Ant Design, PatternFly, MUI X, AWS Cloudscape, W3C APG, GOV.UK Design System, React Flow, tldraw y Vercel AI Elements. Contenido explicativo y prompts redactados específicamente para UIUX Atlas; no se reproducen capturas, código o textos extensos de terceros.
