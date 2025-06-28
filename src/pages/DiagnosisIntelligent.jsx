import { useEffect, useState } from "react";
import {
    CalendarCheck,
    ClipboardList,
    FileBarChart2,
    HeartPulse,
    ScrollText,
    UserCircle,
    Cpu,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PacienteDashboard() {
    const [pacientes, setPacientes] = useState([]);
    const [estadosML, setEstadosML] = useState({});

    useEffect(() => {
        fetch(`http://${window.location.hostname}:5010/Api/Machine`)
            .then((res) => res.json())
            .then((data) => {
                setPacientes(data);

                // Inicializar estados
                const estadoInicial = {};
                data.forEach((p) => {
                    estadoInicial[p.idPaciente] = {
                        loading: false,
                        progreso: 0,
                        diagnostico: "",
                        completado: false,
                    };
                });
                setEstadosML(estadoInicial);
            })
            .catch((err) => console.error("Error al obtener pacientes:", err));
    }, []);

    // Diagnósticos fijos asignados por idPaciente
    const diagnosticosPorPaciente = {
        1: "Diagnóstico: TDAH severo con impacto funcional. Requiere abordaje multidisciplinario urgente.",
        2: "Diagnóstico: TDAH leve con predominio inatento. Requiere seguimiento psicológico y adaptación escolar.",
        3: "Diagnóstico: Conducta disruptiva relacionada con ansiedad escolar. Evaluar contexto familiar y académico.",
        4: "Diagnóstico: Patrón compatible con dificultades de autorregulación emocional. Se sugiere terapia cognitivo-conductual.",
        5: "Diagnóstico: Trastorno de aprendizaje específico en lectura. Requiere intervención educativa especializada.",
        6: "Diagnóstico: Ansiedad generalizada con impacto moderado. Se recomienda terapia cognitiva y técnicas de relajación.",
        7: "Diagnóstico: Síntomas depresivos leves. Monitorear estado emocional y fomentar actividades placenteras.",
        8: "Diagnóstico: Déficit en habilidades sociales. Sugerir talleres grupales y entrenamiento en habilidades.",
        9: "Diagnóstico: TDAH combinado con comorbilidad ansiosa. Evaluar medicación y terapia combinada.",
        10: "Diagnóstico: Trastorno oposicionista desafiante. Requiere intervención conductual y apoyo familiar.",
        11: "Diagnóstico: Trastorno del espectro autista leve. Planificar apoyos en contexto escolar.",
        12: "Diagnóstico: Habilidades cognitivas promedio, pero dificultades ejecutivas. Implementar estrategias organizativas.",
        13: "Diagnóstico: Depresión moderada con riesgo social. Derivar a psiquiatría infantil para evaluación.",
        14: "Diagnóstico: Ansiedad por separación. Implementar programa gradual de exposición.",
        15: "Diagnóstico: Dificultades significativas en regulación de impulsos. Se sugiere entrenamiento conductual.",
        16: "Diagnóstico: Rendimiento académico bajo sin causa emocional aparente. Realizar evaluación psicopedagógica completa.",
        17: "Diagnóstico: Alteraciones del sueño vinculadas a ansiedad. Reforzar higiene del sueño.",
        18: "Diagnóstico: Trastorno adaptativo tras evento estresante. Indicar apoyo emocional y familiar.",
        19: "Diagnóstico: Perfil compatible con altas capacidades intelectuales. Sugerir enriquecimiento curricular.",
        20: "Diagnóstico: Fobia escolar en fase inicial. Implementar plan de reintegración progresiva.",
        21: "Diagnóstico: Síntomas obsesivo-compulsivos leves. Iniciar intervención cognitivo-conductual.",
        22: "Diagnóstico: Patrón de retraimiento social. Explorar posibles causas y diseñar intervención.",
        23: "Diagnóstico: Trastorno de la comunicación social pragmática. Requiere apoyo fonoaudiológico.",
        24: "Diagnóstico: Baja autoestima vinculada a fracaso escolar. Diseñar plan de refuerzo positivo.",
        25: "Diagnóstico: Síntomas compatibles con hipersensibilidad sensorial. Evaluar perfil sensorial completo.",
        26: "Diagnóstico: Trastorno por tics transitorios. Educación familiar y seguimiento clínico.",
        27: "Diagnóstico: Alteraciones emocionales asociadas a bullying. Activar red de apoyo escolar.",
        28: "Diagnóstico: Problemas conductuales en contexto familiar. Recomendado abordaje sistémico familiar.",
        29: "Diagnóstico: Dificultades significativas en motricidad fina. Sugerir terapia ocupacional especializada."
        // Agrega aquí más IDs y diagnósticos fijos según necesites
    };

    const iniciarMachineLearning = (idPaciente) => {
        const nuevosEstados = { ...estadosML };
        nuevosEstados[idPaciente] = {
            loading: true,
            progreso: 0,
            diagnostico: "",
            completado: false,
        };
        setEstadosML(nuevosEstados);

        const interval = setInterval(() => {
            setEstadosML((prev) => {
                const progresoActual = prev[idPaciente].progreso;
                if (progresoActual >= 100) {
                    clearInterval(interval);
                    const diagnosticoFijo =
                        diagnosticosPorPaciente[idPaciente] ||
                        "Diagnóstico: Evaluación indica síntomas subclínicos de TDAH. Revaluar en 6 meses.";

                    return {
                        ...prev,
                        [idPaciente]: {
                            loading: false,
                            progreso: 100,
                            diagnostico: diagnosticoFijo,
                            completado: true,
                        },
                    };
                }

                return {
                    ...prev,
                    [idPaciente]: {
                        ...prev[idPaciente],
                        progreso: progresoActual + 20,
                    },
                };
            });
        }, 1000); // Total 5 segundos
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#1a202c] text-white">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 bg-[#2d3748] p-6 space-y-6">
                <div className="text-2xl font-bold text-teal-400 mb-6">Bienvenido</div>
                <nav className="space-y-4">
                    <Link to="/dashpatient" className="flex items-center gap-3 hover:text-teal-400">
                        <UserCircle /> <span>Perfil</span>
                    </Link>
                    <Link to="/sessions" className="flex items-center gap-3 hover:text-teal-400">
                        <ClipboardList /> <span>Sesiones</span>
                    </Link>
                    <Link to="/diagnosis" className="flex items-center gap-3 hover:text-teal-400">
                        <ScrollText /> <span>Diagnóstico</span>
                    </Link>
                    <Link to="/progresspatient" className="flex items-center gap-3 hover:text-teal-400">
                        <FileBarChart2 /> <span>Progreso</span>
                    </Link>
                    <Link to="/recomendationspatient" className="flex items-center gap-3 hover:text-teal-400">
                        <HeartPulse /> <span>Recomendaciones</span>
                    </Link>
                    <Link to="/nextevaluationpatient" className="flex items-center gap-3 hover:text-teal-400">
                        <CalendarCheck /> <span>Próxima Evaluación</span>
                    </Link>
                    <Link
                        to="/diagnosisintelligent"
                        className="flex items-center gap-3 bg-teal-400 text-white font-semibold px-4 py-2 rounded"
                    >
                        <Cpu /> <span>Diagnóstico Inteligente</span>
                    </Link>
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 lg:p-10 space-y-10">
                {pacientes.map((p) => {
                    const estado = estadosML[p.idPaciente] || {
                        loading: false,
                        progreso: 0,
                        diagnostico: "",
                        completado: false,
                    };

                    return (
                        <section key={p.idPaciente} className="bg-gray-800 p-6 rounded-xl shadow space-y-4">
                            <h2 className="text-xl font-bold text-teal-300 mb-4">Información del Paciente</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><strong>Cédula:</strong> {p.cedula}</div>
                                <div><strong>Nombre:</strong> {p.nombre}</div>
                                <div><strong>Apellido:</strong> {p.apellido}</div>
                                <div><strong>Edad:</strong> {p.edad} años</div>
                                <div><strong>Género:</strong> {p.genero}</div>
                                <div><strong>Nivel Atención:</strong> {p.nivelAtencion}</div>
                                <div><strong>Nivel Hiperactividad:</strong> {p.nivelHiperactividad}</div>
                                <div><strong>Nivel Impulsividad:</strong> {p.nivelImpulsividad}</div>
                                <div><strong>Dificultad Académica:</strong> {p.dificultadAcademica ? "Sí" : "No"}</div>
                                <div><strong>Problemas de Conducta:</strong> {p.problemasConducta ? "Sí" : "No"}</div>
                                <div className="md:col-span-2"><strong>Observaciones:</strong> {p.observaciones}</div>
                            </div>

                            {/* Simulación ML */}
                            <div className="mt-6 space-y-4">
                                <button
                                    onClick={() => iniciarMachineLearning(p.idPaciente)}
                                    disabled={estado.loading || estado.completado}
                                    className={`px-4 py-2 rounded-lg transition ${
                                        estado.completado
                                            ? "bg-green-500 cursor-default"
                                            : estado.loading
                                            ? "bg-teal-500 hover:bg-teal-600"
                                            : "bg-teal-500 hover:bg-teal-600"
                                    }`}
                                >
                                    {estado.completado
                                        ? "Diagnóstico completado"
                                        : estado.loading
                                        ? "Procesando..."
                                        : "Empezar Machine Learning"}
                                </button>

                                {estado.loading && (
                                    <div className="w-full bg-gray-600 h-3 rounded">
                                        <div
                                            className="bg-teal-400 h-3 rounded transition-all duration-500"
                                            style={{ width: `${estado.progreso}%` }}
                                        ></div>
                                    </div>
                                )}

                                {estado.diagnostico && (
                                    <div className="bg-teal-700 p-4 rounded-lg text-sm">
                                        {estado.diagnostico}
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </main>
        </div>
    );
}
