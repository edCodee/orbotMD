import { CalendarCheck, ClipboardList, FileBarChart2, HeartPulse, ScrollText, UserCircle, Cpu, LogOut, Gamepad2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { confirmLogout } from '../utils/confirmLogout';



export default function PacienteDashboard() {

    //estados

    const [showModal, setShowModal] = useState(false);
    const [cargandoDiagnostico, setCargandoDiagnostico] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [perfil, setPerfil] = useState(null);
    const [diagnostico, setDiagnostico] = useState(null);
    const navigate = useNavigate();
    const [progreso, setProgreso] = useState(0);
    const [highlightDiag, setHighlightDiag] = useState(false);
    const [highlightGame, setHighlightGame] =useState(true);



    const iniciarDiagnosticoIA = async () => {
        const token = localStorage.getItem("token");

        try {
            setCargandoDiagnostico(true);
            setProgreso(0); // iniciar barra en 0

//ENDPOINT
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Diagnostics/predict-free`,
                {
                    method: "POST",
                    headers: {
                        Accept: "*/*",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                setCargandoDiagnostico(false);
                setShowModal(true);
                return;
            }

            // barra de progreso durante 10s
            let porcentaje = 0;
            const interval = setInterval(() => {
                porcentaje += 10; // cada segundo aumenta 10%
                setProgreso(porcentaje);
                if (porcentaje >= 100) {
                    clearInterval(interval);
                }
            }, 1000);

            await new Promise((resolve) => setTimeout(resolve, 10000));

            window.location.reload();
        } catch (error) {
            console.error("Error al lanzar diagnóstico:", error);
            setCargandoDiagnostico(false);
            setShowModal(true);
        }
    };


    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                //ENDPOINT
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/PatientProfileFree/my-profiles`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    console.error("Error en la petición:", response.status);
                    return;
                }

                const data = await response.json();
                if (data.length > 0) {
                    const paciente = data[0];
                    setPerfil({
                        nombre: paciente.patientProfileFreeFirstName + " " + paciente.patientProfileFreeLastName,
                        edad: calcularEdad(paciente.patientProfileFreeBirthDate),
                        escuela: "No registrada",
                        grado: "No registrado"
                    });
                } else {
                    setPerfil(undefined);
                }
            } catch (error) {
                console.error("Error al obtener perfil:", error);
            }
        };

        const fetchDiagnostico = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Diagnostics/diagnostics`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                if (!res.ok) {
                    console.error("Error al obtener diagnóstico:", res.status);
                    return;
                }

                const data = await res.json();
                if (data.length > 0) {
                    const diag = data[0];
                    setDiagnostico({
                        tipo: diag.diagnosticMlFreeRiskLevel,
                        recomendaciones: diag.diagnosticMlFreeRecommendations,
                        fecha: new Date(diag.diagnosticMlFreeCreatedAt).toLocaleDateString(),
                        urgente: diag.diagnosticMlFreeNeedUrgentPsychologist
                    });
                } else {
                    setDiagnostico(undefined);
                }

            } catch (error) {
                console.error("Error al obtener diagnóstico:", error);
            }
        };

        fetchPerfil();
        fetchDiagnostico();

        // 👈 NUEVA LÍNEA: Desactivar el highlight después de 6 segundos
        const gameTimeout = setTimeout(() => {
        setHighlightGame(false);
        }, 6000); 

        // 👈 NUEVA LÍNEA: Limpiar el timeout al desmontar el componente o si el efecto se vuelve a ejecutar
        return () => clearTimeout(gameTimeout); 

    }, [navigate]);

    function calcularEdad(fechaNacimiento) {
        const nacimiento = new Date(fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    function getColorClass(riesgo) {
        switch (riesgo?.toLowerCase()) {
            case "alto":
                return "text-red-400 font-bold text-2xl";
            case "medio":
                return "text-yellow-300 font-bold text-2xl";
            case "bajo":
                return "text-green-400 font-bold text-2xl";
            default:
                return "text-white";
        }
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#1a202c] text-white">
            {/* Hamburguesa */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-[#2d3748]">
                <div className="text-xl font-bold text-teal-400">Bienvenido</div>
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`fixed z-50 top-0 left-0 h-full w-64 bg-[#2d3748] p-6 space-y-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:block`}>
                <div className="text-2xl font-bold text-teal-400 mb-6 hidden lg:block">Bienvenido</div>
                <nav className="space-y-4">
                    <Link to="/dashpatient" className="flex items-center gap-3 text-teal-400">
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
                    <Link to="/gamemouse" className="flex items-center gap-3 hover:text-teal-400">
                        <Gamepad2 /> <span>Misión Queso</span>
                    </Link>
                    <Link
                        to="/login"
                        onClick={async (e) => {
                            e.preventDefault();
                            const confirmed = await confirmLogout();
                            if (confirmed) {
                                localStorage.removeItem('token');
                                navigate('/login', { replace: true });
                            }
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:text-teal-400 transition-all"
                    >
                        <LogOut /> <span>Salir</span>
                    </Link>

                    <Link
                    to="/initmachine"
                    className={`flex items-center gap-3 bg-emerald-500 text-white font-semibold px-4 py-2 rounded hover:bg-teal-600 transition ${
                        highlightDiag ? 'animate-pulse ring-4 ring-yellow-400 ring-opacity-50' : ''
                    }`}
                    >
                    <Cpu /> <span>Diagnóstico Inteligente</span>
                    </Link>

                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 lg:p-10 space-y-10">
                {/* Perfil */}

                                {/* NUEVA SECCIÓN: Misión Queso Destacada */}
                <section className="bg-gray-800 p-6 rounded-xl shadow border-l-4 border-amber-400">
                    <h2 className="text-xl font-bold text-teal-300 mb-4 flex items-center gap-2">
                        ¡Nueva Actualización! 🎮
                    </h2>
                    <p className="text-gray-300 mb-4">
                        ¡Diviértete y sigue tu progreso con nuestro nuevo juego!
                    </p> 
                    <Link
                        to="/gamemouse"
                        // Aplicamos el estilo de "palpitación" (animate-pulse) si highlightGame es true
                        className={`
                            inline-flex items-center gap-3 
                            bg-amber-500 text-gray-900 
                            font-extrabold px-6 py-3 
                            rounded-xl shadow-lg 
                            hover:bg-amber-400 transition-all 
                            transform hover:scale-105
                            ${highlightGame ? 'animate-pulse ring-4 ring-amber-300 ring-opacity-75' : ''}
                        `}
                    >
                        <Gamepad2 className="w-6 h-6" /> 
                        <span>Misión Queso: ¡Jugar Ahora!</span>
                    </Link>
                    </section>
                <section className="bg-gray-800 p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold text-teal-300 mb-4">Datos Personales del Paciente</h2>
                    {perfil === null && <p className="italic text-gray-400">Cargando datos del paciente...</p>}
                    {perfil === undefined && (
                        <div>
                            <p className="italic text-red-400 mb-2">⚠️ Antes de iniciar el diagnóstico, debe registrar el perfil del paciente. Solo se admiten niños entre 4 y 16 años.</p>
                            <Link
                                to="/createpatientprofile"
                                className="bg-teal-500 px-4 py-2 rounded font-semibold hover:bg-teal-600 transition"
                            >
                                Crear paciente
                            </Link>
                        </div>
                    )}
                    {perfil && (
                        <>
                            <p><span className="font-semibold">Nombre:</span> {perfil.nombre}</p>
                            <p><span className="font-semibold">Edad:</span> {perfil.edad}</p>
                            <p><span className="font-semibold">Escuela:</span> {perfil.escuela}</p>
                            <p><span className="font-semibold">Grado:</span> {perfil.grado}</p>
                        </>
                    )}
                </section>

{/* Diagnóstico */}
<section className="bg-gray-800 p-6 rounded-xl shadow">
    <h2 className="text-xl font-bold text-teal-300 mb-4">Diagnóstico</h2>

    {diagnostico === null && (
        <p className="italic text-gray-400">En espera del registro del paciente para continuar con el proceso.</p>
    )}

    {diagnostico === undefined && (
        <div>
            <p className="italic text-gray-400 mb-4">Aún no se ha realizado un diagnóstico.</p>
<Link
    onClick={iniciarDiagnosticoIA}
    className="bg-rose-500 px-4 py-2 rounded font-semibold text-white hover:bg-rose-600 transition cursor-pointer inline-block"
>
    Empezar diagnóstico de IA
</Link>

    {cargandoDiagnostico && (
    <div className="mt-4 w-full max-w-md mx-auto">
        <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progreso}%` }}
        ></div>
        </div>
        <p className="text-sm text-gray-300 mt-2 text-center">{progreso}% completado - analizando IA...</p>
    </div>
    )}


        </div>
    )}

    {diagnostico && (
        <>
            {diagnostico.urgente && (
                <div className="bg-red-600 text-white p-4 rounded-lg mb-4 flex items-center gap-3 shadow-lg animate-pulse">
                    <span className="text-2xl">⚠️</span>
                    <span className="font-semibold">Se recomienda atención psicológica urgente.</span>
                </div>
            )}
            <p className={getColorClass(diagnostico.tipo)}>Tipo: {diagnostico.tipo}</p>
            <p className="mt-2"><span className="font-semibold">Recomendaciones:</span> {diagnostico.recomendaciones}</p>
        </>
    )}
</section>


                {/* Historial de Sesiones */}
                <section className="bg-gray-800 p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold text-teal-300 mb-4">Historial de Sesiones</h2>
                    {diagnostico ? (
                        <ul className="space-y-3">
                            <li className="flex justify-between bg-gray-700 p-4 rounded-lg">
                                <div>
                                    <p className="font-semibold">{diagnostico.fecha}</p>
                                    <p className="text-sm text-gray-400">Evaluación realizada por sistema de IA</p>
                                </div>
                            </li>
                        </ul>
                    ) : (
                        <p className="italic text-gray-400">Sin registros disponibles.</p>
                    )}
                </section>



                {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01274C]/60 backdrop-blur-md">
                    <div
                    className="
                        relative 
                        bg-gradient-to-br 
                        from-[#009689]/80 
                        to-[#013C6A]/80 
                        rounded-3xl 
                        shadow-2xl 
                        p-8 
                        max-w-sm 
                        w-full 
                        text-center 
                        border 
                        border-[#01274C]/50 
                        backdrop-blur-xl 
                        animate-fadeIn
                    "
                    >
                    <h2 className="text-2xl font-semibold mb-4 text-[#FFCD3C]">⚠️ Atención</h2>
                    <p className="mb-6 text-sm leading-relaxed text-[#E0F2F1]">
                        Primero debes presionar el botón{" "}
                        <span className="font-semibold">“Diagnóstico Inteligente”</span> y
                        completar las 20 preguntas de la encuesta, si estas en un movil 
                        seleccion menu la parte superior derecha.   <span class="hamburger-icon">☰</span>
                    </p>
                    <div className="flex justify-center">
                        <button
                    onClick={() => {
                    setShowModal(false);
                    setHighlightDiag(true);
                    setMenuOpen(true); // <<< AQUI DESPLEGAMOS EL MENÚ EN MÓVIL
                    setTimeout(() => setHighlightDiag(false), 6000);
                    }}

                        className="
                            bg-[#FFCD3C]/80 
                            hover:bg-[#FFCD3C] 
                            text-[#01274C] 
                            px-5 
                            py-2.5 
                            rounded-full 
                            shadow-md 
                            backdrop-blur-sm 
                            transition-all 
                            duration-300 
                            hover:scale-105
                        "
                        >
                        Entendido
                        </button>
                    </div>
                    </div>
                </div>
                )}



            </main>
        </div>
    );
}
