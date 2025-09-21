import React, { useEffect, useState } from "react";
import { User, Info, LogOut } from "lucide-react";
import { confirmLogout } from '../utils/confirmLogout';
import {useNavigate, Link } from "react-router-dom";

export default function PatientProfiles() {

    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
        try {
            const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/PatientProfileFree/patientprofilefreelist`,
            { headers: { accept: "text/plain" } }
            );
            const data = await response.json();
            setPatients(data);
        } catch (error) {
            console.error("Error al cargar pacientes:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchPatients();
    }, []);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#1a202c] text-white">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#2d3748] p-6 space-y-6 md:min-h-screen">
            <div className="text-2xl font-bold text-teal-400 mb-6 text-center md:text-left">
            Panel Psicólogo
            </div>
            <nav className="space-y-4">
            <Link to="/dashdoctorpatientlist" className="flex items-center gap-3 hover:text-teal-300">
                <User /> <span>Pacientes</span>
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
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-auto">
            <h1 className="text-3xl font-bold text-teal-300 mb-8 text-center md:text-left">
            Lista de Pacientes
            </h1>

            {loading ? (
            <p className="text-gray-400">Cargando pacientes...</p>
            ) : (
            <div className="space-y-4">
                {patients.map((p, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center bg-gray-800 rounded-2xl p-5 shadow-md hover:shadow-lg hover:bg-gray-700 transition-all"
                >
                    <div>
                    <p className="text-lg font-semibold text-white">
                        Representante:{" "}
                        <span className="text-teal-400">
                        {p.userFirstName} {p.userLastName}
                        </span>
                    </p>
                    <p className="text-sm text-gray-300">
                        Paciente:{" "}
                        <span className="text-blue-400">
                        {p.patientProfileFreeFirstName} {p.patientProfileFreeLastName}
                        </span>
                    </p>
                    </div>

                    <Link
                    to={`/paciente/${p.patientProfileFreeId}`}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-medium px-4 py-2 rounded-xl transition-all"
                    >
                    <Info size={18} /> Ver más información
                    </Link>

                </div>
                ))}
            </div>
            )}
        </main>
        </div>
    );
}
