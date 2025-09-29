import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { User, LogOut, BarChart } from "lucide-react";
import { confirmLogout } from "../utils/confirmLogout";

    export default function Progress() {
    const { id } = useParams(); // id del patientProfileFree
    const [patient, setPatient] = useState(null);
    const [metrics, setMetrics] = useState([]); // 👈 nuevo estado
    const [loading, setLoading] = useState(true);
    const [loadingMetrics, setLoadingMetrics] = useState(true);
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

    // 🔹 Fetch métricas de concentración
    useEffect(() => {
        const fetchMetrics = async () => {
        try {
            const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/ConcetrationMetric/by-profile/${id}`,
            { headers: { accept: "text/plain" } }
            );
            const data = await response.json();
            if (Array.isArray(data)) {
            setMetrics(data);
            }
        } catch (error) {
            console.error("Error al cargar métricas:", error);
        } finally {
            setLoadingMetrics(false);
        }
        };
        fetchMetrics();
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
            <Link
                to="/login"
                onClick={async (e) => {
                e.preventDefault();
                const confirmed = await confirmLogout();
                if (confirmed) {
                    localStorage.removeItem("token");
                    navigate("/login", { replace: true });
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

            {/* Métricas */}
            <section className="bg-gray-900 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-teal-300 mb-4">
                Métricas de Concentración (Robot Ratón)
            </h2>

            {loadingMetrics ? (
                <p className="text-gray-400">Cargando métricas...</p>
            ) : metrics.length === 0 ? (
                <p className="text-gray-400">No hay métricas registradas para este paciente.</p>
            ) : (
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-gray-300 border-b border-gray-700">
                    <th className="p-2">Fecha</th>
                    <th className="p-2">Duración (ms)</th>
                    <th className="p-2">% Movimiento</th>
                    <th className="p-2">Promedio Movimiento</th>
                    </tr>
                </thead>
                <tbody>
                    {metrics.map((m) => (
                    <tr key={m.concetrationMetricId} className="border-b border-gray-700">
                        <td className="p-2">
                        {new Date(m.concetrationMetricCreateAt).toLocaleString()}
                        </td>
                        <td className="p-2">{m.concetrationMetricDurationMs}</td>
                        <td className="p-2">{m.concetrationMetricPercentMoving}%</td>
                        <td className="p-2">{m.concetrationMetricAvgMovement}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
            </section>
        </main>
        </div>
    );
}
