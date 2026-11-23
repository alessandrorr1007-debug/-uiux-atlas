# UIUX Atlas como Skill y Plugin (v0.1.0)

**Este paquete es un plugin de conocimientos UI/UX con un Skill integrado.** No es una extensión de navegador, no modifica la web existente ni usa la API de Groq.

## Ubicación

```
plugins/uiux-atlas/
├── plugin.json
└── skills/
    └── uiux-atlas/
        ├── SKILL.md
        └── references/
            ├── patterns.json
            └── implementation-guidelines.md
.agents/plugins/marketplace.json
```

El catálogo del Skill consta de **406 patrones únicos** y deriva de la misma información pública del repositorio (80 básicos + 38 ampliaciones + 288 nuevas entradas). Los datos están empaquetados para usarse sin consultar la web durante cada conversación.

## Funcionalidades

- **Crear proyecto:** definir funcionalidad, pantallas, estilo y prompt a partir de texto, imágenes y enlaces permitidos.
- **Mejorar proyecto:** proponer UI/UX, priorizar cambios y preparar un prompt que conserve la lógica existente.
- Recomendaciones de patrones por nombre técnico e ID estable.
- Paleta y dirección visual basadas en materiales que el host realmente puede analizar.
- Prompts para Codex, Google AI Studio o Antigravity.

## Instalar para probar en Codex/ChatGPT desktop

El marketplace local está en `.agents/plugins/marketplace.json`.

1. Clona o abre el repositorio en el equipo donde usas Codex.
2. En Codex, registra la fuente del plugin con `codex plugin marketplace add ./` desde la raíz del repositorio, **si el cliente admite marketplaces locales**.
3. En la app de ChatGPT para escritorio, abre **Plugins** y el marketplace **UIUX Atlas — Plugins**; instala **UIUX Atlas**.
4. Invoca `@uiux-atlas` donde sea compatible, o usa el selector de Skills/Plugins.
5. Prueba: «Usa UIUX Atlas para crear una web de pollería con delivery y genera un prompt para Codex».

La ubicación exacta de cada selector depende de la aplicación/versión. Si el plugin no aparece, reinicia el cliente o instala el Skill manualmente desde `plugins/uiux-atlas/skills/uiux-atlas/` en el directorio de Skills admitido por tu entorno. No afirmes que se instaló solo por estar en GitHub.

## Distribución y publicación

El manifiesto sigue el estándar portable de Agent Plugins; la fuente local usa el formato de marketplaces de la documentación de OpenAI:

- https://developers.openai.com/plugins/build/plugins
- https://learn.chatgpt.com/docs/build-skills
- https://developers.openai.com/plugins/quickstart

**Importante:** subirlo a GitHub **no equivale a publicarlo** en el directorio público de ChatGPT/Codex. Para distribución pública hace falta conectar, instalar, verificar los requisitos y completar el proceso de publicación/revisión de la plataforma. El usuario debe decidir e instalarlo explícitamente.

## ¿Por qué no se incluye todavía MCP?

Esta primera versión usa el catálogo **local empaquetado** y no necesita servidor, API key, autenticación ni llamadas externas. Una segunda versión puede incorporar MCP para consultar la versión más reciente de los patrones desde la web, sin duplicar datos y con herramientas de lectura (search, get_pattern, list_categories). En ese caso se agregaría `mcp.json` y un servidor HTTP seguro; no lo declares como funcional hasta desplegarlo y probarlo.

## Mantenimiento

Cuando cambie el total de patrones, actualiza `references/patterns.json`, conserva los IDs, modifica las pruebas y actualiza la versión del plugin. Evita copiar imágenes ajenas y mantén las instrucciones del Skill breves.
