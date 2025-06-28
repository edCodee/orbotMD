import React, { useState } from "react";
import { Link } from "react-router-dom";

const ContactPage = () => {
    const [enviado, setEnviado] = useState(false);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviado(true);
        setTimeout(() => {
            setEnviado(false);
            setNombre("");
            setEmail("");
            setMensaje("");
        }, 1000); // Reducir el tiempo de espera a 1 segundo
    };

    return (
        <div className="min-h-screen bg-[#01274C] text-white px-4 py-10 flex flex-col items-center">
        <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-6">

            <h1 className="text-4xl font-extrabold text-[#06A2DB]">Contactanos</h1>

            <p className="text-lg text-[#D1ECF6] max-w-3xl">
            ¡Estamos aquí para ayudarte! Si tienes alguna pregunta o necesitas más información sobre nuestros servicios, no dudes en contactarnos.
            </p>

            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left">
            <h2 className="text-2xl font-bold text-white mb-4">Información de Contacto</h2>
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>Dirección: Calle 123, Ciudad, País</li>
                <li>Teléfono: +56 9 1234 5678</li>
                <li>Correo Electrónico: [info@orbotmd.com](mailto:info@orbotmd.com)</li>
                <li>Horario de Atención: Lunes a Viernes, 9:00 am - 6:00 pm</li>
            </ul>
            </div>

            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left mt-6">
            <h2 className="text-2xl font-bold text-white mb-4">Formulario de Contacto</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="p-4 rounded-lg border border-gray-300" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" className="p-4 rounded-lg border border-gray-300" />
                    <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Mensaje" className="p-4 rounded-lg border border-gray-300" />
                    <button type="submit" className="bg-[#06A2DB] hover:bg-[#015B97] text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-300">Enviar</button>
                </div>
            </form>
            {enviado && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#01274C] bg-opacity-50">
                    <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl text-white text-lg text-center">
                        Muy pronto nos contactaremos contigo.
                    </div>
                </div>
            )}
            </div>

            <Link
            to="/"
            className="inline-block mt-8 bg-[#06A2DB] hover:bg-[#015B97] text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-300"
            >
            Volver a la página principal
            </Link>
        </div>
        </div>
    );
};

export default ContactPage;
