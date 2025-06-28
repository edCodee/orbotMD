import { CalendarCheck, ClipboardList, FileBarChart2, HeartPulse, ScrollText, UserCircle, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProgresoPaciente() {
    const progresoData = {
        sesionesCompletadas: 18,
        sesionesTotales: 20,
        metrics: [
            { name: "Atención", value: 75 },    // porcentaje
            { name: "Memoria", value: 60 },
            { name: "Concentración", value: 80 },
        ],
    };

    // Helper to get pie slice using SVG circle stroke dasharray
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const porcentajeSesion = (progresoData.sesionesCompletadas / progresoData.sesionesTotales) * 100;
    const dashOffset = circumference - (circumference * porcentajeSesion) / 100;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#1a202c] text-white">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 bg-[#2d3748] p-6 space-y-6">
                <div className="text-2xl font-bold text-teal-400 mb-6">Evaluación</div>
                <nav className="space-y-4">
                    <Link to="/dashpatient" className="flex items-center gap-3 hover:text-teal-400">
                        <UserCircle /> <span>Perfil</span>
                    </Link>
                    <Link to="/sessions" className="flex items-center gap-3 hover:text-teal-400">
                        <ClipboardList /> <span>Sesiones</span>
                    </Link>
                    <Link to="/diagnosis" className="flex items-center gap-3 hover:text-teal-400">
                        <ScrollText /> <span>Diagnóstico</span>
                    </Link>
                    <Link to="/progresspatient" className="flex items-center gap-3 text-teal-400">
                        <FileBarChart2 /> <span>Progreso</span>
                    </Link>
                    <Link to="/recomendationspatient" className="flex items-center gap-3 hover:text-teal-400">
                        <HeartPulse /> <span>Recomendaciones</span>
                    </Link>
                    <Link to="/nextevaluationpatient" className="flex items-center gap-3 hover:text-teal-400">
                        <CalendarCheck /> <span>Próxima Evaluación</span>
                    </Link>
                    <Link
                    to="/initmachine"
                    className="flex items-center gap-3 bg-emerald-500 text-white font-semibold px-4 py-2 rounded hover:bg-teal-600 transition"
                        >
                        <Cpu /> <span>Diagnóstico Inteligente</span>
                    </Link>
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 lg:p-10 space-y-12">
                <section className="bg-gray-800 p-8 rounded-xl shadow space-y-6">
                    <h2 className="text-2xl font-bold text-teal-300">Progreso del Paciente</h2>

                    {/* Gráfico circular para sesiones completadas */}
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="relative w-40 h-40 flex flex-col items-center justify-center">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                {/* Fondo del círculo */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    stroke="#2d3748"
                                    strokeWidth="10"
                                    fill="none"
                                />
                                {/* Progreso */}
                                <g transform="rotate(-90 60 60)">
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r={radius}
                                        stroke="#4fd1c5"
                                        strokeWidth="10"
                                        fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={dashOffset}
                                        strokeLinecap="round"
                                    />
                                </g>
                                {/* Porcentaje texto en centro */}
                                <text
                                    x="60"
                                    y="65"
                                    textAnchor="middle"
                                    fontSize="22"
                                    fill="#4fd1c5"
                                    fontWeight="bold"
                                >
                                    {Math.round(porcentajeSesion)}%
                                </text>
                            </svg>
                            {/* Texto descriptivo bajo el gráfico */}
                            <div className="mt-3 text-center text-teal-400 font-semibold select-none" style={{ userSelect: "none" }}>
                                Sesiones <br /> completadas
                            </div>
                        </div>

                        {/* Barras de progreso para métricas */}
                        <div className="flex-1 space-y-6">
                            {progresoData.metrics.map((metric, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-1 font-semibold">
                                        <span>{metric.name}</span>
                                        <span>{metric.value}%</span>
                                    </div>
                                    <div className="w-full bg-[#2d3748] rounded-full h-5">
                                        <div
                                            className="bg-teal-400 h-5 rounded-full transition-all duration-1000"
                                            style={{ width: `${metric.value}%` }}
                                        />
                                    </div>
                                    <p className="text-gray-300 mt-1 text-sm">
                                        {metric.name === "Atención" && "Capacidad para mantenerse concentrado durante las actividades."}
                                        {metric.name === "Memoria" && "Habilidad para recordar información importante."}
                                        {metric.name === "Concentración" && "Nivel general de concentración en tareas."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Texto resumen */}
                    <div className="text-gray-300">
                        <p>
                            El progreso se actualiza regularmente para que puedas ver tu desempeño en diferentes áreas. Recuerda que estos indicadores ayudan a identificar tus fortalezas y áreas donde puedes mejorar.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

