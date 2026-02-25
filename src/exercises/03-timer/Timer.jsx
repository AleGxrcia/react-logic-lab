// Timer.jsx
// 📌 Nivel 03 — Timer / Stopwatch
//
// Implementa un cronómetro que:
// - Muestre el tiempo transcurrido en un elemento con data-testid="time-display".
// - Tenga botones Start, Pause y Reset.
// - Use `useRef` para almacenar el intervalId (NO useState).
// - Use `useEffect` con cleanup para limpiar el interval al desmontar.
// - No cree intervalos duplicados si se hace clic en Start varias veces.
// - Formatee el tiempo como "M:SS" cuando supere los 60 segundos (ej: "1:05").
// - Muestre solo segundos cuando sea menor a 60 (ej: "45").
//
// ¡Haz que los tests pasen!

import { useEffect, useRef, useState } from "react"

function formatTime(sec) {
	if (sec < 60) return `${sec}`;
	const minutes = Math.floor(sec / 60);
	const seconds = sec % 60;

	const formatSeconds = seconds.toString().padStart(2, '0');

	return `${minutes}:${formatSeconds}`;
}

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
	const [isActive, setIsActive] = useState(false);
	const intervalRef = useRef(null);

	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [])

	function start() {
		if (isActive) return;
	
		setIsActive(true);
		intervalRef.current = setInterval(() => {
			setSeconds(s => s + 1);
		}, 1000);
	}

	function pause() {
		clearInterval(intervalRef.current);
		intervalRef.current = null;
		setIsActive(false);
	}

	function reset() {
		pause();
		setSeconds(0);
	}

  return (
		<div>
			<span data-testid="time-display">
				{formatTime(seconds)}
			</span>
			<div>
				<button onClick={start} disabled={isActive}>Start</button>

				<button onClick={pause} disabled={!isActive}>Pause</button>

				<button onClick={reset}>Reset</button>
			</div>
		</div>
	);
}
