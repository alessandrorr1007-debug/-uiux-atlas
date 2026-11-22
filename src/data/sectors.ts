export type SectorPreset = {
  id: string; name: string; kind: 'web' | 'app'; audience: string; goal: string; components: string[]
}
export const sectors: SectorPreset[] = [
  {
    "id": "cafe",
    "name": "Café",
    "kind": "web",
    "audience": "Personas que buscan café de especialidad",
    "goal": "Carta visual, horarios, ubicación y pedido",
    "components": [
      "hero-section",
      "product-card",
      "bento-grid",
      "fat-footer"
    ]
  },
  {
    "id": "restaurante",
    "name": "Restaurante",
    "kind": "web",
    "audience": "Comensales locales",
    "goal": "Menú, galería, contacto y reserva informativa",
    "components": [
      "hero-section",
      "tabs",
      "product-card",
      "accordion"
    ]
  },
  {
    "id": "gimnasio",
    "name": "Gimnasio",
    "kind": "web",
    "audience": "Personas interesadas en entrenar",
    "goal": "Clases, horarios, entrenadores y planes",
    "components": [
      "hero-section",
      "stat-cards",
      "pricing-table",
      "faq-section"
    ]
  },
  {
    "id": "portafolio",
    "name": "Portafolio",
    "kind": "web",
    "audience": "Clientes y reclutadores",
    "goal": "Trabajos destacados, perfil y contacto",
    "components": [
      "typographic-hero",
      "masonry-grid",
      "testimonial-card",
      "fat-footer"
    ]
  },
  {
    "id": "agencia",
    "name": "Agencia",
    "kind": "web",
    "audience": "Negocios que necesitan servicios digitales",
    "goal": "Servicios, proyectos, metodología y contacto",
    "components": [
      "split-layout",
      "bento-grid",
      "card-grid",
      "testimonial-card"
    ]
  },
  {
    "id": "saas-suscripcion",
    "name": "SaaS / suscripción",
    "kind": "web",
    "audience": "Equipos que buscan software",
    "goal": "Producto, integraciones, planes y preguntas",
    "components": [
      "product-mockup-hero",
      "pricing-table",
      "faq-section",
      "feature-list"
    ]
  },
  {
    "id": "cursos-online",
    "name": "Cursos online",
    "kind": "web",
    "audience": "Estudiantes en línea",
    "goal": "Catálogo, programa, duración y matrícula",
    "components": [
      "card-grid",
      "tabs",
      "progress-bar",
      "faq-section"
    ]
  },
  {
    "id": "tienda-online",
    "name": "Tienda online",
    "kind": "web",
    "audience": "Compradores digitales",
    "goal": "Catálogo, filtros, productos y carrito",
    "components": [
      "product-card",
      "faceted-filters",
      "cart-drawer",
      "checkout-steps"
    ]
  },
  {
    "id": "inmobiliaria",
    "name": "Inmobiliaria",
    "kind": "web",
    "audience": "Personas que buscan propiedades",
    "goal": "Propiedades, filtros, ubicación y consultas",
    "components": [
      "card-grid",
      "search-field",
      "faceted-filters",
      "modal"
    ]
  },
  {
    "id": "estetica-spa",
    "name": "Estética / spa",
    "kind": "web",
    "audience": "Clientes de servicios de bienestar",
    "goal": "Servicios, personal, horarios y contacto",
    "components": [
      "hero-section",
      "card-grid",
      "testimonial-card",
      "date-picker"
    ]
  },
  {
    "id": "barberia",
    "name": "Barbería",
    "kind": "web",
    "audience": "Clientes que buscan reservar un servicio",
    "goal": "Servicios, precios, horarios y reservas",
    "components": [
      "hero-section",
      "pricing-table",
      "date-picker",
      "product-gallery"
    ]
  },
  {
    "id": "evento",
    "name": "Evento",
    "kind": "web",
    "audience": "Participantes e invitados",
    "goal": "Programa, ponentes, entradas y ubicación",
    "components": [
      "hero-section",
      "timeline",
      "card-grid",
      "accordion"
    ]
  },
  {
    "id": "fitness",
    "name": "Fitness",
    "kind": "app",
    "audience": "Personas con rutinas de entrenamiento",
    "goal": "Sesiones, actividad, progreso y metas",
    "components": [
      "bottom-navigation",
      "stat-cards",
      "calendar-view",
      "progress-bar"
    ]
  },
  {
    "id": "delivery-de-comida",
    "name": "Delivery de comida",
    "kind": "app",
    "audience": "Clientes de reparto",
    "goal": "Menú, carrito, pedido y seguimiento",
    "components": [
      "bottom-navigation",
      "product-card",
      "cart-drawer",
      "order-tracker"
    ]
  },
  {
    "id": "finanzas",
    "name": "Finanzas",
    "kind": "app",
    "audience": "Usuarios que administran gastos",
    "goal": "Balance, movimientos, presupuestos y alertas",
    "components": [
      "stat-cards",
      "line-chart",
      "data-table",
      "status-badge"
    ]
  },
  {
    "id": "reservas-turnos",
    "name": "Reservas / turnos",
    "kind": "app",
    "audience": "Clientes con citas",
    "goal": "Agenda, disponibilidad, confirmación y cambios",
    "components": [
      "calendar-view",
      "date-picker",
      "step-navigation",
      "toast"
    ]
  },
  {
    "id": "cursos",
    "name": "Cursos",
    "kind": "app",
    "audience": "Estudiantes",
    "goal": "Cursos, módulos, progreso y evaluación",
    "components": [
      "bottom-navigation",
      "tabs",
      "progress-bar",
      "accordion"
    ]
  },
  {
    "id": "habitos",
    "name": "Hábitos",
    "kind": "app",
    "audience": "Personas que buscan constancia",
    "goal": "Hábitos, seguimiento, rachas y recordatorios",
    "components": [
      "bottom-navigation",
      "calendar-view",
      "progress-bar",
      "microinteractions"
    ]
  },
  {
    "id": "comunidad-red-social",
    "name": "Comunidad / red social",
    "kind": "app",
    "audience": "Miembros de una comunidad",
    "goal": "Feed, perfil, publicaciones y avisos",
    "components": [
      "bottom-navigation",
      "activity-feed",
      "modal",
      "toast"
    ]
  },
  {
    "id": "viajes",
    "name": "Viajes",
    "kind": "app",
    "audience": "Viajeros",
    "goal": "Itinerario, experiencias, reservas y favoritos",
    "components": [
      "card-grid",
      "calendar-view",
      "tabs",
      "empty-state"
    ]
  }
] as SectorPreset[]
