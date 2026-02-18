// usersApi.js
// 📌 Nivel 11 — Async Data Table (RTK Query API)
//
// Implementa un API slice con createApi:
//
// Base URL: '/api'
//
// Endpoints:
//   - getUsers(query): GET /api/users?page=X&search=X&sort=X
//     - Retorna { users, totalPages, currentPage }
//     - providesTags: ['Users']
//
//   - updateUser({ id, ...data }): PATCH /api/users/:id
//     - invalidatesTags: ['Users']
//     - Esto forzará el re-fetch de getUsers automáticamente
//
// Exporta:
//   - usersApi (el api slice completo)
//   - useGetUsersQuery
//   - useUpdateUserMutation
//
// ¡Haz que los tests pasen!

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        // Tu código aquí
    }),
})

// Exporta los hooks generados
// export const { useGetUsersQuery, useUpdateUserMutation } = usersApi
