import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Brain, Activity, FileCheck, BarChart } from "lucide-react";

export default function PatientDetail() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatient = async () => {
        try {
            const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/PatientProfileFree/patientdiagnostic/${id}`,
            { headers: { accept: "text/plain" } }
            );
            const data = await response.json();

            // Ojo: el endpoint devuelve un array con un objeto
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

    if (loading) return <p className="text-gray-400 p-6">Cargando paciente...</p>;
    if (!patient) return <p className="text-red-400 p-6">Paciente no encontrado.</p>;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#1a202c] text-white">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#2d3748] p-6 space-y-6 md:min-h-screen">
            <div className="text-2xl font-bold text-teal-400 mb-6 text-center md:text-left">
            Panel Psicólogo
            </div>
            <nav className="space-y-4">
            <Link to="/pacientes" className="flex items-center gap-3 hover:text-teal-300">
                ← Volver a lista
            </Link>
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-auto">
            <h1 className="text-3xl font-bold text-teal-300 mb-6 text-center md:text-left">
            Detalle del Paciente
            </h1>

            {/* Top Buttons */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard 
            to={`/dashdoctormechanicalarm/${patient.patientProfileFreeId}`}
            icon={<Activity className="text-emerald-400" size={32} />} 
            title="Brazo Mecánico" 
            description="Evaluación con el brazo robótico."
            /> 

            <DashboardCard 
                to="/dashDoctorMarbleMaze"
                icon={<Brain className="text-blue-400" size={32} />} 
                title="Laberinto Canica"
                description="Ejercicio de coordinación."
            />

            <DashboardCard 
                to="/dashDoctorCodeGo"
                icon={<FileCheck className="text-pink-400" size={32} />} 
                title="Code & Go"
                description="Actividad de programación."
            />

            <DashboardCard 
                to="/dashDoctorProgress"
                icon={<BarChart className="text-purple-400" size={32} />} 
                title="Progreso"
                description="Seguimiento de avances."
            />
            </section>

            {/* Patient Info */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-md">
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
            <p className="text-sm text-gray-300 mt-4">
                Nivel de Riesgo:{" "}
                <span
                className={`font-bold ${
                    patient.diagnosticMlFreeRiskLevel === "Alto"
                    ? "text-red-400"
                    : patient.diagnosticMlFreeRiskLevel === "Medio"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
                >
                {patient.diagnosticMlFreeRiskLevel}
                </span>
            </p>
            <p className="text-sm text-gray-300 mt-2">
                Recomendaciones:{" "}
                <span className="text-white">{patient.diagnosticMlFreeRecommendations}</span>
            </p>
            {patient.diagnosticMlFreeNeedUrgentPsychologist && (
                <p className="text-red-400 font-bold mt-4">
                ⚠ Atención urgente requerida: necesita psicólogo de inmediato.
                </p>
            )}
            </div>
        </main>
        </div>
    );
    }

    /* ------------------------
    DashboardCard Component
    ------------------------- */
    function DashboardCard({ to, icon, title, description }) {
    const content = (
        <div className="bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-teal-500/20 hover:-translate-y-1 transition-all text-center cursor-pointer">
        <div className="flex justify-center mb-2">{icon}</div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
        </div>
    );

    return to ? <Link to={to}>{content}</Link> : content;
    }
