import { CalendarCheck, ClipboardList, FileBarChart2, HeartPulse, ScrollText, UserCircle, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";


export default function PacienteDashboard() {
    const perfil = {
        nombre: "",
        edad: 14,
        escuela: "Unidad Educativa Central",
        grado: "9no de Básica",
    };

    const [menuOpen, setMenuOpen] = useState(false);

    const diagnostico = {
        emitido: true,
        tipo: "TDAH - leve",
        recomendaciones: "Implementar pausas activas y apoyo docente personalizado.",
    };

    const sesiones = [
        { fecha: "2025-05-20", psicologo: "Dra. Morales", resultado: "Evaluación de atención" },
        { fecha: "2025-04-18", psicologo: "Dra. Morales", resultado: "Test de habilidades cognitivas" },
    ];

    const progreso = [
        { habilidad: "Atención", actual: 65, anterior: 50 },
        { habilidad: "Memoria", actual: 75, anterior: 70 },
        { habilidad: "Lectura", actual: 80, anterior: 78 },
    ];

    return (
<div className="flex flex-col lg:flex-row min-h-screen bg-[#1a202c] text-white">

            {/* Botón hamburguesa solo en móviles */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-[#2d3748]">
                <div className="text-xl font-bold text-teal-400">Bienvenido</div>
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Sidebar responsive */}
            <aside
                className={`fixed z-50 top-0 left-0 h-full w-64 bg-[#2d3748] p-6 space-y-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                } lg:block`}
            >
                <div className="text-2xl font-bold text-teal-400 mb-6 hidden lg:block">Bienvenido</div>
                <nav className="space-y-4">
                    <Link to="/dashpatient" className="flex items-center gap-3 text-teal-400">
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
        <main className="flex-1 p-6 lg:p-10 space-y-10">
            {/* Datos personales */}
            <section className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-teal-300 mb-4">Datos Personales</h2>
            <p><span className="font-semibold">Edad:</span> {perfil.edad}</p>
            <p><span className="font-semibold">Escuela:</span> {perfil.escuela}</p>
            <p><span className="font-semibold">Grado:</span> {perfil.grado}</p>
            </section>

            {/* Último diagnóstico */}
            <section className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-teal-300 mb-4">Diagnóstico</h2>
            {diagnostico.emitido ? (
                <>
                <p><span className="font-semibold">Tipo:</span> {diagnostico.tipo}</p>
                <p className="mt-2"><span className="font-semibold">Recomendaciones:</span> {diagnostico.recomendaciones}</p>
                </>
            ) : (
                <p className="text-gray-400 italic">Aún no se ha emitido un diagnóstico.</p>
            )}
            </section>

            {/* Historial de sesiones */}
            <section className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-teal-300 mb-4">Historial de Sesiones</h2>
            <ul className="space-y-3">
                {sesiones.map((s, i) => (
                <li key={i} className="flex justify-between bg-gray-700 p-4 rounded-lg">
                    <div>
                    <p className="font-semibold">{s.fecha}</p>
                    <p className="text-sm text-gray-400">{s.resultado} con {s.psicologo}</p>
                    </div>
                </li>
                ))}
            </ul>
            </section>

            {/* Progreso general */}
            <section className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-teal-300 mb-4">Progreso por Habilidad</h2>
            <ul className="space-y-4">
                {progreso.map((p, i) => (
                <li key={i} className="flex justify-between items-center">
                    <div>
                    <p className="font-semibold">{p.habilidad}</p>
                    <p className="text-sm text-gray-400">Antes: {p.anterior} - Ahora: {p.actual}</p>
                    </div>
                    <div className="w-40 h-2 bg-gray-600 rounded">
                    <div
                        className="h-2 bg-teal-400 rounded"
                        style={{ width: `${p.actual}%` }}
                    ></div>
                    </div>
                </li>
                ))}
            </ul>
            </section>

            {/* Recomendaciones */}
            <section className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-teal-300 mb-4">Sugerencias del Psicólogo</h2>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Realizar ejercicios de relajación diariamente.</li>
                <li>Establecer una rutina de estudio en casa.</li>
                <li>Fomentar pausas activas durante las clases.</li>
            </ul>
            </section>
        </main>
        </div>
    );
}



