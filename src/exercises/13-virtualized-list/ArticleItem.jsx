// ArticleItem.jsx
// 📌 Nivel 13 — Virtualized List (Item component)
//
// Implementa un componente de artículo envuelto en React.memo:
// - Muestra title y summary del artículo.
// - Tiene un botón "Bookmark" (aria-label="bookmark").
// - Al clickear bookmark, llama a onBookmark(article.id).
// - Si recibe una prop `renderSpy`, la llama en el cuerpo del componente
//   para que los tests puedan validar que React.memo funciona.
//
// IMPORTANTE: Exporta como default el componente envuelto en React.memo().
//
// Props:
//   - article: { id, title, summary, bookmarked }
//   - onBookmark: (id) => void
//   - renderSpy?: () => void (para testing)
//
// ¡Haz que los tests pasen!

import { memo } from 'react'

function ArticleItem() {
    // Tu código aquí
    return null
}

export default memo(ArticleItem)
