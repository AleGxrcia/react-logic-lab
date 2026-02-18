// Accordion.jsx
// 📌 Nivel 08 — Accordion (Compound Components + Render Props)
//
// Implementa un componente Accordion con sub-componentes estáticos:
//
// <Accordion allowMultiple={false}>
//   <Accordion.Item id="unique-id">
//     <Accordion.Header>Título</Accordion.Header>
//     <Accordion.Panel>Contenido</Accordion.Panel>
//   </Accordion.Item>
// </Accordion>
//
// Props del Accordion:
//   - allowMultiple: boolean (default false) — si permite múltiples paneles abiertos
//
// Accordion.Item:
//   - id: string — identificador único
//
// Accordion.Header:
//   - Renderiza un <button> con aria-expanded y aria-controls
//   - Soporte para Render Props: children puede ser función ({isOpen}) => ReactNode
//   - Keyboard: Enter/Space toggle, ArrowDown/ArrowUp navega entre headers
//
// Accordion.Panel:
//   - Se muestra/oculta según el estado del item
//   - Tiene un id que coincide con el aria-controls del header
//
// Usa Context interno para comunicar estado entre sub-componentes.
//
// ¡Haz que los tests pasen!

export default function Accordion() {
    // Tu código aquí
    return null
}

Accordion.Item = function AccordionItem() {
    return null
}

Accordion.Header = function AccordionHeader() {
    return null
}

Accordion.Panel = function AccordionPanel() {
    return null
}
