import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import { Link } from "react-router-dom";


const Slideshow = () => {
    const images = [
        "/ruta-imagen5.png",
        "/ruta-imagen6.png",
        "/ruta-imagen7.png",
        "/img1.png",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="rounded-xl shadow-2xl w-full h-[400px] overflow-hidden transition-all duration-500 ease-in-out">
            <img
                src={images[currentIndex]}
                alt={`Imagen ${currentIndex + 1}`}
                className="w-full h-full object-cover"
            />
        </div>
    );
};


export default function LoginPage() {
    const [cedula, setCedula] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/User/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: cedula,
                    userPassword: password,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setError(errorText || "Credenciales inválidas.");
                return;
            }

            const data = await response.json();
            localStorage.setItem("roles", JSON.stringify(data.roles));
            localStorage.setItem('token', data.token);
            const userRole = data.roles[0]?.roleSerial;

            if (!data.roles || data.roles.length === 0) {
                setError("No se encontraron roles asignados, contactese con el administrador.");
                return;
            }

            if (data.roles.length === 1) {
                const role = data.roles[0];
                if (role.roleSerial === 1) {
                    navigate("/dashadministrator");
                } else if (role.roleSerial === 2) {
                    navigate("/dashpatient");
                } else if (role.roleSerial === 5) {
                    navigate("/dashdoctor");
                } else {
                    navigate(`/dashboard/${role.roleName.toLowerCase()}`);
                }
            } else {
                // múltiples roles → ir al selector
                navigate("/selectionrole");
            }

        } catch (err) {
            setError("Error en el servidor o conexión.");
            console.error("Login error:", err);
        }
    };

    return (
    <>
        {/* Encabezado con logo y nombre */}
        <div className="bg-[#01274C] py-4">
            <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-center">
                <img
                    alt="Logo de OrbotMD"
                    src="/logodocbot.png" // Asegúrate que esté en `public/`
                    className="h-28 w-28 object-contain"
                />
                <h1 className="text-5xl sm:text-6xl font-bold text-white">
                    OrbotMD
                </h1>
            </div>
        </div>

        {/* Cuerpo principal con slideshow y formulario */}
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center min-h-screen gap-y-8 lg:gap-x-20">
            {/* Slideshow */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                <Slideshow />
            </div>

            {/* Formulario de login */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-md shadow-md">
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Cédula o Pasaporte
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            required
                            className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300"
                        />
                        {/* <div className="mt-2 text-right text-sm">
                            <a href="#" className="text-indigo-600 hover:text-indigo-500">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div> */}
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}
<div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 w-full">
    <button
        type="submit"
        className="bg-blue-600 text-white px-8 py-2 w-full sm:w-auto sm:min-w-[150px] rounded-md hover:bg-blue-700 transition text-center"
    >
        Iniciar
    </button>

    <Link
        to="/createuser"
        className="text-blue-600 border border-blue-600 px-8 py-2 w-full sm:w-auto sm:min-w-[150px] rounded-md hover:bg-blue-50 transition text-center font-medium"
    >
        Registrarse
    </Link>
</div>
                </form>
            </div>
        </div>
    </>
);

}
