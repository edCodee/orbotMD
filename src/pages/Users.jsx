import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
// https://localhost:7087/api/User
    useEffect(() => {
        fetch(`https://apidocbot20250701094126-ccgqenfaese6g5gh.canadacentral-01.azurewebsites.net/api/User`, {
        headers: {
            Accept: "text/plain",
        },
        })
        .then((res) => {
            if (!res.ok) throw new Error("Error al obtener los usuarios");
            return res.json();
        })
        .then((data) => {
            setUsuarios(data);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 mb-6">
            Gestión de Usuarios
        </h1>

        <div className="flex justify-between items-center mb-6">
            <Link
            to="/createuser"
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-lg shadow-md"
            >
            ➕ Crear nuevo usuario
            </Link>
        </div>

        {loading && <p className="text-gray-500">Cargando usuarios...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && usuarios.length === 0 && (
            <p className="text-gray-500">No hay usuarios registrados.</p>
        )}

        {!loading && usuarios.length > 0 && (
            <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                <thead className="bg-teal-100 text-teal-800">
                <tr>
                    <th className="p-3 text-left">Nombre completo</th>
                    <th className="p-3 text-left">Cédula</th>
                    <th className="p-3 text-left">Usuario</th>
                    <th className="p-3 text-left">Correo</th>
                    <th className="p-3 text-left">Fecha nacimiento</th>
                    <th className="p-3 text-left">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {usuarios.map((u) => (
                    <tr key={u.userSerial} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{`${u.userFirstName} ${u.userMiddleName} ${u.userLastName} ${u.userSecondLastName}`}</td>
                    <td className="p-3">{u.userId}</td>
                    <td className="p-3">{u.userUsername}</td>
                    <td className="p-3">{u.userEmail}</td>
                    <td className="p-3">
                        {new Date(u.userBirthDate).toLocaleDateString("es-EC")}
                    </td>
                    <td className="p-3 space-x-2">
                        <Link
                        to={`/usuarios/editar/${u.userSerial}`}
                        className="text-blue-600 hover:underline font-medium"
                        >
                        Editar
                        </Link>
                        <button
                        className="text-red-600 hover:underline font-medium"
                        onClick={() => alert("Aquí iría la lógica para eliminar")}
                        >
                        Eliminar
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
}
