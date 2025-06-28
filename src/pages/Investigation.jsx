import React from "react";
import { Link } from "react-router-dom";

const ResearchPage = () => {
    return (
        <div className="min-h-screen bg-[#01274C] text-white px-4 py-10 flex flex-col items-center">
        <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-6">

            <h1 className="text-4xl font-extrabold text-[#06A2DB]">Investigación sobre el TDAH</h1>

            <p className="text-lg text-[#D1ECF6] max-w-3xl">
            La investigación sobre el TDAH es un campo en constante evolución, con nuevos descubrimientos y avances en la comprensión de esta condición. A continuación, te presentamos algunos de los hallazgos más recientes y significativos.
            </p>

            {/* Imagen ilustrativa 1 */}
            <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
            <img
                src="investigation1.png"
                alt="Investigadores en un laboratorio"
                className="w-full h-auto object-cover"
            />
            </div>

            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left">
            <h2 className="text-2xl font-bold text-white mb-4">Hallazgos recientes</h2>
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>La investigación sugiere que el TDAH puede estar relacionado con alteraciones en la estructura y función del cerebro, particularmente en la corteza prefrontal y el sistema de recompensa.</li>
                <li>Se ha descubierto que la genética juega un papel importante en el desarrollo del TDAH, con varios genes que se han identificado como factores de riesgo.</li>
                <li>La investigación también ha demostrado que la exposición a ciertos factores ambientales, como la contaminación del aire y la exposición a pesticidas, puede aumentar el riesgo de desarrollar TDAH.</li>
                <li>Se ha encontrado que la terapia cognitivo-conductual y la medicación pueden ser efectivas para tratar el TDAH, pero que la combinación de ambas puede ser la más efectiva.</li>
            </ul>
            </div>

            {/* Imagen ilustrativa 2 */}
            <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
            <img
                src="investigation.png"
                alt="Investigadores analizando datos"
                className="w-full h-auto object-cover"
            />
            </div>

            <p className="text-[#D1ECF6] max-w-2xl text-base mt-4">
            La investigación sobre el TDAH es un campo en constante evolución, y es importante seguir investigando para entender mejor esta condición y desarrollar tratamientos más efectivos. <span className="font-semibold text-white">OrbotMD</span> se compromete a seguir apoyando la investigación y el desarrollo de nuevas terapias para el TDAH.
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

export default ResearchPage;
