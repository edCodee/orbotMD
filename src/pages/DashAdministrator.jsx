import { useEffect, useState } from "react";
import {LayoutDashboard,UserPlus,Briefcase,Building2,Settings,Users,Stethoscope,NotebookPen,BarChart,Menu,LogOut,} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { confirmLogout } from "../utils/confirmLogout";

    export default function AdminDashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [diagnosticosRecientes, setDiagnosticosRecientes] = useState([]);

    // para la gráfica simulada
    const topEscuelas = [
        { escuela: "Unidad Educativa Central", pacientes: 0 },
        { escuela: "Colegio San José", pacientes: 0 },
        { escuela: "Escuela Mixta Esperanza", pacientes: 0 },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
// https://localhost:7087/api/User/count
        // total usuarios
        fetch("https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/User/count", {
        headers: {
            Accept: "text/plain",
            Authorization: `Bearer ${token}`,
        },
        })
        .then((res) => res.json())
        .then((data) => setTotalUsuarios(data))
        .catch((err) => console.error("Error usuarios count", err));
// https://localhost:7087/api/User/latest-diagnostics
        // últimos diagnósticos
        fetch("https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/User/latest-diagnostics", {
        headers: {
            Accept: "text/plain",
            Authorization: `Bearer ${token}`,
        },
        })
        .then((res) => res.json())
        .then((data) => setDiagnosticosRecientes(data))
        .catch((err) => console.error("Error diagnosticos", err));
    }, []);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#1a202c] text-white">
        {/* Sidebar */}
        <aside
            className={`bg-[#2d3748] p-6 w-full lg:w-64 space-y-6 absolute lg:relative top-0 left-0 z-50 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
        >
            <div className="text-2xl font-bold text-teal-400 mb-6">Admin Salud</div>
            <nav className="space-y-4">
            <Link to="/user" className="flex items-center gap-3 hover:text-teal-400">
                <Users /> <span>Usuarios</span>
            </Link>
            <Link to="/assignedroles" className="flex items-center gap-3 hover:text-teal-400">
                <Settings /> <span>Roles</span>
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

        {/* Botón para abrir el sidebar en móviles */}
        <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-4 text-teal-300 absolute top-0 left-0 z-50"
        >
            <Menu size={28} />
        </button>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 mt-14 lg:mt-0">
            <h1 className="text-3xl font-bold text-teal-300 mb-8">Panel Administrativo</h1>

            {/* Tarjetas resumen */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-lg text-teal-300 font-bold">Total Usuarios</h2>
                <p className="text-3xl font-semibold mt-2">{totalUsuarios}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-lg text-teal-300 font-bold">Psicólogos Activos</h2>
                <p className="text-3xl font-semibold mt-2">0</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-lg text-teal-300 font-bold">Pacientes Activos</h2>
                <p className="text-3xl font-semibold mt-2">Actualización en espera</p>
            </div>
            </section>

            {/* Últimos diagnósticos */}
            <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Últimos Diagnósticos</h2>
            <ul className="space-y-3">
                {diagnosticosRecientes.map((d, i) => {
                let color = "text-green-400";
                if (d.riskLevel === "Medio") color = "text-yellow-400";
                if (d.riskLevel === "Alto") color = "text-red-400";
                return (
                    <li
                    key={i}
                    className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between"
                    >
                    <div>
                        <p className="font-semibold">
                        {d.patientFirstName} {d.patientLastName}
                        </p>
                        <p className={`text-sm font-bold ${color}`}>
                        Nivel de TDAH: {d.riskLevel}
                        </p>
                    </div>
                    </li>
                );
                })}
            </ul>
            </section>

            {/* Evaluaciones mensuales y top escuelas */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">Evaluaciones por Mes</h2>
                <div className="h-40 flex items-center justify-center text-gray-400 italic text-center">
                [Gráfico de barras aquí con recharts o chart.js]
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">Top Escuelas con Más Pacientes</h2>
                <ul className="space-y-3">
                {topEscuelas.map((e, i) => (
                    <li key={i} className="flex justify-between">
                    <span>{e.escuela}</span>
                    <span className="text-teal-300 font-semibold">{e.pacientes}</span>
                    </li>
                ))}
                </ul>
            </div>
            </section>
        </main>
        </div>
    );
}
