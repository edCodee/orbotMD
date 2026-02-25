import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { User, LogOut, BarChart, HardHat, AlertTriangle, CheckCircle } from "lucide-react";
// Asumo que esta utilidad existe
// import { confirmLogout } from "../utils/confirmLogout";

// API URL para el diagnóstico ML (la que proporcionaste)
const ML_DIAGNOSTIC_API_URL = "https://apidocbot20260224220610-b7fnd9fsgyejfmcf.canadacentral-01.azurewebsites.net";


// Función para obtener el color del nivel de riesgo
const getRiskColor = (level) => {
    if (!level) return "text-gray-400";
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes("alto") || lowerLevel.includes("urgente")) return "text-red-500 font-bold";
    if (lowerLevel.includes("medio")) return "text-yellow-500 font-semibold";
    return "text-green-500";
};

// Componente principal de progreso
export default function Progress() {
    const { id } = useParams(); // id del patientProfileFree
    const [patient, setPatient] = useState(null);
    const [concentrationMetrics, setConcentrationMetrics] = useState([]); // Métricas de concentración
    const [mlDiagnostics, setMlDiagnostics] = useState([]); // 👈 Nuevo estado para diagnósticos ML
    const [loading, setLoading] = useState(true);
    const [loadingConcentrationMetrics, setLoadingConcentrationMetrics] = useState(true);
    const [loadingMlDiagnostics, setLoadingMlDiagnostics] = useState(true); // 👈 Nuevo estado de carga
    const navigate = useNavigate();

    // 🔹 Fetch datos del paciente
    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/PatientProfileFree/patientdiagnostic/${id}`,
                    { headers: { accept: "text/plain" } }
                );
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setPatient(data[0]);
                }
            } catch (error) {
                console.error("Error al cargar paciente:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    // 🔹 Fetch métricas de concentración (Robot Ratón)
    useEffect(() => {
        const fetchConcentrationMetrics = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/ConcetrationMetric/by-profile/${id}`,
                    { headers: { accept: "text/plain" } }
                );
                const data = await response.json();
                if (Array.isArray(data)) {
                    setConcentrationMetrics(data);
                }
            } catch (error) {
                console.error("Error al cargar métricas de concentración:", error);
            } finally {
                setLoadingConcentrationMetrics(false);
            }
        };
        fetchConcentrationMetrics();
    }, [id]);

    // 🔹 Fetch diagnósticos ML de juegos robóticos (NUEVO)
    useEffect(() => {
        const fetchMlDiagnostics = async () => {
            setLoadingMlDiagnostics(true);
            try {
                const response = await fetch(
                    `${ML_DIAGNOSTIC_API_URL}/${id}`,
                    { headers: { accept: "text/plain" } }
                );
                const data = await response.json();
                if (Array.isArray(data)) {
                    // Ordenar por fecha de creación descendente para ver el más reciente primero
                    data.sort((a, b) => new Date(b.diagnosticMLMechanicalCreateAt) - new Date(a.diagnosticMLMechanicalCreateAt));
                    setMlDiagnostics(data);
                }
            } catch (error) {
                console.error("Error al cargar diagnósticos ML:", error);
            } finally {
                setLoadingMlDiagnostics(false);
            }
        };
        fetchMlDiagnostics();
    }, [id]);

    if (loading) return <p className="text-gray-400 p-6">Cargando progreso...</p>;
    if (!patient) return <p className="text-red-400 p-6">Paciente no encontrado.</p>;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#1a202c] text-white">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#2d3748] p-6 space-y-6 md:min-h-screen">
                <div className="text-2xl font-bold text-teal-400 mb-6 text-center md:text-left">
                    Panel Psicólogo
                </div>
                <nav className="space-y-4">
                    <Link
                        to="/dashdoctorpatientlist"
                        className="flex items-center gap-3 hover:text-teal-300"
                    >
                        <User /> <span>Pacientes</span>
                    </Link>
                    <button
                        onClick={async (e) => {
                            e.preventDefault();
                            // Asumo que confirmLogout existe y funciona, si no, usar navigate('/login')
                            /* const confirmed = await confirmLogout(); 
                            if (confirmed) {
                                localStorage.removeItem("token");
                                navigate("/login", { replace: true });
                            } */
                            localStorage.removeItem("token");
                            navigate("/login", { replace: true });
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:text-teal-400 transition-all w-full text-left"
                    >
                        <LogOut /> <span>Salir</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-8 overflow-auto">
                <h1 className="text-3xl font-bold text-purple-400 mb-6 flex items-center gap-3">
                    <BarChart size={32} className="text-purple-400" /> Progreso del Paciente
                </h1>

                {/* Patient Info */}
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
                            {patient.patientProfileFreeFirstName} {patient.patientProfileFreeLastName}
                        </span>
                    </p>
                    <p className="text-sm text-gray-300">
                        Género: <span className="text-white">{patient.patientProfileFreeGender}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                        Fecha de Nacimiento:{" "}
                        <span className="text-white">
                            {new Date(patient.patientProfileFreeBirthDate).toLocaleDateString()}
                        </span>
                    </p>
                </div>

                {/* Sección 1: Métricas de Concentración (Robot Ratón) */}
                <section className="bg-gray-900 rounded-2xl p-6 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-teal-300 mb-4 flex items-center gap-2">
                        <HardHat size={20} /> Métricas de Concentración (Robot Ratón)
                    </h2>

                    {loadingConcentrationMetrics ? (
                        <p className="text-gray-400">Cargando métricas de concentración...</p>
                    ) : concentrationMetrics.length === 0 ? (
                        <p className="text-gray-400">No hay métricas de concentración registradas para este paciente.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-300 border-b border-gray-700">
                                        <th className="p-3 whitespace-nowrap">Fecha</th>
                                        <th className="p-3 whitespace-nowrap">Duración (ms)</th>
                                        <th className="p-3 whitespace-nowrap">% Movimiento</th>
                                        <th className="p-3 whitespace-nowrap">Promedio Movimiento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {concentrationMetrics.map((m) => (
                                        <tr key={m.concetrationMetricId} className="border-b border-gray-700 hover:bg-gray-800 transition">
                                            <td className="p-3">
                                                {new Date(m.concetrationMetricCreateAt).toLocaleString()}
                                            </td>
                                            <td className="p-3">{m.concetrationMetricDurationMs}</td>
                                            <td className="p-3">{m.concetrationMetricPercentMoving}%</td>
                                            <td className="p-3">{m.concetrationMetricAvgMovement}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Sección 2: Diagnóstico ML de Juegos Robóticos (NUEVO) */}
                <section className="bg-gray-900 rounded-2xl p-6 shadow-md">
                    <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                        <BarChart size={20} /> Diagnóstico ML de Juegos Robóticos
                    </h2>

                    {loadingMlDiagnostics ? (
                        <p className="text-gray-400">Cargando diagnósticos ML...</p>
                    ) : mlDiagnostics.length === 0 ? (
                        <p className="text-gray-400">No hay diagnósticos ML registrados para este paciente.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-300 border-b border-gray-700">
                                        <th className="p-3 whitespace-nowrap">Fecha</th>
                                        <th className="p-3 whitespace-nowrap">Nivel de Riesgo</th>
                                        <th className="p-3 whitespace-nowrap">¿Psicólogo Urgente?</th>
                                        <th className="p-3">Recomendaciones (último)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mlDiagnostics.map((d, index) => (
                                        <tr key={d.diagnosticMLMechanicalId} className={`border-b border-gray-700 hover:bg-gray-800 transition ${index === 0 ? 'bg-gray-700/50' : ''}`}>
                                            <td className="p-3">
                                                {new Date(d.diagnosticMLMechanicalCreateAt).toLocaleString()}
                                            </td>
                                            <td className={`p-3 font-semibold ${getRiskColor(d.diagnosticMLMechanicalRiskLevel)}`}>
                                                {d.diagnosticMLMechanicalRiskLevel || 'N/A'}
                                            </td>
                                            <td className="p-3">
                                                {d.diagnosticMLMechanicalNeedUrgentPsychologist ? (
                                                    <AlertTriangle className="w-5 h-5 text-red-500" title="Necesita Psicólogo Urgente" />
                                                ) : (
                                                    <CheckCircle className="w-5 h-5 text-green-500" title="Riesgo Controlado" />
                                                )}
                                            </td>
                                            <td className="p-3 max-w-xs truncate text-sm text-gray-400" title={d.diagnosticMLMechanicalRecomendations}>
                                                {/* Solo mostramos la recomendación completa para el más reciente */}
                                                {index === 0 ? d.diagnosticMLMechanicalRecomendations : d.diagnosticMLMechanicalRecomendations.substring(0, 50) + '...'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}