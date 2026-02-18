# Nivel 15 — Search Engine (Capstone)

## 🎯 Problema de Negocio

Un buscador full-featured tipo e-commerce que integra **todos los conceptos aprendidos**:
- Input con debounce (no envía request por cada tecla).
- Resultados paginados desde una API.
- Filtros laterales (categoría, rango de precio).
- UI no bloqueante: el input sigue respondiendo mientras la lista se actualiza.
- Resultados cacheados por combinación de query + filtros.
- URL refleja el estado de búsqueda (deep linking).
- Carga bajo demanda por módulos.

## 📋 Requisitos (definidos por los tests)

1. **Debounce:** no se envía request hasta que el usuario deja de escribir N ms.
2. **Resultados:** la lista se actualiza con los datos de la API.
3. **Filtros:** categoría + precio se combinan con la búsqueda.
4. **URL Sync:** `q`, `category`, `page` se reflejan como query params.
5. **Deep Link:** `/search?q=laptop&page=2` carga los resultados correctos.
6. **UI fluida:** el input no se bloquea mientras la lista se actualiza.
7. **Paginación:** cambio de página con caché.
8. **Carga bajo demanda:** el módulo de búsqueda se carga solo cuando se necesita.
9. **Error Handling:** fallo de API muestra estado de error con retry.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="15-search-engine"`
2. Implementa todos los archivos necesarios para pasar los tests.
3. Este es el ejercicio de integración final — demuestra todo lo que has aprendido.
