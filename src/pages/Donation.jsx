import React from "react";
import { Link } from "react-router-dom";

const DonatePage = () => {
    return (
        <div className="min-h-screen bg-[#01274C] text-white px-4 py-10 flex flex-col items-center">
        <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-6">

            <h1 className="text-4xl font-extrabold text-[#06A2DB]">Donar ahora</h1>

            <p className="text-lg text-[#D1ECF6] max-w-3xl">
            ¡Gracias por considerar donar a nuestra causa! Cada dólar cuenta y nos ayuda a mejorar nuestra investigación y desarrollo de software para diagnosticar y tratar el TDAH en niños.
            </p>

            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left">
            <h2 className="text-2xl font-bold text-white mb-4">¿Por qué donar?</h2>
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>Ayuda a mejorar nuestra investigación y desarrollo de software para diagnosticar y tratar el TDAH en niños.</li>
                <li>Permite que nuestro equipo de desarrolladores continúe trabajando en mejorar nuestro software de machine learning para proporcionar diagnósticos más precisos.</li>
                <li>Ayuda a proporcionar recursos y apoyo a familias y niños que están afectados por el TDAH.</li>
            </ul>
            </div>

            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left mt-6">
            <h2 className="text-2xl font-bold text-white mb-4">Información de la cuenta bancaria</h2>
            <p className="text-lg text-[#D1ECF6] mb-4">
            Puedes donar a nuestra cuenta bancaria en el Banco Pichincha:
            </p>
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>Número de cuenta: 2212409849</li>
                <li>Propietario: CI: 1805244199</li>
            </ul>
            </div>

            <p className="text-lg text-[#D1ECF6] max-w-3xl mt-6">
            ¡Cada dólar cuenta! Puedes donar desde $1 y ayudar a nuestra causa.
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

export default DonatePage;
