import { useEffect, useState } from "react";
import {
    CalendarCheck,
    ClipboardList,
    FileBarChart2,
    HeartPulse,
    ScrollText,
    UserCircle,
    Cpu,
    LogOut,
    } from "lucide-react";
    import { Link, useNavigate } from "react-router-dom";
    import { confirmLogout } from "../utils/confirmLogout";

    export default function DiagnosticoPaciente() {
    const navigate = useNavigate();

    const [diagnostico, setDiagnostico] = useState(null);

        useEffect(() => {
    const fetchDiagnostico = async () => {
        try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/Diagnostics/diagnostics`,
            {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            }
        );

        if (!response.ok) {
            console.error("Error al obtener diagnóstico:", response.status);
            return;
        }

                const data = await response.json();
        if (data.length > 0) {
            const diag = data[0];

            // recomendaciones dinámicas
            let acciones = [];
            if (diag.diagnosticMlFreeRiskLevel === "Alto") {
                acciones = [
                    "Consultar a un especialista de forma inmediata.",
                    "Establecer límites claros en rutinas diarias.",
                    "Aumentar supervisión en actividades escolares.",
                    "Fomentar hábitos de sueño saludables.",
                    "Reducir exposición a pantallas electrónicas.",
                    "Establecer espacios de diálogo familiar diario.",
                    "Priorizar actividades al aire libre y sociales.",
                    "Planificar seguimiento psicológico profesional.",
                    "Incluir técnicas de respiración o mindfulness.",
                    "Monitorear cambios emocionales o de conducta.",
                ];
            } else if (diag.diagnosticMlFreeRiskLevel === "Moderado") { // CAMBIO: "Medio" ahora es "Moderado"
                acciones = [
                    "Fomentar comunicación activa en casa.",
                    "Acompañar rutinas escolares diariamente.",
                    "Promover actividades de relajación.",
                    "Limitar uso de dispositivos electrónicos.",
                ];
            } else if (diag.diagnosticMlFreeRiskLevel === "Bajo") {
                acciones = [
                    "Mantener hábitos de estudio estables.",
                    "Realizar chequeos periódicos con el docente.",
                    "Fortalecer actividades recreativas saludables.",
                ];
            } else if (diag.diagnosticMlFreeRiskLevel === "No") { // CAMBIO AÑADIDO: Nueva clase "No"
                acciones = [
                    "Mantener un ambiente de apoyo y bienestar emocional.",
                    "Fomentar la comunicación abierta en el entorno familiar.",
                    "Promover actividades saludables y recreativas.",
                    "Monitorear el desarrollo y comportamiento de manera regular."
                ];
            }

            setDiagnostico({
            emitido: true,
            tipo: diag.diagnosticMlFreeRiskLevel,
            recomendaciones: diag.diagnosticMlFreeRecommendations,
            resumen:
                "Diagnóstico basado en inteligencia artificial para riesgo psicológico.",
            acciones,
            });
        }
        } catch (error) {
        console.error("Error en fetchDiagnostico:", error);
        }
    };

    fetchDiagnostico();
    }, []);


    

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#1a202c] text-white">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-[#2d3748] p-6 space-y-6">
            <div className="text-2xl font-bold text-teal-400 mb-6">Diagnóstico</div>
            <nav className="space-y-4">
            <Link to="/dashpatient" className="flex items-center gap-3 hover:text-teal-400">
                <UserCircle /> <span>Perfil</span>
            </Link>
            <Link to="/sessions" className="flex items-center gap-3 hover:text-teal-400">
                <ClipboardList /> <span>Sesiones</span>
            </Link>
            <Link to="/diagnosis" className="flex items-center gap-3 text-teal-400">
                <ScrollText /> <span>Diagnóstico</span>
            </Link>
            <Link to="/progresspatient" className="flex items-center gap-3 hover:text-teal-400">
                <FileBarChart2 /> <span>Progreso</span>
            </Link>
            <Link to="/recomendationspatient" className="flex items-center gap-3 hover:text-teal-400">
                <HeartPulse /> <span>Recomendaciones</span>
            </Link>
            <Link to="/nextevaluationpatient" className="flex items-center gap-3 hover:text-teal-400">
                <CalendarCheck /> <span>Próxima Evaluación</span>
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
            <Link
                to="/diagnosisintelligent"
                className="flex items-center gap-3 bg-emerald-500 text-white font-semibold px-4 py-2 rounded hover:bg-teal-600 transition"
            >
                <Cpu /> <span>Diagnóstico Inteligente</span>
            </Link>
            </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 lg:p-10 space-y-10">
            {/* Último diagnóstico */}
            <section className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-teal-300 mb-4">Diagnóstico</h2>
            {diagnostico ? (
                <>
                <p className="mb-2">
                    <span className="font-semibold">Tipo:</span> {diagnostico.tipo}
                </p>
                <p className="mt-2">
                    <span className="font-semibold">Resumen:</span> {diagnostico.resumen}
                </p>
                <p className="mt-2">
                    <span className="font-semibold">Recomendaciones:</span> {diagnostico.recomendaciones}
                </p>

                <h3 className="text-lg font-bold text-teal-300 mt-4">Acciones Recomendadas</h3>
                <ul className="list-disc pl-5 mt-2 text-gray-300">
                    {diagnostico.acciones.map((accion, index) => (
                    <li key={index}>{accion}</li>
                    ))}
                </ul>
                </>
            ) : (
                <p className="text-gray-400 italic">No hay diagnóstico registrado</p>
            )}
            </section>
        </main>
        </div>
    );
}
