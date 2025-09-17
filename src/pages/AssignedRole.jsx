import React, { useEffect, useState } from "react";

const AssignRoles = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);
// https://localhost:7087/api/User
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/User`);
            if (!response.ok) throw new Error("Error al obtener usuarios");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        }
    };
// https://localhost:7087/api/User/roles
    const fetchRoles = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/User/roles`);
            if (!response.ok) throw new Error("Error al obtener roles");
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error("Error cargando roles:", error);
        }
    };

    const handleChange = (userId, roleId) => {
        setSelectedRoles(prev => ({
            ...prev,
            [userId]: roleId
        }));
    };

    const handleAssign = async (userId) => {
        const selectedRoleId = selectedRoles[userId];

        if (!selectedRoleId) {
            return setMessage("Selecciona un rol antes de asignar.");
        }

        const user = users.find(u => u.userSerial === userId);
        const alreadyAssigned = user.roles?.some(role => role.roleSerial === selectedRoleId);

        if (alreadyAssigned) {
            return setMessage("Ese rol ya está asignado a este usuario.");
        }

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/UserRole`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userRoleUserSerial: userId,
                    userRoleRoleSerial: selectedRoleId,
                    userRolesAssinedAt: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error("Error al asignar rol");

            setMessage("Rol asignado correctamente.");
            await fetchUsers(); // Refrescar usuarios

        } catch (error) {
            console.error("Error al asignar rol:", error);
            setMessage("Error al asignar rol.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Asignar Roles a Usuarios</h2>

            {message && (
                <div className="mb-4 text-center text-sm text-blue-600 font-semibold">
                    {message}
                </div>
            )}

            <div className="space-y-6 max-w-4xl mx-auto">
                {users.map(user => (
                    <div key={user.userSerial} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded shadow gap-4">
                        <div className="text-left text-sm space-y-1">
                            <div><strong>Nombre:</strong> {`${user.userFirstName} ${user.userMiddleName} ${user.userLastName} ${user.userSecondLastName}`}</div>
                            <div><strong>Cédula:</strong> {user.userId}</div>
                            <div><strong>Usuario:</strong> {user.userUsername}</div>
                            <div><strong>Email:</strong> {user.userEmail}</div>
                            <div><strong>F. Nacimiento:</strong> {new Date(user.userBirthDate).toLocaleDateString("es-EC")}</div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <select
                                value={selectedRoles[user.userSerial] || ""}
                                onChange={(e) => handleChange(user.userSerial, parseInt(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-1 w-full sm:w-auto"
                            >
                                <option value="">Selecciona un rol</option>
                                {roles.map(role => (
                                    <option key={role.roleSerial} value={role.roleSerial}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => handleAssign(user.userSerial)}
                                disabled={loading}
                                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition w-full sm:w-auto"
                            >
                                Asignar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignRoles;
