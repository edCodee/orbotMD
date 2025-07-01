import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearUsuario() {
    const navigate = useNavigate();

    const provinciasEcuador = {
        "01": "Azuay", "02": "Bolivar", "03": "Cañar", "04": "Carchi", "05": "Cotopaxi",
        "06": "Chimborazo", "07": "El Oro", "08": "Esmeraldas", "09": "Guayas", "10": "Imbabura",
        "11": "Loja", "12": "Los Ríos", "13": "Manabí", "14": "Morona Santiago", "15": "Napo",
        "16": "Pastaza", "17": "Pichincha", "18": "Tungurahua", "19": "Zamora Chinchipe",
        "20": "Galápagos", "21": "Sucumbíos", "22": "Orellana", "23": "Santo Domingo de los Tsáchilas",
        "24": "Santa Elena", "30": "Ecuatorianos en el exterior"
    };

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
        userConfirmPassword: ""
    });

    const [modal, setModal] = useState({ open: false, type: "", message: "" });
    const [passwordStrength, setPasswordStrength] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "userId") {
        const cleanValue = value.replace(/\D/g, "").slice(0, 10);
        setForm((prev) => ({ ...prev, [name]: cleanValue }));
        } else {
        setForm((prev) => ({ ...prev, [name]: value }));
        }

        if (name === "userPassword") evaluatePasswordStrength(value);
    };

    const validateEmail = (email) => {
        const allowedDomains = [
        "gmail.com", "hotmail.com", "yahoo.com", "outlook.com",
        "uta.edu.ec", "edu.ec", "ec", "com", "net"
        ];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;
        return allowedDomains.some(domain => email.endsWith(domain));
    };

    const evaluatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&#._-]/.test(password)) strength++;

        if (strength <= 2) setPasswordStrength("Muy Débil");
        else if (strength === 3) setPasswordStrength("Débil");
        else if (strength === 4) setPasswordStrength("Fuerte");
        else if (strength === 5) setPasswordStrength("Muy Fuerte");
        else setPasswordStrength("");
    };

    const validateForm = () => {
        const isCedula = /^\d{10}$/.test(form.userId);
        if (isCedula) {
        const provinciaCodigo = form.userId.substring(0, 2);
        if (!provinciasEcuador[provinciaCodigo]) {
            setModal({
            open: true,
            type: "error",
            message: "El código de provincia de la cédula no es válido."
            });
            return false;
        }
        } else if (form.userId.length < 8) {
        setModal({
            open: true,
            type: "error",
            message: "Ingrese una cédula válida o un número de pasaporte (mínimo 8 caracteres)."
        });
        return false;
        }

        const birthDate = new Date(form.userBirthDate);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age < 15 || isNaN(age)) {
        setModal({
            open: true,
            type: "error",
            message: "El usuario debe tener al menos 15 años."
        });
        return false;
        }

        if (!validateEmail(form.userEmail)) {
        setModal({
            open: true,
            type: "error",
            message: "El correo electrónico no es válido."
        });
        return false;
        }

        if (form.userPassword.length < 8) {
        setModal({
            open: true,
            type: "error",
            message: "La contraseña debe tener al menos 8 caracteres."
        });
        return false;
        }

        if (form.userPassword !== form.userConfirmPassword) {
        setModal({
            open: true,
            type: "error",
            message: "Las contraseñas no coinciden."
        });
        return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = { ...form };
        payload.userBirthDate = new Date(payload.userBirthDate).toISOString();

try {
    const response = await fetch(
        "https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/User",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "text/plain",
            },
            body: JSON.stringify(payload),
        }
    );


        if (response.ok) {
            setModal({
            open: true,
            type: "success",
            message: "Usuario creado con éxito."
            });
        } else {
            const errorText = await response.text();

            let friendlyMessage = "Error al crear el usuario: el correo electrónico, el nombre de usuario o la cédula ingresados ya existen en el sistema. Por favor, verifique la información e inténtelo nuevamente.";

            if (errorText.includes("cedula") || errorText.includes("userId")) {
            friendlyMessage = "El número de cédula ya está registrado, intente con otro.";
            } else if (errorText.includes("username") || errorText.includes("userUsername")) {
            friendlyMessage = "El nombre de usuario ya existe, intente con otro.";
            } else if (errorText.includes("email") || errorText.includes("userEmail")) {
            friendlyMessage = "El correo electrónico ya está registrado, intente con otro.";
            }

            setModal({
            open: true,
            type: "error",
            message: friendlyMessage
            });
        }
        } catch (error) {
        setModal({
            open: true,
            type: "error",
            message: `Error de red: ${error.message}`
        });
        }
    };

    return (
        <div className="min-h-screen bg-[#01274C] flex justify-center items-center p-4">
        <div className="w-full max-w-3xl bg-[#015B97] rounded-2xl shadow-2xl p-8 relative">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Crear Nuevo Usuario</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="relative">
                <input
                type="text"
                name="userId"
                placeholder="Cédula o Pasaporte"
                value={form.userId}
                onChange={handleChange}
                required
                className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:ring-2 focus:ring-[#06A2DB]"
                />
                {form.userId.length >= 2 && provinciasEcuador[form.userId.substring(0, 2)] && (
                <div className="absolute top-2 right-2 text-xs font-semibold text-[#50C878] bg-[#01274C]/70 px-2 py-1 rounded">
                    {provinciasEcuador[form.userId.substring(0, 2)]}
                </div>
                )}
            </div>

            <input
                type="text"
                name="userUsername"
                placeholder="Nombre de usuario"
                value={form.userUsername}
                onChange={handleChange}
                required
                className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:ring-2 focus:ring-[#06A2DB]"
            />
            <input
                type="text"
                name="userFirstName"
                placeholder="Primer nombre"
                value={form.userFirstName}
                onChange={handleChange}
                required
                className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:ring-2 focus:ring-[#06A2DB]"
            />
            <input
                type="text"
                name="userMiddleName"
                placeholder="Segundo nombre"
                value={form.userMiddleName}
                onChange={handleChange}
                className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:ring-2 focus:ring-[#06A2DB]"
            />
            <input
                type="text"
                name="userLastName"
                placeholder="Apellido paterno"
                value={form.userLastName}
                onChange={handleChange}
                required
                className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:ring-2 focus:ring-[#06A2DB]"
            />
            <input
                type="text"
                name="userSecondLastName"
                placeholder="Apellido materno"
                value={form.userSecondLastName}
                onChange={handleChange}
                className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:ring-2 focus:ring-[#06A2DB]"
            />
            <input
                type="email"
                name="userEmail"
                placeholder="Correo electrónico"
                value={form.userEmail}
                onChange={handleChange}
                required
                className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:ring-2 focus:ring-[#06A2DB]"
            />
            <div className="col-span-1 relative">
                <input
                type="password"
                name="userPassword"
                placeholder="Contraseña"
                value={form.userPassword}
                onChange={handleChange}
                required
                className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:ring-2 focus:ring-[#06A2DB]"
                />
                {passwordStrength && (
                <div
                    className={`mt-1 text-xs font-semibold ${
                    passwordStrength === "Muy Débil"
                        ? "text-red-500"
                        : passwordStrength === "Débil"
                        ? "text-yellow-500"
                        : passwordStrength === "Fuerte"
                        ? "text-green-500"
                        : "text-green-700"
                    }`}
                >
                    Fortaleza: {passwordStrength}
                </div>
                )}
            </div>
            <input
                type="password"
                name="userConfirmPassword"
                placeholder="Confirmar contraseña"
                value={form.userConfirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:ring-2 focus:ring-[#06A2DB]"
            />

            <div className="md:col-span-2">
                <label className="block text-white mb-2">Fecha de nacimiento</label>
                <input
                type="date"
                name="userBirthDate"
                value={form.userBirthDate}
                onChange={handleChange}
                required
                className="w-full bg-[#01274C] text-white p-4 rounded-xl border border-gray-500 focus:ring-2 focus:ring-[#06A2DB]"
                />
            </div>
            <div className="md:col-span-2 flex justify-between mt-6">
                <button
                type="submit"
                className="bg-[#06A2DB] hover:bg-[#015B97] transition-colors text-white px-8 py-3 rounded-xl font-semibold shadow-md"
                >
                Crear Usuario
                </button>
                <button
                type="button"
                onClick={() => navigate("/")}
                className="text-[#06A2DB] hover:underline font-semibold"
                >
                Cancelar
                </button>
            </div>
            </form>
        </div>

        {/* Modal dinámico (éxito o error) */}
        {modal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01274C]/60 backdrop-blur-md">
            <div className="bg-gradient-to-br from-[#009689]/80 to-[#013C6A]/80 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-[#01274C]/50 animate-fadeIn">
                <h2
                className={`text-2xl font-semibold mb-4 ${
                    modal.type === "success" ? "text-[#50C878]" : "text-red-400"
                }`}
                >
                {modal.type === "success" ? "¡Éxito!" : "Error"}
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-[#E0F2F1]">{modal.message}</p>
                {modal.type === "success" ? (
                <button
                    onClick={() => navigate("/login")}
                    className="bg-[#50C878]/80 hover:bg-[#50C878] text-[#01274C] px-6 py-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105"
                >
                    OK
                </button>
                ) : (
                <button
                    onClick={() => setModal({ open: false, type: "", message: "" })}
                    className="bg-red-400/80 hover:bg-red-400 text-[#01274C] px-6 py-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105"
                >
                    Cerrar
                </button>
                )}
            </div>
            </div>
        )}
        </div>
    );
}
