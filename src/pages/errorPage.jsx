import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Disc() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#01274C] to-[#013C6A] overflow-hidden flex items-center justify-center p-10">
            {/* Robot flotando */}
            <motion.div
                className="absolute text-7xl"
                initial={{ x: '-100vw' }}
                animate={{ x: '100vw' }}
                transition={{ repeat: Infinity, repeatType: 'mirror', duration: 12, ease: 'linear' }}
                style={{ top: '20%', left: 0 }}
            >
                🤖
            </motion.div>

            <motion.div
                className="absolute text-5xl rotate-12"
                initial={{ y: '-20vh' }}
                animate={{ y: '100vh' }}
                transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
                style={{ right: '10%' }}
            >
                🤖
            </motion.div>

            {/* Contenido central */}
            <motion.div
                className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 max-w-3xl text-center shadow-2xl z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="text-6xl mb-4 animate-bounce">🤖</div>
                <h1 className="text-4xl sm:text-5xl font-bold text-[#50C878] mb-4">
                    ¡Estamos trabajando en esta sección!
                </h1>
                <p className="text-lg text-white/90 mb-6">
                    Estamos desarrollando una inteligencia artificial médica para la detección temprana del TDAH en niños. 
                    Esta sección estará disponible muy pronto. ¡Gracias por tu paciencia!
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-[#50C878] to-[#009689] text-white px-8 py-3 rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
                >
                    Volver al inicio
                </button>
            </motion.div>

            {/* Efectos visuales de fondo */}
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#50C878]/20 rounded-full blur-3xl animate-spin-slow" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#009689]/30 rounded-full blur-3xl animate-spin-slower" />
        </div>
    );
}
