import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function QuestionResolve() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate("/login");

                const response = await fetch("https://localhost:7087/api/QuestionFree", {
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
            alert("⚠️ Debes responder todas las preguntas antes de enviar.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        try {
            for (const [questionId, answer] of Object.entries(answers)) {
                const payload = {
                    answerFreeQuestionFreeId: parseInt(questionId),
                    answerFreeAnswer: answer,
                };

                await fetch("https://localhost:7087/api/AnswerFree/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
            }

            setIsModalOpen(true); // Mostrar modal
        } catch (error) {
            console.error("Error enviando la evaluación", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#01274C] p-6 text-white">
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

            {/* Modal final */}
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
                            {/* <button
                                onClick={() => navigate("/dashpatient")}
                                className="bg-[#50C878]/80 hover:bg-[#50C878] text-[#01274C] px-5 py-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105"
                            >
                                Regresar
                            </button> */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
