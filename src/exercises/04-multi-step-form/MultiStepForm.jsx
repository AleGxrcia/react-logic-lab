// MultiStepForm.jsx
// 📌 Nivel 04 — Multi-Step Form
//
// Implementa un formulario de 3 pasos usando useReducer:
//
// Paso 1 — Datos personales:
//   - Input "Nombre" (label: "Nombre")
//   - Input "Email" (label: "Email")
//
// Paso 2 — Dirección:
//   - Input "Calle" (label: "Calle")
//   - Input "Ciudad" (label: "Ciudad")
//   - Input "Código Postal" (label: "Código Postal")
//
// Paso 3 — Confirmación:
//   - Muestra resumen de todos los campos
//   - Checkbox "Acepto los términos" (label: "Acepto los términos")
//   - Botón "Enviar" (deshabilitado si no se aceptan los términos)
//
// Navegación:
//   - Botón "Siguiente" (valida campos del paso actual antes de avanzar)
//   - Botón "Anterior" (regresa sin perder datos)
//   - Indicador "Paso X de 3"
//
// Validación:
//   - Campos vacíos muestran error "{Campo} es requerido"
//
// Props: onSubmit(formData) — se llama con los datos al enviar
//
// Sugerencia de estado para el reducer:
// { currentStep: 1, formData: {...}, errors: {} }
//
// ¡Haz que los tests pasen!

import { useReducer } from "react";

const validateStep = (currentStep, formData) => {
	const newErrors = {};

	if (currentStep === 1) {
		if (!formData.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
		if (!formData.email.trim()) newErrors.email = 'Email es requerido';
	} 
    
	if (currentStep === 2) {
		if (!formData.calle.trim()) newErrors.calle = 'Calle es requerido';
		if (!formData.ciudad.trim()) newErrors.ciudad = 'Ciudad es requerido';
		if (!formData.codigoPostal.trim()) newErrors.codigoPostal = 'Código Postal es requerido';
	}

	return newErrors;
}

const initialState = {
	currentStep: 1,
	formData: { nombre: "", email: "", calle: "", ciudad: "", codigoPostal: "", terminos: false },
	errors: {}
};

function reducer(state, action) {
	switch (action.type) {
		case 'SET_FIELD':
			return {
				...state,
				formData: { ...state.formData, [action.payload.field]: action.payload.value },
				errors: { ...state.errors, [action.payload.field]: "" }
			};
		case 'SET_ERRORS':
			return { ...state, errors: action.payload }
		case 'NEXT_STEP':
			return { ...state, currentStep: state.currentStep + 1 }
		case 'PREV_STEP':
			return { ...state, currentStep: state.currentStep - 1 }
		case 'RESET_FORM':
			return initialState;
		default:
			return state;
	}
}

export default function MultiStepForm({ onSubmit }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const {currentStep, formData, errors} = state;

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		dispatch({
			type: 'SET_FIELD',
			payload: { field: name, value: type === "checkbox" ? checked : value }
		});
	}

	const handleNext = () => {
		const stepErrors = validateStep(currentStep, formData);
		if (Object.keys(stepErrors).length > 0) {
			dispatch({ type: 'SET_ERRORS', payload: stepErrors }); 
		} else {
			dispatch({ type: 'NEXT_STEP' });
		}
	}

	const handlePrev = () => {
		dispatch({ type: 'PREV_STEP' });
	}

	const handleSubmit = (e) => {
		e.preventDefault();
    
		const { terminos, ...datos } = formData;
		if (terminos) {
			onSubmit(datos);
		}
	}

	return (
    <div>
      <p>Paso {currentStep} de 3</p>
      <h2>{currentStep === 1 ? "Datos personales" : currentStep === 2 ? "Dirección" : "Confirmación"}</h2>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="step-1">
            <div>
              <label htmlFor="nombre">Nombre</label>
              <input 
                type="text"
                name="nombre"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && <span className="error">{errors.nombre}</span>}
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-2">
            <div>
              <label htmlFor="calle">Calle</label>
              <input 
                type="text"
                name="calle"
                id="calle"
                value={formData.calle}
                onChange={handleChange}
              />
              {errors.calle && <span className="error">{errors.calle}</span>}
            </div>
            <div>
              <label htmlFor="ciudad">Ciudad</label>
              <input 
                type="text"
                name="ciudad"
                id="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
              />
              {errors.ciudad && <span className="error">{errors.ciudad}</span>}
            </div>
            <div>
              <label htmlFor="codigoPostal">Código Postal</label>
              <input 
                type="text"
                name="codigoPostal"
                id="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
              />
              {errors.codigoPostal && <span className="error">{errors.codigoPostal}</span>}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-3">
            <h3>Resumen</h3>
            <ul>
              <li><strong>Nombre:</strong> {formData.nombre}</li>
              <li><strong>Email:</strong> {formData.email}</li>
              <li><strong>Calle:</strong> {formData.calle}</li>
              <li><strong>Ciudad:</strong> {formData.ciudad}</li>
              <li><strong>Código Postal::</strong> {formData.codigoPostal}</li>
            </ul>

            <div>
              <label htmlFor="terminos">
              <input 
                type="checkbox" 
                name="terminos" 
                id="terminos" 
                checked={formData.terminos}
                onChange={handleChange}
              />
                acepto los términos
              </label>
            </div>
          </div>
        )}

        <div className="navigation-buttons">
          {currentStep > 1 && (
            <button type="button" onClick={handlePrev}>
              Anterior
            </button>
          )}

          {currentStep < 3 ? (
            <button type="button" onClick={handleNext}>
              Siguiente
            </button>
          ) : (
            <button type="submit" onClick={handleSubmit} disabled={!formData.terminos}>
              Enviar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
