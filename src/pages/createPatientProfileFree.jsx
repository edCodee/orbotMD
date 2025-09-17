import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function CrearPaciente() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form, setForm] = useState({
        patientProfileFreeFirstName: "",
        patientProfileFreeLastName: "",
        patientProfileFreeGender: "",
        patientProfileFreeBirthDate: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = { ...form };
        data.patientProfileFreeBirthDate = new Date(data.patientProfileFreeBirthDate).toISOString();
// https://localhost:7087/api/PatientProfileFree/create
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/PatientProfileFree/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "text/plain",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsModalOpen(true); // mostrar modal de éxito
            } else {
                const errorText = await response.text();
                alert("❌ Error al crear paciente: " + errorText);
            }
        } catch (error) {
            alert("❌ Error de red: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#01274C] flex justify-center items-center p-4">
            <div className="w-full max-w-3xl bg-[#015B97] rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Crear Nuevo Paciente</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="patientProfileFreeFirstName" placeholder="Primer nombre" value={form.patientProfileFreeFirstName} onChange={handleChange} required className="input bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    <input type="text" name="patientProfileFreeLastName" placeholder="Apellido" value={form.patientProfileFreeLastName} onChange={handleChange} required className="input bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    
                    {/* ComboBox de Género */}
                    <select
                        name="patientProfileFreeGender"
                        value={form.patientProfileFreeGender}
                        onChange={handleChange}
                        required
                        className="bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]"
                    >
                        <option value="" disabled>Seleccionar género</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>

                    <div className="md:col-span-2">
                        <label className="block text-white mb-2">Fecha de nacimiento</label>
                        <input type="date" name="patientProfileFreeBirthDate" value={form.patientProfileFreeBirthDate} onChange={handleChange} required className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    </div>

                    <div className="md:col-span-2 flex justify-between mt-6">
                        <button type="submit" className="bg-[#06A2DB] hover:bg-[#015B97] transition-colors text-white px-8 py-3 rounded-xl font-semibold shadow-md">
                            Crear Paciente
                        </button>
                        <button type="button" onClick={() => navigate("/")} className="text-[#06A2DB] hover:underline font-semibold">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal de Éxito */}
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
                            ✅ ¡Paciente creado!
                        </h2>
                        <p className="mb-6 text-sm leading-relaxed text-[#E0F2F1]">
                            El perfil del paciente se ha registrado correctamente.
                        </p>

                        <div className="flex justify-center">
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
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
