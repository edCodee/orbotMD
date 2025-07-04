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

    export default function SesionesPaciente() {
    const navigate = useNavigate();
    const [sesiones, setSesiones] = useState([]);

    useEffect(() => {
        const fetchSesionesIA = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
            "https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/Diagnostics/diagnostics",
            {
                method: "GET",
                headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (!res.ok) {
            console.error("Error al obtener diagnóstico:", res.status);
            return;
            }

            const data = await res.json();
            if (data.length > 0) {
            const diag = data[0];

            // convertir fecha y hora a formato legible
            const fechaHora = new Date(diag.diagnosticMlFreeCreatedAt).toLocaleString("es-EC", {
                dateStyle: "medium",
                timeStyle: "short",
            });

            setSesiones([
                {
                fecha: fechaHora,
                resultado: "Evaluación realizada por sistema de IA",
                },
            ]);
            }
        } catch (error) {
            console.error("Error en fetchSesionesIA:", error);
        }
        };

        fetchSesionesIA();
    }, []);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#1a202c] text-white">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-[#2d3748] p-6 space-y-6">
            <div className="text-2xl font-bold text-teal-400 mb-6">Sesiones</div>
            <nav className="space-y-4">
            <Link to="/dashpatient" className="flex items-center gap-3 hover:text-teal-400">
                <UserCircle /> <span>Perfil</span>
            </Link>
            <Link to="/sessions" className="flex items-center gap-3 text-teal-400">
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
                to="/initmachine"
                className="flex items-center gap-3 bg-emerald-500 text-white font-semibold px-4 py-2 rounded hover:bg-teal-600 transition"
            >
                <Cpu /> <span>Diagnóstico Inteligente</span>
            </Link>
            </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 lg:p-10 space-y-10">
            {/* Historial de sesiones */}
            <section className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-teal-300 mb-4">Historial de Sesiones</h2>
            <ul className="space-y-3">
                {sesiones.length > 0 ? (
                sesiones.map((s, i) => (
                    <li key={i} className="flex justify-between bg-gray-700 p-4 rounded-lg">
                    <div>
                        <p className="font-semibold">{s.fecha}</p>
                        <p className="text-sm text-gray-400">{s.resultado}</p>
                    </div>
                    </li>
                ))
                ) : (
                <li className="text-gray-400 italic">Aún no hay sesiones registradas.</li>
                )}
            </ul>
            </section>
        </main>
        </div>
    );
}
