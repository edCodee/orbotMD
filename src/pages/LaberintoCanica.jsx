import React, { useState, useEffect, useCallback } from "react";
import { LogOut, User, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
// Asumo que esta utilidad existe y está disponible
import { confirmLogout } from '../utils/confirmLogout'; 

// ===============================================
// CONSTANTES Y METADATOS
// ===============================================

// Mapeo de indicadores con su ID de Catálogo
const indicatorsMeta = [
    { key: "concentracion", id: 1, label: "Concentración", desc: "Mantiene atención en la canica sin distraerse del laberinto." },
    { key: "anticipacionEspacial", id: 2, label: "Anticipación espacial", desc: "Prevé los giros o movimientos antes de que ocurran." },
    { key: "resolucionProblemas", id: 3, label: "Resolución de problemas", desc: "Encuentra caminos alternativos cuando se equivoca." },
    { key: "motricidadFina", id: 4, label: "Motricidad fina", desc: "Movimientos controlados de muñeca y dedos para guiar la canica." },
    { key: "controlDireccion", id: 5, label: "Control de dirección", desc: "Ajusta la trayectoria con precisión sin perder la canica." },
    { key: "ajustePostural", id: 6, label: "Ajuste postural", desc: "Mantiene postura estable durante la tarea." },
    { key: "regulacionEmocional", id: 7, label: "Regulación emocional", desc: "Maneja frustración si la canica cae o no logra avanzar." },
    { key: "persistenciaErrores", id: 8, label: "Persistencia ante errores", desc: "Continúa intentando a pesar de fallos repetidos." },
];

// Estado inicial: Cada indicador tiene un score y una observación.
const initialIndicators = indicatorsMeta.reduce((acc, item) => {
    acc[item.key] = { score: 3, observation: "" };
    return acc;
}, {});

//const ML_API_URL = "https://apidocbot20250917015226-fgg9dddefpcuc6b4.canadacentral-01.azurewebsites.net/api/DiagnosticMLMechanicalArm/predict";

const ML_API_URL = "https://apidocbot20260224220610-b7fnd9fsgyejfmcf.canadacentral-01.azurewebsites.net/api/DiagnosticMLMechanicalArm/predict";


// ===============================================
// Componente de Modal de Resultados (Compartido)
// ===============================================
const ResultModal = ({ result, onClose }) => {
    if (!result) return null;

    const isSuccess = result.diagnosticMLMechanicalRiskLevel; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2d3748] rounded-2xl shadow-2xl p-8 max-w-lg w-full transform transition-all scale-100">
                <div className="flex flex-col items-center text-center mb-6">
                    {isSuccess ? (
                        <CheckCircle className="w-12 h-12 text-teal-400 mb-3" />
                    ) : (
                        <XCircle className="w-12 h-12 text-red-500 mb-3" />
                    )}
                    <h2 className="text-2xl font-bold text-white mb-1">
                        {isSuccess ? "Evaluación y Diagnóstico Generados" : "Error de Diagnóstico"}
                    </h2>
                    <p className="text-gray-400">La evaluación ha sido procesada por el modelo de Machine Learning.</p>
                </div>

                {isSuccess ? (
                    <div className="space-y-4 text-left">
                        <div className="p-3 bg-gray-800 rounded-xl">
                            <p className="text-sm text-teal-300">Nivel de Riesgo:</p>
                            <p className="text-lg font-semibold text-white">
                                {result.diagnosticMLMechanicalRiskLevel}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-800 rounded-xl">
                            <p className="text-sm text-teal-300">Recomendaciones:</p>
                            <p className="text-md text-white whitespace-pre-line">
                                {result.diagnosticMLMechanicalRecomendations}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-300 text-center">
                        Hubo un problema al generar el diagnóstico ML. Por favor, intente de nuevo.
                    </p>
                )}

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};


