import { CalendarCheck, ClipboardList, FileBarChart2, HeartPulse, ScrollText, UserCircle, Cpu, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { confirmLogout } from '../utils/confirmLogout';
import { useState } from "react";

export default function ProximaEvaluacionPaciente() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true); // Modal abierto por defecto

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

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

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

            {/* Modal de advertencia */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01274C]/60 backdrop-blur-md">
                    <div
                        className="
                            relative 
                            bg-gradient-to-br 
                            from-[#009689]/80 
                            to-[#013C6A]/80 
                            rounded-3xl 
                            shadow-2xl 
                            p-8 
                            max-w-sm 
                            w-full 
                            text-center 
                            border 
                            border-[#01274C]/50 
                            backdrop-blur-xl 
                            animate-fadeIn
                        "
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-[#50C878]">
                            ¡Atención!
                        </h2>
                        <p className="mb-6 text-sm leading-relaxed text-[#E0F2F1]">
                            Mil disculpas, necesitas una versión premium para acceder a esta sección.
                        </p>

                        <div className="flex justify-center gap-4">
                            <Link
                                to="/errorpage2"
                                className="
                                    bg-[#50C878]/80 
                                    hover:bg-[#50C878] 
                                    text-[#01274C] 
                                    px-5 
                                    py-2.5 
                                    rounded-full 
                                    shadow-md 
                                    backdrop-blur-sm 
                                    transition-all 
                                    duration-300 
                                    hover:scale-105
                                "
                            >
                                Haste Pro  💎
                            </Link>
                            <button
                                onClick={() => navigate("/dashpatient")}
                                className="
                                    bg-[#50C878]/80 
                                    hover:bg-[#50C878] 
                                    text-[#01274C] 
                                    px-5 
                                    py-2.5 
                                    rounded-full 
                                    shadow-md 
                                    backdrop-blur-sm 
                                    transition-all 
                                    duration-300 
                                    hover:scale-105
                                "
                            >
                                Regresar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
