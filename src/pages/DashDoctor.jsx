import React from 'react';
import {
    User,
    FileCheck,
    HeartPulse,
    Stethoscope,
    LogOut,
    AlertTriangle,
    Brain,
    MessageSquareHeart,
    ClipboardList,
    ClipboardCheck,
    FilePlus,
    Search,
    } from "lucide-react";
    import { Link } from "react-router-dom";

    export default function PsychologistDashboard() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#1a202c] text-white">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#2d3748] p-6 space-y-6 md:min-h-screen">
            <div className="text-2xl font-bold text-teal-400 mb-6 text-center md:text-left">Panel Psicólogo</div>
            <nav className="space-y-4">
            <Link to="/pacientes" className="flex items-center gap-3 text-teal-300 hover:text-white">
                <User /> <span>Pacientes</span>
            </Link>
            <Link to="/nueva-evaluacion" className="flex items-center gap-3 hover:text-white">
                <FilePlus /> <span>Nueva Evaluación</span>
            </Link>
            <Link to="/evaluar-estaciones" className="flex items-center gap-3 hover:text-white">
                <ClipboardList /> <span>Evaluar por Estaciones</span>
            </Link>
            <Link to="/aplicar-test" className="flex items-center gap-3 hover:text-white">
                <Search /> <span>Aplicar Test</span>
            </Link>
            <Link to="/diagnosticos-alertas" className="flex items-center gap-3 hover:text-white">
                <Brain /> <span>Diagnóstico y Alertas</span>
            </Link>
            <Link to="/resumen-evaluacion" className="flex items-center gap-3 hover:text-white">
                <ClipboardCheck /> <span>Resumen Evaluación</span>
            </Link>
            <Link to="/sesiones" className="flex items-center gap-3 hover:text-white">
                <MessageSquareHeart /> <span>Sesiones</span>
            </Link>
            <Link to="/login" className="flex items-center gap-3 hover:text-white">
                <LogOut /> <span>Salir</span>
            </Link>
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-auto">
            <h1 className="text-3xl font-bold text-teal-300 mb-6 text-center md:text-left">Bienvenido, Psicólogo</h1>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <DashboardCard to="/nueva-evaluacion" icon={<FilePlus className="text-teal-400" size={32} />} title="Nueva Evaluación" description="Iniciar una nueva sesión de evaluación." />
            <DashboardCard to="/evaluar-estaciones" icon={<ClipboardList className="text-blue-400" size={32} />} title="Evaluar por Estaciones" description="Registrar indicadores por estación." />
            <DashboardCard to="/aplicar-test" icon={<Search className="text-pink-400" size={32} />} title="Aplicar Test" description="Buscar e ingresar resultados de tests." />
            <DashboardCard to="/diagnosticos-alertas" icon={<Brain className="text-purple-300" size={32} />} title="Diagnóstico y Alertas" description="Registrar diagnóstico clínico o alertas." />
            <DashboardCard to="/resumen-evaluacion" icon={<ClipboardCheck className="text-green-300" size={32} />} title="Resumen de Evaluación" description="Ver resumen de la sesión actual." />
            <DashboardCard to="/sesiones" icon={<MessageSquareHeart className="text-emerald-300" size={32} />} title="Sesiones Activas" description="Ver o continuar sesiones en curso." />
            <DashboardCard to="/caso-critico" icon={<AlertTriangle className="text-yellow-300" size={32} />} title="Caso Crítico" description="Atención urgente requerida." />

            </section>
        </main>
        </div>
    );
    }

    function DashboardCard({ to, icon, title, description }) {
    return (
        <Link to={to}>
        <div className="bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-teal-500/20 hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-4">
            {icon}
            <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            </div>
        </div>
        </Link>
    );
}
