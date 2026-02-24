// CharacterCounter.jsx
// 📌 Nivel 02 — Character Counter
//
// Implementa un componente de contador de caracteres que:
// - Tenga un <textarea> controlado.
// - Muestre los caracteres restantes en un elemento con data-testid="char-count".
// - Los caracteres restantes son ESTADO DERIVADO (maxLength - text.length), NO un useState separado.
// - Aplique clase "warning" al contador cuando queden ≤ 20% de caracteres.
// - Aplique clase "error" al contador cuando se exceda el límite.
// - Tenga un botón de envío deshabilitado si el texto está vacío o excede el límite.
// - Llame a onSubmit(text) al hacer clic en el botón.
// - Llame a onLimitReached() cuando el texto exceda el límite.
//
// Props esperadas:
//   - maxLength: number
//   - onSubmit: (text: string) => void
//   - onLimitReached?: () => void
//
// ¡Haz que los tests pasen!

import { useEffect, useState } from "react"

export default function CharacterCounter({ maxLength, onSubmit, onLimitReached }) {
	const [text, setText] = useState("");
	
	const remaining = maxLength - text.length;
	const isOver = remaining < 0;
	const isWarning = !isOver && remaining <= Math.floor(maxLength * 0.2);
	const isEmpty = text.length === 0;

	useEffect(() => {
		if (isOver && onLimitReached) {
			onLimitReached(); 
		} 
	}, [isOver, onLimitReached]);

	const handleSubmit = () => {
		if (!isEmpty && !isOver) {
			onSubmit(text); 
		}
	}

	return (
		<div>
			<textarea 
				value={text} 
				onChange={(e) => setText(e.target.value)}
				placeholder="Escribe algo aqui..."
			/>
			<span 
				data-testid="char-count" 
				className={`${isOver ? "error" : isWarning ? "warning" : ""}`}
			>
				{remaining}
			</span>
			<button 
				onClick={handleSubmit}
				disabled={isEmpty || isOver} 
			>
				Enviar
			</button>
		</div>
	)
};
