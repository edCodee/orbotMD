import React from "react";
import { Link } from "react-router-dom";

const RecommendationsPage = () => {
    return (
        <div className="min-h-screen bg-[#01274C] text-white px-4 py-10 flex flex-col items-center">
        <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-6">

            <h1 className="text-4xl font-extrabold text-[#06A2DB]">Recomendaciones para Niños con TDAH</h1>

            <p className="text-lg text-[#D1ECF6] max-w-3xl">
            A continuación, te presentamos algunas recomendaciones para ayudar a niños con TDAH a mejorar su calidad de vida y alcanzar su máximo potencial.
            </p>

            {/* Imagen ilustrativa 1 */}
            <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
            <img
                src="/recomendation2.png"
                alt="Niño con TDAH en un entorno de aprendizaje"
                className="w-full h-auto object-cover"
            />
            </div>

            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left">
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>Establecer un horario regular para las actividades diarias</li>
                <li>Crear un entorno de aprendizaje organizado y libre de distracciones</li>
                <li>Utilizar herramientas visuales para ayudar a la organización y la planificación</li>
                <li>Fomentar la actividad física regular para mejorar la concentración y la regulación emocional</li>
                <li>Proporcionar oportunidades para la práctica de habilidades sociales y de comunicación</li>
                <li>Ofrecer recompensas y reconocimientos por logros y comportamientos positivos</li>
                <li>Establecer límites claros y consistentes para el comportamiento</li>
            </ul>
            </div>

            {/* Imagen ilustrativa 2 */}
            <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
            <img
                src="/recomendation1.png"
                alt="Niño con TDAH en un entorno de juego"
                className="w-full h-auto object-cover"
            />
            </div>

            <p className="text-[#D1ECF6] max-w-2xl text-base mt-4">
            Es importante recordar que cada niño es único y puede requerir un enfoque personalizado. <span className="font-semibold text-white">OrbotMD</span> ofrece herramientas y recursos para ayudar a los padres y educadores a crear un plan de apoyo individualizado para cada niño.
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

export default RecommendationsPage;