// ===============================================
// Componente Principal
// ===============================================
export default function DashDoctorLaberintoCanica() {
    // Hooks de navegación y ruta (asumo que se usan estas dependencias)
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estados principales
    const [patient, setPatient] = useState(null);
    const [evaluationValues, setEvaluationValues] = useState(initialIndicators);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    // Estados de UI
    const [expandedObservation, setExpandedObservation] = useState(null); // Para mostrar/ocultar observaciones
    const [progress, setProgress] = useState(0);
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);
    
    // Función para resetear las evaluaciones
    const resetEvaluationState = useCallback(() => {
        setEvaluationValues(initialIndicators);
        setErrors({});
        setDiagnosisResult(null);
    }, []);

    // ----------------------------------------------------
    // useEffect para Cargar Datos del Paciente
    // ----------------------------------------------------
const fetchData = useCallback(async () => {
    setLoading(true);
    // NOTA: Usar fetch real con la API
    try {
        // 🚀 Lógica de fetch real ADAPTADA
        const patientRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/PatientProfileFree/patientdiagnostic/${id}`,
            { headers: { accept: "text/plain" } }
        );
        
        // ⚠️ Manejo de respuesta HTTP ⚠️
        if (!patientRes.ok) {
            throw new Error(`Error HTTP: ${patientRes.status}`);
        }
        
        const patientData = await patientRes.json();
        
        // El resto de la lógica de manejo de datos sigue igual
        if (Array.isArray(patientData) && patientData.length > 0) {
            setPatient(patientData[0]);
        } else {
            console.error("No se encontraron datos del paciente o la respuesta fue vacía.");
            setPatient(null);
        }
    } catch (error) {
        console.error("Error al cargar datos del paciente:", error);
        // Opcional: setear un estado de error visible para el usuario
        // setError(true);
    } finally {
        setLoading(false);
    }
}, [id]);

// El useEffect permanece igual
useEffect(() => {
    fetchData();
    resetEvaluationState();
}, [fetchData, resetEvaluationState]);


    // ----------------------------------------------------
    // Handlers de UI y Formulario
    // ----------------------------------------------------
    
    /**
     * Maneja el cambio de estado para el score o la observación de un indicador específico.
     * @param {string} key - La clave del indicador (e.g., 'concentracion').
     * @param {string} field - El campo a actualizar ('score' o 'observation').
     * @param {any} v - El nuevo valor.
     */
    function handleChange(key, field, v) {
        setEvaluationValues((s) => ({ 
            ...s, 
            [key]: { ...s[key], [field]: v } 
        }));
        if (field === 'score') {
            setErrors((e) => ({ ...e, [key]: null }));
        }
    }

    // Función para manejar el cierre del modal y limpiar la evaluación
    const handleCloseResultModal = () => {
        setShowResultModal(false);
        setDiagnosisResult(null);
        resetEvaluationState(); // ✅ Limpiar el formulario completo al cerrar
    };
    
    function validate() {
        const newErrors = {};
        indicatorsMeta.forEach((it) => {
            const score = evaluationValues[it.key].score;
            // Validamos que el score sea un número entre 1 y 5
            if (typeof score !== 'number' || score < 1 || score > 5) {
                newErrors[it.key] = "Seleccione un valor entre 1 y 5";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // ----------------------------------------------------
    // Handler de Guardado y ML
    // ----------------------------------------------------
    async function handleSubmit(e) {
        e?.preventDefault?.();
        if (!patient || !validate()) return;

        setSending(true);
        setDiagnosisResult(null);
        setShowResultModal(false);
        setProgress(0);
        
        // CÁLCULO DE EDAD
        const birthDate = new Date(patient.patientProfileFreeBirthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || 
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // 1. Consolidar Observaciones (para posible API de guardado de evaluación)
        const observationsArray = indicatorsMeta.map(it => {
            const obs = evaluationValues[it.key].observation.trim();
            // Solo incluimos si hay observación
            return obs ? `${it.label}: ${obs}` : ''; 
        }).filter(Boolean);

        const consolidatedObservations = observationsArray.join('\n---\n');
        
        // 2. Mapeo de indicadores del Laberinto al Payload de la API ML
        const mlData = {
            gender: patient.patientProfileFreeGender === "Femenino" ? "F" : "M", // Asegura formato F/M
            patientAge: age,
            // Las claves se mapean a los campos que la API ML espera:
            sustainedAttention: evaluationValues.concentracion.score, 
            planning: evaluationValues.anticipacionEspacial.score,
            categorization: evaluationValues.resolucionProblemas.score,
            executiveFunction: evaluationValues.motricidadFina.score, 
            eyeHandCoordination: evaluationValues.controlDireccion.score,
            fineMotorPrecision: evaluationValues.ajustePostural.score,
            toleranceFrustration: evaluationValues.regulacionEmocional.score,
            perseverance: evaluationValues.persistenciaErrores.score,
        };

        // Calcular totalScore
        mlData.totalScore = Object.values(mlData)
            .filter((v) => typeof v === "number")
            .reduce((a, b) => a + b, 0);


        // Simulación de barra de progreso (10s)
        const totalMs = 10000;
        const tickMs = 200;
        const steps = totalMs / tickMs;
        let step = 0;
        const interval = setInterval(() => {
            step++;
            setProgress(Math.round((step / steps) * 100));
            if (step >= steps) clearInterval(interval);
        }, tickMs);

        try {
            const token = localStorage.getItem("token") || "";
            
            // 3. Llamar API ML
            const mlResponse = await fetch(
                `${ML_API_URL}?patientProfileId=${patient.patientProfileFreeId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "", 
                    },
                    body: JSON.stringify(mlData),
                }
            );

            clearInterval(interval);
            setProgress(100);

            if (!mlResponse.ok) {
                const errorDetails = await mlResponse.text();
                setDiagnosisResult({}); 
                setShowResultModal(true);
                throw new Error(`Error ${mlResponse.status} al generar diagnóstico ML: ${errorDetails}`);
            }

            const mlResult = await mlResponse.json();
            
            // ✅ Éxito: Mostrar modal
            setDiagnosisResult(mlResult);
            setShowResultModal(true);

        } catch (err) {
            console.error("Error en el proceso de evaluación:", err);
            if (!showResultModal) {
                alert("❌ Hubo un problema al enviar la evaluación. Consulte la consola.");
            }
        } finally {
            setSending(false);
        }
    }


    if (loading)
        return <p className="text-gray-400 text-center mt-10">Cargando datos del paciente...</p>;
        
    if (!patient)
        return <p className="text-red-400 text-center mt-10">Error: Paciente no encontrado o ID inválido.</p>;

    // ===============================================
    // RENDERIZADO DEL COMPONENTE
    // ===============================================
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#1a202c] text-white">
            
            {/* Sidebar (Panel Psicólogo) */}
            <aside className="w-full md:w-64 bg-[#2d3748] p-6 space-y-6 md:min-h-screen">
                <div className="text-2xl font-bold text-teal-400 mb-6 text-center md:text-left">
                    Panel Psicólogo
                </div>
                <nav className="space-y-4">
                    <Link to="/dashdoctorpatientlist" className="flex items-center gap-3 hover:text-teal-300">
                        <User /> <span>Pacientes</span>
                    </Link>
                    {/* Sustituir confirmLogout por tu función real si usas navegación */}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-8 overflow-auto">
                
                {/* Encabezado con datos del paciente */}
                <div className="bg-gray-800 rounded-2xl p-6 shadow-md mb-8">
                    <p className="text-lg font-semibold mb-2">
                        Representante:{" "}
                        <span className="text-teal-400">
                            {patient.userFirstName} {patient.userLastName}
                        </span>
                    </p>
                    <p className="text-lg font-semibold mb-2">
                        Paciente:{" "}
                        <span className="text-blue-400">
                            {patient.patientProfileFreeFirstName}{" "}
                            {patient.patientProfileFreeLastName}
                        </span>
                    </p>
                    <p className="text-sm text-gray-300">
                        Género:{" "}
                        <span className="text-white">
                            {patient.patientProfileFreeGender}
                        </span>
                    </p>
                    <p className="text-sm text-gray-300">
                        Fecha de Nacimiento:{" "}
                        <span className="text-white">
                            {new Date(
                                patient.patientProfileFreeBirthDate
                            ).toLocaleDateString("es-ES")}
                        </span>
                    </p>
                </div>

                {/* Título */}
                <h1 className="text-3xl font-bold text-teal-300 mb-8 text-center md:text-left">
                    Evaluación: Laberinto con Canica
                </h1>

                {/* Formulario de indicadores */}
                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto md:mx-0">
                    {indicatorsMeta.map((it) => (
                        <div key={it.key} className="bg-[#2d3748] p-4 rounded-xl shadow-md border border-gray-700">
                            
                            {/* Fila Principal: Título y Score Slider */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                                <div className="flex-1">
                                    <div className="font-semibold text-teal-400">{it.label}</div>
                                    <div className="text-sm text-gray-400">{it.desc}</div>
                                </div>
                                
                                <div className="flex items-center gap-4 min-w-[200px] justify-end">
                                    <label className="text-sm">1</label>
                                    <input
                                        type="range"
                                        min={1}
                                        max={5}
                                        value={evaluationValues[it.key].score}
                                        onChange={(e) => handleChange(it.key, 'score', Number(e.target.value))}
                                        className="w-full sm:w-32 accent-teal-500 cursor-pointer"
                                    />
                                    <label className="text-sm">5</label>
                                    <div className="ml-4 w-8 text-right font-bold text-lg text-white">
                                        {evaluationValues[it.key].score}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Botón para expandir/colapsar observaciones */}
                            <button
                                type="button"
                                onClick={() => setExpandedObservation(expandedObservation === it.key ? null : it.key)}
                                className="flex items-center text-sm text-gray-400 hover:text-teal-400 transition mt-2"
                            >
                                Observaciones (opcional)
                                {expandedObservation === it.key ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                            </button>

                            {/* Textarea de Observaciones (condicional) */}
                            {expandedObservation === it.key && (
                                <div className="mt-3">
                                    <textarea
                                        rows={2}
                                        value={evaluationValues[it.key].observation}
                                        onChange={(e) => handleChange(it.key, 'observation', e.target.value)}
                                        className="w-full rounded-lg p-2 bg-[#1a202c] border border-gray-600 focus:ring-1 focus:ring-teal-400 outline-none resize-none text-white placeholder-gray-500 text-sm"
                                        placeholder={`Anota observaciones específicas para ${it.label}...`}
                                    />
                                </div>
                            )}

                            {errors[it.key] && <div className="text-red-500 text-xs mt-2">{errors[it.key]}</div>}
                        </div>
                    ))}
                    
                    {/* Botones de acción */}
                    <div className="flex gap-4 pt-4 justify-end">
                        <button
                            type="button"
                            onClick={resetEvaluationState}
                            className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                        >
                            Limpiar Evaluación
                        </button>
                        <button
                            type="submit"
                            disabled={sending}
                            className="px-6 py-3 rounded-xl shadow-lg bg-teal-500 text-white font-semibold hover:bg-teal-400 transition disabled:opacity-50"
                        >
                            {sending ? "Enviando..." : "Generar Diagnóstico"}
                        </button>
                    </div>
                </form>
            </main>
            
            {/* Modal de Progreso */}
            {sending && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-[#2d3748] p-6 rounded-xl w-full max-w-md shadow-2xl">
                        <div className="mb-4 text-white font-semibold">Procesando diagnóstico inteligente...</div>
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div 
                                style={{ width: `${progress}%` }} 
                                className="h-full bg-teal-500 transition-all duration-200 ease-linear rounded-full" 
                            />
                        </div>
                        <div className="mt-3 text-sm text-gray-400">Progreso: {progress}%</div>
                    </div>
                </div>
            )}

            {/* Modal de Resultados */}
            {showResultModal && (
                <ResultModal result={diagnosisResult} onClose={handleCloseResultModal} />
            )}
        </div>
    );
}