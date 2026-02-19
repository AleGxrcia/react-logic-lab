<p align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TDD-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" />
  <img src="https://img.shields.io/badge/Architecture-Clean_Code-FF6F61?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-In_Progress-FFA500?style=for-the-badge" />
</p>

# ⚛️ React-Logic-Lab

> **Un laboratorio de lógica de negocio en React impulsado por TDD.**
> No es un curso. No son mini-proyectos visuales. Es un repositorio que demuestra cómo un desarrollador **piensa, diseña y resuelve** problemas reales.

---

## 🎯 ¿Qué es esto?

**React-Logic-Lab** es un entorno de práctica progresivo donde cada ejercicio plantea un **problema de negocio real** cuya solución obliga a utilizar una herramienta específica del ecosistema React.

La premisa es simple pero rigurosa:

```
Problema de negocio → Límite de la herramienta actual → Herramienta más adecuada
```

Cada nivel incluye:
- 📝 Un **enunciado del problema** (sin pistas de implementación).
- 🧪 Un **archivo de tests que falla** describiendo los requisitos exactos.
- 📄 Un **componente vacío** donde escribir la solución.

**Mi trabajo es hacer que los tests pasen. Los tests son la especificación.**

---

## 🏗️ Filosofía y Principios

### Test Driven Development (TDD)
Los tests se escriben **antes** que el código. No son un accesorio: son la fuente de verdad del comportamiento esperado. Cada archivo `.test.jsx` funciona como un **contrato** que define qué debe hacer el componente, no cómo debe hacerlo.

### Problema → Herramienta (No al revés)
Ninguna tecnología se introduce "porque sí". El roadmap está diseñado para que cada concepto emerja como **la solución más limpia** a un problema que las herramientas anteriores no pueden resolver de forma sostenible.

| ❌ Enfoque tradicional          | ✅ Enfoque React-Logic-Lab              |
| ------------------------------- | ---------------------------------------- |
| "Ahora aprende useReducer"      | "Este formulario tiene 12 campos interdependientes. ¿`useState` escala?" |
| "Usa Redux para estado global"  | "5 componentes a 4 niveles de profundidad necesitan los mismos datos. ¿Prop drilling funciona?" |
| "Optimiza con useMemo"          | "Esta lista de 10K items se recalcula en cada render. ¿Cómo evitarlo?" |

### Arquitectura Limpia
- **Separación de concerns**: La lógica de negocio vive en Custom Hooks, no en componentes.
- **Componentes puros**: Los componentes de UI son funciones de sus props.
- **Testabilidad**: Si no se puede testear fácilmente, la arquitectura está mal.

---

## 🗺️ Roadmap de Ejercicios

El roadmap completo con todos los niveles, problemas de negocio y justificación técnica está documentado en [`ROADMAP.md`](./ROADMAP.md).

**Vista general de la progresión:**

```
Nivel 01-03  │  Fundamentos        │  useState, useEffect, useRef
Nivel 04-06  │  Estado Complejo     │  useReducer, Context API, Custom Hooks
Nivel 07-09  │  Patrones & Routing  │  Compound Components, React Router
Nivel 10-12  │  Estado Global       │  Redux Toolkit, Thunks, RTK Query
Nivel 13-15  │  Performance         │  useMemo, useCallback, Suspense, Lazy Loading
```

---

## 🛠️ Stack Técnico

| Categoría       | Tecnología             | Justificación                                |
| --------------- | ---------------------- | -------------------------------------------- |
| Build Tool      | Vite                   | HMR instantáneo, configuración mínima        |
| UI Library      | React 18+              | Concurrent features, Suspense nativo         |
| Test Runner     | Vitest                 | Integración nativa con Vite, API compatible con Jest |
| Test Utilities  | React Testing Library  | Testing centrado en el usuario, no en implementación |
| HTTP Mocking    | MSW                    | Intercepta a nivel de red, agnóstico al cliente |
| Routing         | React Router v6        | Loaders, actions, data-driven routing         |
| State Management| Redux Toolkit          | Slices, Thunks, RTK Query integrado          |

---

## 🚀 Cómo Usar este Repositorio

### Requisitos
- Node.js ≥ 18
- npm ≥ 9

### Instalación
```bash
git clone https://github.com/<TU-GITHUB-USERNAME>/react-logic-lab.git
cd react-logic-lab
npm install
```

### Flujo de Trabajo TDD
```bash
# 1. Elegir un ejercicio (ej: 01-toggle-switch)
# 2. Leer el README.md del ejercicio para entender el problema
# 3. Ejecutar los tests en modo watch:
npm run test:watch -- --filter="01-toggle-switch"

# 4. Ver los tests fallar (RED 🔴)
# 5. Escribir el código mínimo para que pasen (GREEN 🟢)
# 6. Refactorizar manteniendo los tests en verde (REFACTOR 🔵)
```

### Comandos Disponibles
```bash
npm run dev            # Servidor de desarrollo
npm run test           # Ejecutar todos los tests
npm run test:watch     # Tests en modo watch (ideal para TDD)
npm run test:coverage  # Reporte de cobertura
npm run lint           # Linting
npm run build          # Build de producción
```

---

## 📊 Progreso

| #  | Ejercicio                      | Estado |
| -- | ------------------------------ | ------ |
| 01 | Toggle Switch                  | ✅     |
| 02 | Character Counter              | ⬜     |
| 03 | Timer / Stopwatch              | ⬜     |
| 04 | Multi-Step Form                | ⬜     |
| 05 | Shopping Cart                  | ⬜     |
| 06 | Theme Manager                  | ⬜     |
| 07 | Notification System            | ⬜     |
| 08 | Accordion / Tabs               | ⬜     |
| 09 | Protected Dashboard            | ⬜     |
| 10 | Task Board (Kanban)            | ⬜     |
| 11 | Async Data Table               | ⬜     |
| 12 | Real-Time Dashboard            | ⬜     |
| 13 | Virtualized List               | ⬜     |
| 14 | Lazy Module System             | ⬜     |
| 15 | Search Engine (Capstone)       | ⬜     |

---

## 🧠 ¿Qué demuestra este repositorio?

- ✅ Dominio del ecosistema React moderno (Hooks, Context, Redux, React Query)
- ✅ Capacidad para **resolver problemas antes de escribir código** (TDD)
- ✅ Separación limpia entre lógica de negocio y presentación
- ✅ Conocimiento de patrones de diseño aplicados a frontend
- ✅ Comprensión de cuándo y por qué usar cada herramienta
- ✅ Testing: unitario, integración y mocking de red

---

<p align="center">
  <strong>Construido con el enfoque de un ingeniero, no de un tutorial.</strong>
</p>
