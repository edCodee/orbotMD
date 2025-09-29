import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { confirmLogout } from '../utils/confirmLogout';
import { Link, useNavigate } from "react-router-dom";



export default function DashDoctorMechanicalArm() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [indicators, setIndicators] = useState([]);
    const [scores, setScores] = useState({});
    const [observations, setObservations] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
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
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSliderChange = (indicatorId, value) => {
        setScores((prev) => ({ ...prev, [indicatorId]: value }));
    };

    const handleObservationChange = (indicatorId, value) => {
        setObservations((prev) => ({ ...prev, [indicatorId]: value }));
    };

    const handleSave = async () => {
        if (!patient) return;
        setSaving(true);

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
                    throw new Error(
                        `Error al guardar indicador ${indicator.indicatorCatalogId}`
                    );
                }
            }

            // 2. Preparar datos para API de Machine Learning
            const birthDate = new Date(patient.patientProfileFreeBirthDate);
            const age =
                new Date().getFullYear() -
                birthDate.getFullYear() -
                (new Date().getMonth() < birthDate.getMonth() ||
                (new Date().getMonth() === birthDate.getMonth() &&
                    new Date().getDate() < birthDate.getDate())
                    ? 1
                    : 0);

            // Mapeo de indicadores -> API ML
            const mlData = {
                gender: patient.patientProfileFreeGender,
                patientAge: age,
                sustainedAttention: scores[1] || 3, // Sustituir ID real de ese indicador
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
                `https://apidocbot20250917015226-fgg9dddefpcuc6b4.canadacentral-01.azurewebsites.net/api/DiagnosticMLMechanicalArm/predict?patientProfileId=${patient.patientProfileFreeId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        accept: "text/plain",
                    },
                    body: JSON.stringify(mlData),
                }
            );

            if (!mlResponse.ok) {
                throw new Error("Error al generar diagnóstico ML");
            }

            const mlResult = await mlResponse.json();
            console.log("Diagnóstico ML:", mlResult);

            alert(
                `✅ Evaluación y diagnóstico guardados\n\n` +
                    `Nivel de riesgo: ${mlResult.diagnosticMLMechanicalRiskLevel}\n` +
                    `Recomendaciones: ${mlResult.diagnosticMLMechanicalRecomendations}`
            );
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("❌ Hubo un problema al registrar la evaluación o el diagnóstico");
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return <p className="text-gray-400 text-center mt-10">Cargando...</p>;

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
        </div>
    );
}

