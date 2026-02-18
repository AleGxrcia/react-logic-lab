// metricsApi.js
// 📌 Nivel 12 — Real-Time Dashboard (RTK Query API)
//
// Implementa un API slice con createApi:
//
// Base URL: '/api'
//
// Endpoints:
//   - getMetrics: GET /api/metrics
//     - Retorna { cpu, memory, requests, timestamp }
//     - Soporta pollingInterval
//
//   - getServers: GET /api/servers
//     - Retorna { servers: [{ id, name, status }] }
//
// Exporta:
//   - metricsApi
//   - useGetMetricsQuery
//   - useGetServersQuery
//
// ¡Haz que los tests pasen!

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const metricsApi = createApi({
    reducerPath: 'metricsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        // Tu código aquí
    }),
})

// Exporta los hooks generados
// export const { useGetMetricsQuery, useGetServersQuery } = metricsApi
