import { useEffect, useState } from "react";

export default function DashDoctorMechanicalArm() {
    const [indicators, setIndicators] = useState([]);
    const [scores, setScores] = useState({});
    const [observations, setObservations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIndicators = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/IndicatorCatalog`,
                    { headers: { accept: "text/plain" } }
                );
                const data = await response.json();
                setIndicators(data);
            } catch (error) {
                console.error("Error al cargar indicadores:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIndicators();
    }, []);

    const handleSliderChange = (id, value) => {
        setScores((prev) => ({ ...prev, [id]: value }));
    };

    const handleObservationChange = (id, value) => {
        setObservations((prev) => ({ ...prev, [id]: value }));
    };

    if (loading) return <p className="text-gray-400 text-center mt-10">Cargando indicadores...</p>;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#1a202c] text-white">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#2d3748] p-6 space-y-6 md:min-h-screen">
                <div className="text-2xl font-bold text-teal-400 mb-6 text-center md:text-left">
                    Panel Psicólogo
                </div>
                <nav className="space-y-4">
                    <p className="text-gray-400">⚙ Evaluación Brazo Mecánico</p>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-8 overflow-auto">
                <h1 className="text-3xl font-bold text-teal-300 mb-8 text-center md:text-left">
                    Evaluación: Brazo Mecánico
                </h1>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-2xl shadow-lg bg-[#2d3748]">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-[#1a202c] text-gray-300">
                            <tr>
                                <th className="px-6 py-3 text-left">Dimensión evaluada</th>
                                <th className="px-6 py-3 text-left">Descripción observable</th>
                                <th className="px-6 py-3 text-center">Escala (1–5)</th>
                                <th className="px-6 py-3 text-left">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {indicators.map((indicator) => (
                                <tr
                                    key={indicator.indicatorCatalogId}
                                    className="border-b border-gray-700 hover:bg-[#1f2733] transition"
                                >
                                    {/* Dimensión */}
                                    <td className="px-6 py-4 font-medium text-teal-400">
                                        {indicator.indicatorCatalogName}
                                    </td>

                                    {/* Descripción */}
                                    <td className="px-6 py-4 text-gray-300">
                                        {indicator.indicatorCatalogDescription}
                                    </td>

                                    {/* Slider */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                value={scores[indicator.indicatorCatalogId] || 3}
                                                onChange={(e) =>
                                                    handleSliderChange(
                                                        indicator.indicatorCatalogId,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-32 accent-teal-400 cursor-pointer"
                                            />
                                            <span className="text-sm mt-1 text-teal-300 font-semibold">
                                                {scores[indicator.indicatorCatalogId] || 3}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Observaciones */}
                                    <td className="px-6 py-4">
                                        <textarea
                                            placeholder="Escribir observaciones..."
                                            className="w-full p-2 rounded-xl bg-[#1a202c] border border-gray-600 focus:ring-2 focus:ring-teal-400 outline-none resize-none text-sm text-white placeholder-gray-500"
                                            rows="2"
                                            value={observations[indicator.indicatorCatalogId] || ""}
                                            onChange={(e) =>
                                                handleObservationChange(
                                                    indicator.indicatorCatalogId,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Botón de Guardar */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => console.log({ scores, observations })}
                        className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl shadow-lg transition-all"
                    >
                        Guardar Evaluación
                    </button>
                </div>
            </main>
        </div>
    );
}
