// ToggleSwitch.jsx
// 📌 Nivel 01 — Toggle Switch
//
// Implementa un componente de interruptor (toggle) que:
// - Renderice un botón con texto "ON" u "OFF" según su estado.
// - Cambie de estado al hacer clic.
// - Acepte una prop `initialState` (boolean) para el estado inicial.
// - Acepte una prop `label` (string) que se muestre como etiqueta.
// - Use el atributo `aria-pressed` para accesibilidad.
//
// ¡Haz que los tests pasen!

import { useState } from "react";

export default function ToggleSwitch({ initialState = false, label }) {
	const [isOn, setIsOn] = useState(initialState);

	const handleToggle = () => {
		setIsOn((is) => !is);
	}
    
	return (
		<div>
			{label && <span>{label}</span>}
			<button aria-pressed={isOn} onClick={handleToggle} type="button">
				{isOn ? "ON" : "OFF"}
			</button>
		</div>
	);
}
