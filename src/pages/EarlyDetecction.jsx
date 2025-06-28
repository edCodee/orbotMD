import React from "react";
import { Link } from "react-router-dom";

const EarlyDetectionPage = () => {
    return (
        <div className="min-h-screen bg-[#01274C] text-white px-4 py-10 flex flex-col items-center">
        <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-6">
            <h1 className="text-4xl font-extrabold text-[#06A2DB]">Detección Temprana del TDAH</h1>

            <p className="text-lg text-[#D1ECF6] max-w-3xl">
            La detección temprana del TDAH es esencial para intervenir de forma oportuna y apoyar el desarrollo cognitivo y emocional del niño.
            </p>

            <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
            <img src="/earlydetection1.png" alt="Detección Temprana" className="w-full h-auto object-cover" />
            </div>

            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left text-lg space-y-4">
            <p>Los primeros signos pueden observarse antes de los 7 años de edad, aunque muchos casos se detectan más tarde.</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Conductas impulsivas constantes</li>
                <li>Dificultades para seguir instrucciones simples</li>
                <li>Retrasos en el desarrollo del lenguaje</li>
                <li>Problemas persistentes de concentración</li>
            </ul>
            </div>

            <p className="text-[#D1ECF6] max-w-2xl text-base mt-4">
            Identificar estos signos de forma temprana permite ofrecer herramientas educativas adaptadas y efectivas.
            </p>

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

export default EarlyDetectionPage;
