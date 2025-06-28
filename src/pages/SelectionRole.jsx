import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, User, Stethoscope, Users } from "lucide-react";

const iconMap = {
    administrador: <UserCog className="w-5 h-5 mr-2" />,
    paciente: <User className="w-5 h-5 mr-2" />,
    psicólogo: <Stethoscope className="w-5 h-5 mr-2" />,
    default: <Users className="w-5 h-5 mr-2" />
};

const SelectRole = () => {
    const navigate = useNavigate();
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");

    const handleSelect = (roleName) => {
        const name = roleName.toLowerCase();
        if (name === "administrador") {
            navigate("/dashadministrator");
        } else if (name === "paciente") {
            navigate("/dashpatient");
        } else if (name === "psicólogo") {
            navigate("/dashdoctor");
        } else {
            navigate(`/dashboard/${name}`);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url('/ruta-imagenhospital5.png')` }}
        >
            <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-white/30">
                <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-md">Selecciona tu rol</h2>
                <div className="flex flex-col gap-4">
                    {roles.map((role, index) => {
                        const icon = iconMap[role.roleName.toLowerCase()] || iconMap.default;
                        return (
                            <button
                                key={index}
                                onClick={() => handleSelect(role.roleName)}
                                className="flex items-center justify-center px-4 py-3 bg-white/70 text-gray-800 font-medium rounded-xl hover:bg-white transition backdrop-blur-md shadow-lg"

                            >
                                {icon}
                                {role.roleName}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SelectRole;
