import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DiagnosticoInteligente = () => {
  const navigate = useNavigate();
  const [hasAnswered, setHasAnswered] = useState(null); // null: cargando, true/false después

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        //ENDPOINT
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/AnswerFree/my-answers`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.length >= 20) {
            setHasAnswered(true); // ya hizo la evaluación
          } else {
            setHasAnswered(false); // puede hacerla
          }
        } else {
          console.error("Error obteniendo datos de respuestas");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    };

    fetchAnswers();
  }, [navigate]);

  const handleStart = () => {
    navigate("/questionresolve");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/ruta-robot2.png')` }}
    >
      <div className="bg-black/50 backdrop-blur-md p-6 rounded-3xl shadow-2xl w-full max-w-lg text-center border border-white/20 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">
          Diagnóstico Inteligente
        </h2>
        <p className="text-gray-100 text-lg mb-6 drop-shadow-sm">
          Inteligencia artificial al servicio de la salud infantil.
        </p>

        {hasAnswered === null ? (
          <p className="text-white">Es necesario crear el perfil del paciente antes de iniciar la recolección de sus datos.</p>
        ) : hasAnswered ? (
          <div className="text-red-400 font-semibold text-center space-y-4">
            <p>Mil disculpas, solo puedes usar un paciente en la versión gratis.</p>
            <button
      onClick={() => navigate("/dashpatient")}
      className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
    >
      Regresar
    </button>
          </div>
        ) : (
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded-full hover:from-teal-500 hover:to-teal-700 transition duration-300 shadow-lg"
          >
            Empezar
          </button>
        )}
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

