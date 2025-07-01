import { CalendarCheck, ClipboardList, FileBarChart2, HeartPulse, ScrollText, UserCircle, Cpu, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { confirmLogout } from '../utils/confirmLogout';
import { useState } from "react";

export default function RecomendacionesPaciente() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true); // Modal abierto por defecto

    const recomendaciones = [
        {
            titulo: "Pausas Activas",
            descripcion:
                "Realizar pequeñas pausas activas durante el estudio para mejorar la concentración y reducir la fatiga mental.",
            icon: "🏃‍♂️",
        },
        {
            titulo: "Apoyo Docente Personalizado",
            descripcion:
                "Solicitar apoyo adicional en la escuela para adaptar las actividades a las necesidades del paciente.",
            icon: "📚",
        },
        {
            titulo: "Rutina de Sueño",
            descripcion:
                "Mantener horarios regulares para dormir al menos 8 horas por la noche para favorecer la atención y el bienestar.",
            icon: "🛌",
        },
        {
            titulo: "Ejercicios de Relajación",
            descripcion:
                "Practicar técnicas de relajación como respiración profunda o meditación para disminuir la ansiedad.",
            icon: "🧘",
        },
    ];

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#1a202c] text-white">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 bg-[#2d3748] p-6 space-y-6">
                <div className="text-2xl font-bold text-teal-400 mb-6">Recomendaciones</div>
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
                    <Link to="/recomendationspatient" className="flex items-center gap-3 text-teal-400">
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
                <section className="bg-gray-800 p-8 rounded-xl shadow space-y-6">
                    <h2 className="text-2xl font-bold text-teal-300 mb-6">Recomendaciones</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recomendaciones.map(({ titulo, descripcion, icon }, index) => (
                            <div
                                key={index}
                                className="bg-[#2d3748] p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-default flex gap-4 items-center"
                            >
                                <div className="text-4xl">{icon}</div>
                                <div>
                                    <h3 className="text-xl font-semibold text-teal-400 mb-1">{titulo}</h3>
                                    <p className="text-gray-300">{descripcion}</p>
                                </div>
                            </div>
                        ))}
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
