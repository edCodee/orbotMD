import { CalendarCheck, ClipboardList, FileBarChart2, HeartPulse, ScrollText, UserCircle, Cpu, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { confirmLogout } from '../utils/confirmLogout';



export default function DiagnosticoPaciente() {
    const navigate = useNavigate();

    const diagnostico = {
        emitido: true,
        tipo: "TDAH - leve",
        recomendaciones: "Implementar pausas activas y apoyo docente personalizado.",
        resumen: "El paciente presenta síntomas leves de TDAH, lo que afecta su atención y concentración en el aula. Se recomienda un seguimiento regular y la implementación de estrategias de aprendizaje adaptadas.",
        acciones: [
            "Realizar ejercicios de relajación diariamente.",
            "Establecer una rutina de estudio en casa.",
            "Fomentar pausas activas durante las clases.",
            "Incluir actividades que estimulen la atención y la memoria.",
        ],
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
                                localStorage.removeItem('token');
                                navigate('/login', { replace: true });
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
                    {diagnostico.emitido ? (
                        <>
                            <p className="mb-2"><span className="font-semibold">Tipo:</span> {diagnostico.tipo}</p>
                            <p className="mt-2"><span className="font-semibold">Resumen:</span> {diagnostico.resumen}</p>
                            <p className="mt-2"><span className="font-semibold">Recomendaciones:</span> {diagnostico.recomendaciones}</p>
                            
                            <h3 className="text-lg font-bold text-teal-300 mt-4">Acciones Recomendadas</h3>
                            <ul className="list-disc pl-5 mt-2 text-gray-300">
                                {diagnostico.acciones.map((accion, index) => (
                                    <li key={index}>{accion}</li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-gray-400 italic">Aún no se ha emitido un diagnóstico.</p>
                    )}
                </section>
            </main>
        </div>
    );
}
