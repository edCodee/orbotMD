// src/utils/confirmLogout.js
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export async function confirmLogout() {
    const result = await MySwal.fire({
        title: '<p class="text-lg text-[#50C878] font-bold">¿Cerrar sesión?</p>',
        html: '<p class="text-sm text-[#E0F2F1]">Tu sesión se cerrará y deberás volver a iniciar</p>',
        icon: 'warning',
        background: 'linear-gradient(to bottom right, #01274C, #015B97)',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-3xl shadow-2xl border border-[#06A2DB]/30',
            confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600',
            cancelButton: 'bg-[#50C878] text-[#01274C] px-4 py-2 rounded-lg shadow-md hover:bg-[#44B26C]',
        },
        buttonsStyling: false,
    });

    return result.isConfirmed;
}
