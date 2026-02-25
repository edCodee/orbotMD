import { LogOut, User, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { confirmLogout } from '../utils/confirmLogout'; // Asumo que esta función existe

// ===============================================
// Componente de Modal de Resultados (Añadido)
// ===============================================
const ResultModal = ({ result, onClose }) => {
    if (!result) return null;

    const isSuccess = result.diagnosticMLMechanicalRiskLevel; // Un campo existe si hay éxito

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
                        {isSuccess ? "Evaluación y Diagnóstico Guardados" : "Error de Diagnóstico"}
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
                        Hubo un problema al generar el diagnóstico ML. Por favor, revise la consola para más detalles.
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
export default function DashDoctorMechanicalArm() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [indicators, setIndicators] = useState([]);
    const [scores, setScores] = useState({});
    const [observations, setObservations] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // 👇 NUEVOS ESTADOS PARA EL MODAL DE RESULTADOS
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);

    const navigate = useNavigate();

    // Función para resetear las evaluaciones
    const resetEvaluationState = useCallback(() => {
        setScores({});
        setObservations({});
    }, []);

    // Se mantiene igual, solo usa useCallback para ser más seguro
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Cargar datos del paciente
            const patientRes = await fetch(
                `${import.meta.env.VITE_API_URL}/api/PatientProfileFree/patientdiagnostic/${id}`,
                { headers: { accept: "text/plain" } }
            );
            const patientData = await patientRes.json();
            if (Array.isArray(patientData) && patientData.length > 0) {
                setPatient(patientData[0]);
            }

            // 2. Cargar indicadores
            const indicatorRes = await fetch(
                `${import.meta.env.VITE_API_URL}/api/IndicatorCatalog`,
                { headers: { accept: "text/plain" } }
            );
            const indicatorData = await indicatorRes.json();
            setIndicators(indicatorData);
        } catch (error) {
            console.error("Error al cargar datos iniciales:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
        // Al montar el componente, aseguramos que el estado de evaluación esté limpio
        resetEvaluationState();
    }, [fetchData, resetEvaluationState]);

    const handleSliderChange = (indicatorId, value) => {
        setScores((prev) => ({ ...prev, [indicatorId]: value }));
    };

    const handleObservationChange = (indicatorId, value) => {
        setObservations((prev) => ({ ...prev, [indicatorId]: value }));
    };

    // Función para manejar el cierre del modal y limpiar la evaluación
    const handleCloseResultModal = () => {
        setShowResultModal(false);
        setDiagnosisResult(null);
        // 👇 LÓGICA CLAVE: Resetear las puntuaciones y observaciones
        resetEvaluationState(); 
        // Si quisieras recargar la página: window.location.reload();, pero con resetEvaluationState es más suave.
    };

    const handleSave = async () => {
        if (!patient) return;
        setSaving(true);
        setDiagnosisResult(null); // Limpiar resultado anterior

        try {
            // 1. Guardar evaluaciones individuales
            for (const indicator of indicators) {
                const score = scores[indicator.indicatorCatalogId] || 3;
                const observation = observations[indicator.indicatorCatalogId] || "";

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/PatientIndicatorEvaluation`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            accept: "text/plain",
                        },
                        body: JSON.stringify({
                            patientIndicatorEvaluationPatientProfileFreeId:
                                patient.patientProfileFreeId,
                            patientIndicatorEvaluationIndicatorCatalogId:
                                indicator.indicatorCatalogId,
                            patientIndicatorEvaluationScore: score,
                            patientIndicatorEvaluationObservation: observation,
                        }),
                    }
                );

                if (!response.ok) {
                    const errorDetails = await response.text();
                    throw new Error(
                        `Error al guardar indicador ${indicator.indicatorCatalogId}. Detalles: ${errorDetails}`
                    );
                }
            }
            
            // 2. Preparar datos para API de Machine Learning
            const birthDate = new Date(patient.patientProfileFreeBirthDate);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            // Ajuste de edad
            if (today.getMonth() < birthDate.getMonth() || 
                (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
                age--;
            }

            // Mapeo de indicadores -> API ML (Usando valores predeterminados de 3 si no están evaluados)
            // NOTA: Es crucial que los IDs (1-8) coincidan con el catálogo real.
            const mlData = {
                gender: patient.patientProfileFreeGender,
                patientAge: age,
                sustainedAttention: scores[1] || 3, 
                planning: scores[2] || 3,
                categorization: scores[3] || 3,
                executiveFunction: scores[4] || 3,
                eyeHandCoordination: scores[5] || 3,
                fineMotorPrecision: scores[6] || 3,
                toleranceFrustration: scores[7] || 3,
                perseverance: scores[8] || 3,
            };

            // calcular totalScore
            mlData.totalScore = Object.values(mlData)
                .filter((v) => typeof v === "number")
                .reduce((a, b) => a + b, 0);

            // 3. Llamar API ML
            const mlResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/DiagnosticMLMechanicalArm/predict?patientProfileId=${patient.patientProfileFreeId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Ya no se requiere el 'accept: "text/plain"' si la respuesta es JSON
                    },
                    body: JSON.stringify(mlData),
                }
            );

            if (!mlResponse.ok) {
                const errorDetails = await mlResponse.text();
                // Si falla el ML, aún mostramos el modal, pero con mensaje de error.
                setDiagnosisResult({}); 
                setShowResultModal(true);
                throw new Error(`Error al generar diagnóstico ML. Estado: ${mlResponse.status}. Detalles: ${errorDetails}`);
            }

            const mlResult = await mlResponse.json();
            console.log("Diagnóstico ML exitoso:", mlResult);
            
            // ✅ Mostrar modal de éxito
            setDiagnosisResult(mlResult);
            setShowResultModal(true);
            
        } catch (error) {
            console.error("Error al guardar o diagnosticar:", error);
            // Si hubo un error en los fetch de guardar o en el ML (no 200), mostramos un modal de error simple.
            if (!showResultModal) {
                alert("❌ Hubo un problema al registrar la evaluación o el diagnóstico. Revise la consola.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return <p className="text-gray-400 text-center mt-10">Cargando...</p>;

    // ===============================================
    // RENDERIZADO DEL COMPONENTE
    // ===============================================
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#1a202c] text-white">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#2d3748] p-6 space-y-6 md:min-h-screen">
                <div className="text-2xl font-bold text-teal-400 mb-6 text-center md:text-left">
                    Panel Psicólogo
                </div>
                <nav className="space-y-4">
                    <Link to="/dashdoctorpatientlist" className="flex items-center gap-3 hover:text-teal-300">
                        <User /> <span>Pacientes</span>
                    </Link>
                    <Link
                        to="/login"
                        onClick={async (e) => {
                            e.preventDefault();
                            const confirmed = await confirmLogout();
                            if (confirmed) {
                                localStorage.removeItem('token');
                                navigate('/login', { replace: true });
                            }
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:text-teal-400 transition-all"
                    >
                        <LogOut /> <span>Salir</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-8 overflow-auto">
                {/* Encabezado con datos del paciente */}
                {patient && (
                    <div className="bg-gray-800 rounded-2xl p-6 shadow-md mb-8">
                        {/* ... (código de datos del paciente sin cambios) ... */}
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
                                ).toLocaleDateString()}
                            </span>
                        </p>
                    </div>
                )}

                {/* Título */}
                <h1 className="text-3xl font-bold text-teal-300 mb-8 text-center md:text-left">
                    Evaluación: Brazo Mecánico
                </h1>

                {/* Tabla de indicadores */}
                <div className="overflow-x-auto rounded-2xl shadow-lg bg-[#2d3748]">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-[#1a202c] text-gray-300">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    Dimensión evaluada
                                </th>
                                <th className="px-6 py-3 text-left">
                                    Descripción observable
                                </th>
                                <th className="px-6 py-3 text-center">
                                    Escala (1–5)
                                </th>
                                <th className="px-6 py-3 text-left">
                                    Observaciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {indicators.map((indicator) => (
                                <tr
                                    key={indicator.indicatorCatalogId}
                                    className="border-b border-gray-700 hover:bg-[#1f2733] transition"
                                >
                                    {/* Dimensión */}
                                    <td className="px-6 py-4 font-medium text-teal-400">
                                        {indicator.indicatorCatalogName}
                                    </td>

                                    {/* Descripción */}
                                    <td className="px-6 py-4 text-gray-300">
                                        {indicator.indicatorCatalogDescription}
                                    </td>

                                    {/* Slider */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                value={
                                                    scores[
                                                        indicator
                                                            .indicatorCatalogId
                                                    ] || 3
                                                }
                                                onChange={(e) =>
                                                    handleSliderChange(
                                                        indicator.indicatorCatalogId,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-32 accent-teal-400 cursor-pointer"
                                            />
                                            <span className="text-sm mt-1 text-teal-300 font-semibold">
                                                {scores[
                                                    indicator.indicatorCatalogId
                                                ] || 3}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Observaciones */}
                                    <td className="px-6 py-4">
                                        <textarea
                                            placeholder="Escribir observaciones..."
                                            className="w-full p-2 rounded-xl bg-[#1a202c] border border-gray-600 focus:ring-2 focus:ring-teal-400 outline-none resize-none text-sm text-white placeholder-gray-500"
                                            rows="2"
                                            value={
                                                observations[
                                                    indicator.indicatorCatalogId
                                                ] || ""
                                            }
                                            onChange={(e) =>
                                                handleObservationChange(
                                                    indicator.indicatorCatalogId,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Botón de Guardar */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl shadow-lg transition-all disabled:opacity-50"
                    >
                        {saving ? "Guardando..." : "Guardar Evaluación"}
                    </button>
                </div>
            </main>
            
            {/* Modal de Resultados (Añadido) */}
            {showResultModal && (
                <ResultModal result={diagnosisResult} onClose={handleCloseResultModal} />
            )}
        </div>
    );
}