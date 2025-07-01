import { CalendarCheck, ClipboardList, FileBarChart2, HeartPulse, ScrollText, UserCircle, Cpu, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { confirmLogout } from '../utils/confirmLogout';

export default function PacienteDashboard() {

    const iniciarDiagnosticoIA = async () => {
    const token = localStorage.getItem("token");

    try {
        setCargandoDiagnostico(true);
// https://localhost:7087/api/Diagnostics/predict-free
        const res = await fetch("https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/Diagnostics/predict-free", {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!res.ok) {
            // error esperado: aún no responde encuesta
            setCargandoDiagnostico(false);
            setShowModal(true);
            return;
        }

        // Esperar 10s para simular análisis con barra
        await new Promise((resolve) => setTimeout(resolve, 10000));
        window.location.reload(); // recarga para ver diagnóstico actualizado

    } catch (error) {
        console.error("Error al lanzar diagnóstico:", error);
        setCargandoDiagnostico(false);
        setShowModal(true);
    }
};


    const [showModal, setShowModal] = useState(false);
const [cargandoDiagnostico, setCargandoDiagnostico] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const [perfil, setPerfil] = useState(null);
    const [diagnostico, setDiagnostico] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
// https://localhost:7087/api/PatientProfileFree/my-profiles
                const response = await fetch("https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/PatientProfileFree/my-profiles", {
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

        const iniciarDiagnosticoIA = async () => {
    const token = localStorage.getItem("token");

    try {
        setCargandoDiagnostico(true);
// https://localhost:7087/api/Diagnostics/predict-free
        const res = await fetch("https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/Diagnostics/predict-free", {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!res.ok) {
            // error esperado: aún no responde encuesta
            setCargandoDiagnostico(false);
            setShowModal(true);
            return;
        }

        // Esperar 10s para simular análisis con barra
        await new Promise((resolve) => setTimeout(resolve, 10000));
        window.location.reload(); // recarga para ver diagnóstico actualizado

    } catch (error) {
        console.error("Error al lanzar diagnóstico:", error);
        setCargandoDiagnostico(false);
        setShowModal(true);
    }
};


        const fetchDiagnostico = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/Diagnostics/diagnostics", {
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
                    setDiagnostico(undefined); // sin diagnóstico
                }

            } catch (error) {
                console.error("Error al obtener diagnóstico:", error);
            }
        };

        fetchPerfil();
        fetchDiagnostico();
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
                        className="flex items-center gap-3 bg-emerald-500 text-white font-semibold px-4 py-2 rounded hover:bg-teal-600 transition"
                    >
                        <Cpu /> <span>Diagnóstico Inteligente</span>
                    </Link>
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 lg:p-10 space-y-10">
                {/* Perfil */}
                <section className="bg-gray-800 p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold text-teal-300 mb-4">Datos Personales</h2>
                    {perfil === null && <p className="italic text-gray-400">Cargando datos del paciente...</p>}
                    {perfil === undefined && (
                        <div>
                            <p className="italic text-red-400 mb-2">No tiene un perfil creado, antes de hacer cualquier interacción cree el perfil del paciente.</p>
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
        <p className="italic text-gray-400">Cargando diagnóstico...</p>
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
    <div className="mt-4 w-full bg-gray-700 rounded-full h-4">
        <div
            className="bg-emerald-400 h-4 rounded-full animate-pulse"
            style={{ width: '100%', transition: 'width 10s linear' }}
        ></div>
        <p className="text-sm text-gray-300 mt-1">Analizando con IA... Por favor espera.</p>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-md text-center text-black">
            <h3 className="text-lg font-bold mb-4">⚠️ Atención</h3>
            <p className="mb-4">Primero debes presionar el botón <span className="font-semibold">“Diagnóstico Inteligente”</span> y completar las 20 preguntas de la encuesta.</p>
            <button
                onClick={() => setShowModal(false)}
                className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition"
            >
                Entendido
            </button>
        </div>
    </div>
)}


            </main>
        </div>
    );
}
