// PASO 1: Instala la librería si no la tienes
// npm install react-circular-progressbar

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

export default function QuestionResolve() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // NUEVO: Para mostrar progreso
    const navigate = useNavigate();
    const [showIntroModal, setShowIntroModal] = useState(true);
    const [showIncompleteModal, setShowIncompleteModal] = useState(false);


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate("/login");

                const response = await fetch("https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/QuestionFree", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data);
                } else {
                    console.error("Error cargando preguntas");
                }
            } catch (error) {
                console.error("Error en la petición:", error);
            }
        };
        fetchQuestions();
    }, [navigate]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length !== questions.length) {
            setShowIncompleteModal(true);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        try {
            setIsSubmitting(true); // Mostrar progreso

            for (const [questionId, answer] of Object.entries(answers)) {
                const payload = {
                    answerFreeQuestionFreeId: parseInt(questionId),
                    answerFreeAnswer: answer,
                };

                await fetch("https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/AnswerFree/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
            }

            setIsSubmitting(false); // Ocultar progreso
            setIsModalOpen(true); // Mostrar modal final
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error enviando la evaluación", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#01274C] p-6 text-white relative">
            <div className="max-w-4xl mx-auto bg-[#015B97] p-8 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center text-white mb-6">
                    Evaluación de Uso de Pantallas
                </h1>

                {questions.length === 0 && (
                    <p className="text-center text-gray-300">Cargando preguntas...</p>
                )}

                {questions.map((q, index) => (
                    <div key={q.questionFreeId} className="bg-[#01274C] p-4 rounded-xl shadow mb-6">
                        <p className="font-semibold mb-2">{q.questionFreeText}</p>

                        {index < 10 && (
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={answers[q.questionFreeId] === "Yes"}
                                        onChange={() => handleAnswerChange(q.questionFreeId, "Yes")}
                                    />
                                    Sí
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={answers[q.questionFreeId] === "No"}
                                        onChange={() => handleAnswerChange(q.questionFreeId, "No")}
                                    />
                                    No
                                </label>
                            </div>
                        )}

                        {index >= 10 && index < 20 && (
                            <>
                                <p className="text-xs text-gray-300 mb-2">
                                    1 = Nada &nbsp;&nbsp; 2 = Poco &nbsp;&nbsp; 3 = Moderado &nbsp;&nbsp; 4 = Mucho &nbsp;&nbsp; 5 = Totalmente
                                </p>
                                <div className="flex gap-4 flex-wrap">
                                    {[1, 2, 3, 4, 5].map((valor) => (
                                        <label key={valor} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={answers[q.questionFreeId] === valor.toString()}
                                                onChange={() => handleAnswerChange(q.questionFreeId, valor.toString())}
                                            />
                                            {valor}
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-[#06A2DB] text-white rounded-xl font-semibold hover:bg-[#0191c4] transition mt-4 shadow-lg"
                >
                    Enviar Evaluación
                </button>
            </div>

            {/* MODAL DE CARGA */}
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#01274C]/70 backdrop-blur-sm">
                    <div className="w-24 h-24">
                        <CircularProgressbar
                            value={100}
                            text={`...`}
                            styles={buildStyles({
                                textSize: "24px",
                                pathColor: "#50C878",
                                textColor: "#50C878",
                                trailColor: "#01446c",
                            })}
                        />
                    </div>
                    <p className="mt-6 text-white font-medium">Enviando respuestas...</p>
                </div>
            )}

            {/* MODAL INICIO */}
            {showIntroModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01274C]/60 backdrop-blur-md">
                    <div className="relative bg-gradient-to-br from-[#009689]/80 to-[#013C6A]/80 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-[#01274C]/50 animate-fadeIn">
                        <h2 className="text-2xl font-semibold mb-4 text-[#50C878]">📝 Instrucciones</h2>
                        <p className="mb-4 text-sm leading-relaxed text-[#E0F2F1]">
                            Responda todas las preguntas con atención. Encontrará preguntas de <strong>Sí o No</strong> y otras con una escala del <strong>1 al 5</strong>:<br />
                            <strong>1</strong> = Nada &middot; <strong>2</strong> = Poco &middot; <strong>3</strong> = Moderado &middot; <strong>4</strong> = Mucho &middot; <strong>5</strong> = Totalmente
                        </p>
                        <p className="mb-6 text-sm leading-relaxed text-[#E0F2F1]">
                            Asegúrese de completar todas antes de enviar la evaluación.
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowIntroModal(false)}
                                className="bg-[#50C878]/80 hover:bg-[#50C878] text-[#01274C] px-5 py-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {showIncompleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01274C]/60 backdrop-blur-md">
                    <div className="relative bg-gradient-to-br from-[#FF6B6B]/90 to-[#FF8E53]/90 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-red-200/50 animate-fadeIn">
                        <h2 className="text-2xl font-semibold mb-4 text-white">¡Faltan respuestas!</h2>
                        <p className="mb-6 text-sm leading-relaxed text-white/90">
                            Debes responder <strong>todas las preguntas</strong> antes de enviar la evaluación.
                        </p>

                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowIncompleteModal(false)}
                                className="bg-white text-[#FF6B6B] px-5 py-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* MODAL FINAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01274C]/60 backdrop-blur-md">
                    <div className="relative bg-gradient-to-br from-[#009689]/80 to-[#013C6A]/80 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-[#01274C]/50 animate-fadeIn">
                        <h2 className="text-2xl font-semibold mb-4 text-[#50C878]">¡Evaluación completada!</h2>
                        <p className="mb-6 text-sm leading-relaxed text-[#E0F2F1]">
                            Gracias por completar la evaluación. Ahora puedes iniciar tu diagnóstico con IA.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/dashpatient"
                                className="bg-[#50C878]/80 hover:bg-[#50C878] text-[#01274C] px-5 py-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105"
                            >
                                Empezar Diagnóstico IA 🚀
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
