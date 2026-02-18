// searchApi.js
// 📌 Nivel 15 — Search Engine (RTK Query API)
//
// Implementa un API slice con createApi:
//
// Base URL: '/api'
//
// Endpoints:
//   - search(query): GET /api/search?q=X&category=X&page=X
//     - Retorna { products, totalPages, currentPage, totalResults }
//     - providesTags basado en los params para caché granular
//
// Exporta:
//   - searchApi
//   - useSearchQuery
//
// ¡Haz que los tests pasen!

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        // Tu código aquí
    }),
})

// export const { useSearchQuery } = searchApi
