import { useState } from "react";
import {
    LayoutDashboard, UserPlus, Briefcase, Building2,
    Settings, Users, Stethoscope, NotebookPen, BarChart,
    Menu
    } from "lucide-react";
    import { Link } from "react-router-dom";

    export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const stats = {
        totalUsuarios: 120,
        psicologosActivos: 15,
        pacientesActivos: 85,
    };

    const diagnosticosRecientes = [
        { nombre: "Juan Pérez", diagnostico: "Ansiedad", fecha: "2025-05-20" },
        { nombre: "Luisa Gómez", diagnostico: "TDAH", fecha: "2025-05-19" },
        { nombre: "Carlos León", diagnostico: "Depresión leve", fecha: "2025-05-18" },
    ];

    const topEscuelas = [
        { escuela: "Unidad Educativa Central", pacientes: 23 },
        { escuela: "Colegio San José", pacientes: 19 },
        { escuela: "Escuela Mixta Esperanza", pacientes: 17 },
    ];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#1a202c] text-white">
        {/* Sidebar */}
        <aside className={`bg-[#2d3748] p-6 w-full lg:w-64 space-y-6 absolute lg:relative top-0 left-0 z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
            <div className="text-2xl font-bold text-teal-400 mb-6">Admin Salud</div>
            <nav className="space-y-4">
            <Link to="/admin" className="flex items-center gap-3 text-teal-300 hover:text-white">
                <LayoutDashboard /> <span>Dashboard</span>
            </Link>
            <Link to="/user" className="flex items-center gap-3 hover:text-white">
                <Users /> <span>Usuarios</span>
            </Link>
            <Link to="/psicologos" className="flex items-center gap-3 hover:text-white">
                <Stethoscope /> <span>Psicólogos</span>
            </Link>
            <Link to="/pacientes" className="flex items-center gap-3 hover:text-white">
                <UserPlus /> <span>Pacientes</span>
            </Link>
            <Link to="/assignedroles" className="flex items-center gap-3 hover:text-white">
                <Settings /> <span>Roles</span>
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
                <p className="text-3xl font-semibold mt-2">{stats.totalUsuarios}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-lg text-teal-300 font-bold">Psicólogos Activos</h2>
                <p className="text-3xl font-semibold mt-2">{stats.psicologosActivos}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-lg text-teal-300 font-bold">Pacientes Activos</h2>
                <p className="text-3xl font-semibold mt-2">{stats.pacientesActivos}</p>
            </div>
            </section>

            {/* Últimos diagnósticos */}
            <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Últimos Diagnósticos</h2>
            <ul className="space-y-3">
                {diagnosticosRecientes.map((d, i) => (
                <li key={i} className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between">
                    <div>
                    <p className="font-semibold">{d.nombre}</p>
                    <p className="text-sm text-gray-400">{d.diagnostico}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 sm:mt-0">{d.fecha}</p>
                </li>
                ))}
            </ul>
            </section>

            {/* Evaluaciones mensuales y top escuelas */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">Evaluaciones por Mes</h2>
                <div className="h-40 flex items-center justify-center text-gray-400 italic text-center">
                {/* Aquí irá una gráfica (por ahora es texto simulado) */}
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
