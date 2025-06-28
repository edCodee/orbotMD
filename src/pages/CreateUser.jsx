import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearUsuario() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        userPhoto: null,
        userId: "",
        userFirstName: "",
        userMiddleName: "",
        userLastName: "",
        userSecondLastName: "",
        userBirthDate: "",
        userUsername: "",
        userEmail: "",
        userPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = { ...form };
        data.userBirthDate = new Date(data.userBirthDate).toISOString();

        try {
            const response = await fetch(`http://${window.location.hostname}:5010/Api/User`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "text/plain",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("✅ Usuario creado correctamente");
                navigate("/login");
            } else {
                const errorText = await response.text();
                alert("❌ Error al crear usuario: " + errorText);
            }
        } catch (error) {
            alert("❌ Error de red: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#01274C] flex justify-center items-center p-4">
            <div className="w-full max-w-3xl bg-[#015B97] rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Crear Nuevo Usuario</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="userId" placeholder="Cédula o ID" value={form.userId} onChange={handleChange} required className="input bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    <input type="text" name="userUsername" placeholder="Nombre de usuario" value={form.userUsername} onChange={handleChange} required className="input bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    <input type="text" name="userFirstName" placeholder="Primer nombre" value={form.userFirstName} onChange={handleChange} required className="input bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    <input type="text" name="userMiddleName" placeholder="Segundo nombre" value={form.userMiddleName} onChange={handleChange} className="input bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    <input type="text" name="userLastName" placeholder="Apellido paterno" value={form.userLastName} onChange={handleChange} required className="input bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    <input type="text" name="userSecondLastName" placeholder="Apellido materno" value={form.userSecondLastName} onChange={handleChange} className="input bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    <input type="email" name="userEmail" placeholder="Correo electrónico" value={form.userEmail} onChange={handleChange} required className="input bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    <input type="password" name="userPassword" placeholder="Contraseña" value={form.userPassword} onChange={handleChange} required className="input bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    <div className="md:col-span-2">
                        <label className="block text-white mb-2">Fecha de nacimiento</label>
                        <input type="date" name="userBirthDate" value={form.userBirthDate} onChange={handleChange} required className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06A2DB]" />
                    </div>
                    <div className="md:col-span-2 flex justify-between mt-6">
                        <button type="submit" className="bg-[#06A2DB] hover:bg-[#015B97] transition-colors text-white px-8 py-3 rounded-xl font-semibold shadow-md">
                            Crear Usuario
                        </button>
                        <button type="button" onClick={() => navigate("/")} className="text-[#06A2DB] hover:underline font-semibold">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
