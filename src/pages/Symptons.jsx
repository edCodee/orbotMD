import React from "react";
import { Link } from "react-router-dom";

const SymptomsPage = () => {
    return (
        <div className="min-h-screen bg-[#01274C] text-white px-4 py-10 flex flex-col items-center">
        <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-6">

            <h1 className="text-4xl font-extrabold text-[#06A2DB]">Síntomas Comunes del TDAH</h1>

            <p className="text-lg text-[#D1ECF6] max-w-3xl">
            El Trastorno por Déficit de Atención e Hiperactividad (TDAH) se manifiesta a través de diversos síntomas,
            especialmente en la infancia. Identificarlos a tiempo es clave para un tratamiento efectivo.
            </p>

            {/* Imagen ilustrativa 1 */}
            <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
            <img
                src="/symptons2.png"
                alt="Ilustración TDAH"
                className="w-full h-auto object-cover"
            />
            </div>

            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left">
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>Dificultad para mantener la atención en tareas o juegos</li>
                <li>Cometer errores por descuido en actividades escolares</li>
                <li>Parece no escuchar cuando se le habla directamente</li>
                <li>Dificultad para organizar tareas y actividades</li>
                <li>Evita o le disgusta realizar tareas que requieren esfuerzo mental sostenido</li>
                <li>Frecuentemente pierde objetos necesarios para las actividades</li>
                <li>Se distrae fácilmente con estímulos externos</li>
                <li>Habla en exceso o interrumpe conversaciones</li>
            </ul>
            </div>

            {/* Imagen ilustrativa 2 */}
            <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
            <img
                src="/symptons1.png"
                alt="Niño con TDAH"
                className="w-full h-auto object-cover"
            />
            </div>

            <p className="text-[#D1ECF6] max-w-2xl text-base mt-4">
            Estos síntomas pueden variar según la edad. <span className="font-semibold text-white">OrbotMD</span> busca transformar la educación y el desarrollo cognitivo
            con herramientas interactivas diseñadas especialmente para estos niños.
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

export default SymptomsPage;
