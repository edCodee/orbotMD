import { CalendarCheck, ClipboardList, FileBarChart2, HeartPulse, ScrollText, UserCircle, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProximaEvaluacionPaciente() {
    const evaluacion = {
        fecha: "2024-07-15",
        hora: "10:00 AM",
        lugar: "Clínica Central - Sala 5",
        modalidad: "Presencial",
        objetivo:
            "Evaluar el progreso en atención, memoria y concentración con técnicas estandarizadas para ajustar el plan de intervención.",
        recomendaciones: [
            "Duerme bien la noche anterior.",
            "Desayuna adecuadamente.",
            "Llegar 10 minutos antes.",
            "Trae todos los materiales necesarios y cualquier documentación previa.",
        ],
    };

    // Helper to format date more human readable
    function formatDate(dateStr) {
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateStr);
        return date.toLocaleDateString("es-ES", options);
    }

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
                    <Link to="/diagnosis" className="flex items-center gap-3 hover:text-teal-400">
                        <ScrollText /> <span>Diagnóstico</span>
                    </Link>
                    <Link to="/progresspatient" className="flex items-center gap-3 hover:text-teal-400">
                        <FileBarChart2 /> <span>Progreso</span>
                    </Link>
                    <Link to="/recomendationspatient" className="flex items-center gap-3 hover:text-teal-400">
                        <HeartPulse /> <span>Recomendaciones</span>
                    </Link>
                    <Link to="/nextevaluationpatient" className="flex items-center gap-3 text-teal-400">
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
            <main className="flex-1 p-6 lg:p-10 space-y-10">
                <section className="bg-gray-800 p-8 rounded-xl shadow max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-teal-300 mb-6">Próxima Evaluación</h2>
                    <div className="space-y-4 text-gray-300">
                        <p>
                            <span className="font-semibold text-teal-400">Fecha: </span>
                            {formatDate(evaluacion.fecha)} a las {evaluacion.hora}
                        </p>
                        <p>
                            <span className="font-semibold text-teal-400">Lugar: </span>
                            {evaluacion.lugar} ({evaluacion.modalidad})
                        </p>
                        <p>
                            <span className="font-semibold text-teal-400">Objetivo: </span>
                            {evaluacion.objetivo}
                        </p>
                        <div>
                            <span className="font-semibold text-teal-400">Recomendaciones para la evaluación:</span>
                            <ul className="list-disc list-inside mt-2 text-gray-400">
                                {evaluacion.recomendaciones.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
