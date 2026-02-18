# Nivel 03 — Timer / Stopwatch

## 🎯 Problema de Negocio

Un cronómetro de productividad que permite medir el tiempo dedicado a tareas. Debe poder iniciarse, pausarse y reiniciarse sin causar memory leaks ni comportamientos inesperados.

**Requisitos del producto:**
- Botones de Start, Pause y Reset.
- La cuenta avanza en segundos.
- Pausar detiene la cuenta sin perder el tiempo acumulado.
- Reset vuelve a cero y detiene la cuenta.
- Al desmontar el componente, los intervalos se limpian correctamente.

## 📋 Requisitos (definidos por los tests)

1. Muestra `0` al inicio.
2. Start inicia el contador, incrementando cada segundo.
3. Pause detiene el contador sin reiniciarlo.
4. Resume (Start después de Pause) continúa desde donde se pausó.
5. Reset vuelve a `0` y detiene el contador.
6. No hay memory leaks: el interval se limpia al desmontar.
7. Múltiples clicks rápidos en Start no crean intervalos duplicados.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="03-timer"`
2. Implementa `Timer.jsx` para pasar todos los tests.
