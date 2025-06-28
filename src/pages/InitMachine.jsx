import React from "react";
import { useNavigate } from "react-router-dom";

const DiagnosticoInteligente = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/diagnosisintelligent"); // Cambia esta ruta según sea necesario
    };

    return (
        <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: `url('/ruta-robot2.png')` }}
    >
    <div className="bg-black/50 backdrop-blur-md p-1 rounded-3xl shadow-2xl w-full max-w-lg text-center border border-white/20 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-white mb-1 drop-shadow-lg">
        Diagnóstico Inteligente
        </h2>
        <p className="text-gray-100 text-lg mb-6 drop-shadow-sm">
        Inteligencia artificial al servicio de la salud infantil.
        </p>
        <button
        onClick={handleStart}
        className="px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded-full hover:from-teal-500 hover:to-teal-700 transition duration-300 shadow-lg"
        >
        Empezar
        </button>
    </div>
</div>

    );
};

export default DiagnosticoInteligente;

{/* <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center"
  style={{ backgroundImage: `url('/ruta-robot2.png')` }}
>
  <div className="bg-black/50 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center border border-white/20 animate-fade-in">
    <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg">
      Diagnóstico Inteligente
    </h2>
    <p className="text-gray-100 text-lg mb-6 drop-shadow-sm">
      Inteligencia artificial al servicio de la salud infantil.
    </p>
    <button
      onClick={handleStart}
      className="px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded-full hover:from-teal-500 hover:to-teal-700 transition duration-300 shadow-lg"
    >
      Empezar
    </button>
  </div>
</div> */}

