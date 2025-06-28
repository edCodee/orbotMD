import React from "react";
import { Link } from "react-router-dom";

const ParentsGuidePage = () => {
    return (
        <div className="min-h-screen bg-[#01274C] text-white px-4 py-10 flex flex-col items-center">
        <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-6">

            <h1 className="text-4xl font-extrabold text-[#06A2DB]">Guía para Padres de Niños con TDAH</h1>

            <p className="text-lg text-[#D1ECF6] max-w-3xl">
            Como padre de un niño con TDAH, es importante que tengas la información y los recursos necesarios para apoyar a tu hijo en su desarrollo y bienestar. A continuación, te presentamos una guía para padres de niños con TDAH.
            </p>

            {/* Imagen ilustrativa 1 */}
            <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
            <img
                src="guide2.png"
                alt="Padre y niño jugando juntos"
                className="w-full h-auto object-cover"
            />
            </div>

            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left">
            <h2 className="text-2xl font-bold text-white mb-4">Entendiendo el TDAH</h2>
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>El TDAH es un trastorno del neurodesarrollo que afecta la atención, la impulsividad y la actividad.</li>
                <li>Es importante entender que el TDAH no es una falta de disciplina o de inteligencia, sino una condición médica que requiere tratamiento y apoyo.</li>
                <li>Los niños con TDAH pueden tener dificultades para seguir instrucciones, completar tareas y controlar su comportamiento.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">Estrategias para apoyar a tu hijo</h2>
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>Establece un horario regular para las actividades diarias.</li>
                <li>Utiliza un sistema de recompensas y castigos para motivar a tu hijo.</li>
                <li>Proporciona oportunidades para la práctica de habilidades sociales y de comunicación.</li>
                <li>Busca apoyo de un profesional de la salud mental si es necesario.</li>
            </ul>
            </div>

            {/* Imagen ilustrativa 2 */}
            <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
            <img
                src="guide1.png"
                alt="Padre y niño hablando juntos"
                className="w-full h-auto object-cover"
            />
            </div>

            <p className="text-[#D1ECF6] max-w-2xl text-base mt-4">
            Recuerda que cada niño es único y puede requerir un enfoque personalizado. <span className="font-semibold text-white">OrbotMD</span> se compromete a proporcionar recursos y apoyo para ayudarte a entender y apoyar a tu hijo con TDAH.
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

export default ParentsGuidePage;
