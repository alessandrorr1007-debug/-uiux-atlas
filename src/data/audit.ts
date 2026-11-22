export type AuditCriterion = { id: string; title: string; detail: string; fix: string; group: 'errors' | 'principles' }
export const auditCriteria: AuditCriterion[] = [
  {
    "id": "error-1",
    "title": "Contraste insuficiente",
    "detail": "Textos difíciles de leer sobre imágenes o superficies.",
    "fix": "Verifica contraste WCAG AA, usa superposiciones discretas y nunca confíes solo en el color.",
    "group": "errors"
  },
  {
    "id": "error-2",
    "title": "Demasiadas llamadas a la acción",
    "detail": "Varias acciones primarias compiten visualmente.",
    "fix": "Una acción principal por bloque y acciones secundarias jerarquizadas.",
    "group": "errors"
  },
  {
    "id": "error-3",
    "title": "Titular genérico",
    "detail": "La portada no comunica la propuesta de valor.",
    "fix": "Explica el beneficio principal con palabras concretas, sin afirmaciones no verificadas.",
    "group": "errors"
  },
  {
    "id": "error-4",
    "title": "Tipografías inconexas",
    "detail": "Demasiados estilos reducen consistencia.",
    "fix": "Usa una escala tipográfica y familias limitadas.",
    "group": "errors"
  },
  {
    "id": "error-5",
    "title": "Espaciado irregular",
    "detail": "Separaciones cambiantes sin estructura.",
    "fix": "Define una escala de espaciado consistente basada en tokens.",
    "group": "errors"
  },
  {
    "id": "error-6",
    "title": "Lectura excesivamente ancha",
    "detail": "Los párrafos largos requieren mayor esfuerzo.",
    "fix": "Limita anchura de lectura y aumenta interlineado.",
    "group": "errors"
  },
  {
    "id": "error-7",
    "title": "Controles ambiguos",
    "detail": "Los elementos clicables no parecen interactivos.",
    "fix": "Diferencia estados hover, focus, pressed y disabled.",
    "group": "errors"
  },
  {
    "id": "error-8",
    "title": "Imágenes genéricas",
    "detail": "Las imágenes no representan el producto real.",
    "fix": "Prefiere fotografías propias, con permiso, y describe correctamente su contexto.",
    "group": "errors"
  },
  {
    "id": "error-9",
    "title": "Carrusel automático invasivo",
    "detail": "La portada cambia sin permitir control.",
    "fix": "Prioriza mensaje principal estable o controles accesibles y pausa.",
    "group": "errors"
  },
  {
    "id": "error-10",
    "title": "Formularios extensos",
    "detail": "Se solicitan datos innecesarios.",
    "fix": "Reduce campos al mínimo imprescindible y explica el uso de datos.",
    "group": "errors"
  },
  {
    "id": "error-11",
    "title": "Iconografía inconsistente",
    "detail": "Mezcla de estilos visuales y pesos.",
    "fix": "Mantén un sistema coherente de iconos.",
    "group": "errors"
  },
  {
    "id": "error-12",
    "title": "Jerarquía excesivamente centrada",
    "detail": "Todos los bloques se ven iguales.",
    "fix": "Alinea contenido extenso para facilitar lectura, reserva centrado para casos puntuales.",
    "group": "errors"
  },
  {
    "id": "principle-1",
    "title": "Claridad inicial",
    "detail": "El valor de la propuesta es evidente en la primera pantalla.",
    "fix": "Revisa este criterio y corrige la interfaz cuando no se cumpla.",
    "group": "principles"
  },
  {
    "id": "principle-2",
    "title": "Una prioridad visual",
    "detail": "Cada sección destaca una acción principal clara.",
    "fix": "Revisa este criterio y corrige la interfaz cuando no se cumpla.",
    "group": "principles"
  },
  {
    "id": "principle-3",
    "title": "Confianza real",
    "detail": "Las reseñas y garantías usadas son auténticas, no inventadas.",
    "fix": "Revisa este criterio y corrige la interfaz cuando no se cumpla.",
    "group": "principles"
  },
  {
    "id": "principle-4",
    "title": "Beneficios concretos",
    "detail": "Los contenidos describen resultados que comprende el público.",
    "fix": "Revisa este criterio y corrige la interfaz cuando no se cumpla.",
    "group": "principles"
  },
  {
    "id": "principle-5",
    "title": "Precios transparentes",
    "detail": "Planes y precios se muestran con condiciones visibles y correctas.",
    "fix": "Revisa este criterio y corrige la interfaz cuando no se cumpla.",
    "group": "principles"
  },
  {
    "id": "principle-6",
    "title": "Respuestas anticipadas",
    "detail": "FAQ resuelve preguntas reales sobre compra y servicios.",
    "fix": "Revisa este criterio y corrige la interfaz cuando no se cumpla.",
    "group": "principles"
  },
  {
    "id": "principle-7",
    "title": "Acción móvil visible",
    "detail": "La acción importante se encuentra fácilmente sin ocultar contenido.",
    "fix": "Revisa este criterio y corrige la interfaz cuando no se cumpla.",
    "group": "principles"
  },
  {
    "id": "principle-8",
    "title": "Tipografía legible",
    "detail": "Tamaños y contrastes permiten leer cómodamente.",
    "fix": "Revisa este criterio y corrige la interfaz cuando no se cumpla.",
    "group": "principles"
  },
  {
    "id": "principle-9",
    "title": "Controles táctiles",
    "detail": "Áreas de interacción cómodas y separadas en móvil.",
    "fix": "Revisa este criterio y corrige la interfaz cuando no se cumpla.",
    "group": "principles"
  },
  {
    "id": "principle-10",
    "title": "Rendimiento",
    "detail": "Las imágenes, fuentes y animaciones no penalizan la carga.",
    "fix": "Revisa este criterio y corrige la interfaz cuando no se cumpla.",
    "group": "principles"
  }
] as AuditCriterion[]
