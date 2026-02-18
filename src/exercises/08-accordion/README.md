# Nivel 08 — Accordion / Tabs

## 🎯 Problema de Negocio

Un panel de FAQ necesita un Accordion con:
- API declarativa: `<Accordion.Item>`, `<Accordion.Header>`, `<Accordion.Panel>`.
- Modo exclusivo (solo 1 abierto) y modo múltiple.
- Accesibilidad completa (ARIA, teclado).
- Personalización del header según su estado (abierto/cerrado).

## 📋 Requisitos (definidos por los tests)

1. Click en header abre/cierra su panel.
2. Modo exclusivo: abrir uno cierra los demás.
3. Modo múltiple: cada panel es independiente.
4. ARIA: `aria-expanded`, `aria-controls`, roles correctos.
5. Teclado: Enter/Space toggle, flechas navegan.
6. El header puede renderizar contenido personalizado basado en `{ isOpen }`.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="08-accordion"`
2. Implementa `Accordion.jsx` con sub-componentes.
