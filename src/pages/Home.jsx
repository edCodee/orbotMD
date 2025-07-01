import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { CalendarDays, Facebook, Heart, Instagram, Phone} from 'lucide-react';
import { Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import logo1 from '../assets/images/logodocbot.png';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion';
import { FaHeart, FaYoutubeSquare } from 'react-icons/fa';

const Slideshow = () => {
        const images = [
        "/ruta-imagen4.png",
        "/ruta-imagen2.png",
        "/ruta-imagen3.png",
        "/ruta-imagen1.png",
        ];
    
        const [currentIndex, setCurrentIndex] = useState(0);
    
        useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
        }, []);
    
        return (
        <div className="rounded-xl shadow-2xl w-full h-[400px] overflow-hidden transition-all duration-500 ease-in-out">
            <img
            src={images[currentIndex]}
            alt={`Imagen ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            />
        </div>
        );
};

const navigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'Síntomas comunes', href: '/symptons', current: false },
    { name: 'Detección temprana', href: '/earlydetection', current: false },
    { name: 'Recomendaciones', href: '/recomendations', current: false },
    { name: 'Investigación', href: '/investigation', current: false },
    { name: 'Guía para Padres', href: 'guideparents', current: false },
    { name: 'Servicios', href: '/services', current: false }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
        const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
        <div className="min-h-full">
            <div className="bg-white py-4 px-4 flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-4 text-center md:text-left">
            {/* IZQUIERDA: Redes sociales */}
            <div className="flex items-center justify-center gap-4">
                <a
                href="/errorpage"
                target="_blank"
                rel="noopener noreferrer"
                >
                <Facebook className="w-6 h-6 text-black hover:text-gray-300 transition-colors" />
                </a>
                <a
                href="/errorpage"
                target="_blank"
                rel="noopener noreferrer"
                >
                <Instagram className="w-6 h-6 text-black hover:text-gray-300 transition-colors" />
                </a>
                <a
                href="/errorpage"
                target="_blank"
                rel="noopener noreferrer"
                >
                <FaYoutubeSquare className="w-6 h-6 text-black hover:text-gray-300 transition-colors" />
                </a>
            </div>

            {/* CENTRO: Teléfonos */}
            <div className="flex items-center justify-center gap-2 text-black text-sm">
                <Phone className="w-5 h-5" />
                <span>(+593) 98-354-03121  -  (+593) 98-487-4529</span>
            </div>

            {/* DERECHA: Enlace para donar */}
            <div className="flex items-center justify-center gap-4 text-black text-sm">
                <Link
                to="/donation"
                className="flex items-center gap-2 bg-[#00a8ff] hover:bg-[#4cd137] transition-colors text-white font-semibold py-2 px-4 rounded"
                >
                <FaHeart className="w-4 h-4 text-white" />
                Dona ahora
                </Link>
            </div>

</div>


            <Disclosure
    as="nav"
    className="sticky top-0 z-50 shadow-xl backdrop-blur-md bg-opacity-90 transition duration-300"
>
    {({ open }) => (
        <>
        {/*FONDO VISUAL DENTRO DEL FLUJO */}
        <div className="relative h-20 w-full overflow-hidden bg-[#01274C]">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            {/* elementos visuales con colores y formas */}
            <div className="absolute top-[-120px] left-20 w-025 h-10 border-l-[1px] border-r-[110px] border-b-[350px] border-l-transparent border-r-transparent border-b-[#015B97] rotate-100"></div>
            <div className="absolute top-[-120px] left-80 w-[500px] h-[200px] bg-[#015B97]"></div>                
            <div className="absolute top-[-140px] left-[285px] w-[150px] h-[150px] bg-[#06A2DB] rotate-160"></div>
            <div className="absolute top-[-170px] left-204 w-0 h-0 border-l-[75px] border-r-[180px] border-b-[200px] border-l-transparent border-r-transparent border-b-[#06A2DB]"></div>

            <div className="absolute top-[5px] rotate-170 left-269 w-0 h-0 border-l-[130px] border-r-[130px] border-b-[100px] border-l-transparent border-r-transparent border-b-[#015B97]"></div>

            <div className="absolute top-[-40px] left-300 w-025 h-10 border-l-[150px] border-r-[150px] border-b-[100px] border-l-transparent border-r-transparent border-b-[#06A2DB] rotate-350"></div>


            <div className="absolute top-[30px] left-232 w-0 h-0 border-l-[140px] border-r-[140px] border-b-[50px] border-l-transparent border-r-transparent border-b-[#06A2DB]"></div>
            <div className="absolute top-[50px] left-[285px] w-[150px] h-[150px] bg-[#06A2DB] rotate-200"></div>
                <div className="absolute top-[-140px] left-[700px] w-[150px] h-[150px] bg-[#01274C] rotate-200"></div>
                <div className="absolute top-[50px] left-[700px] w-[150px] h-[150px] bg-[#01274C] rotate-160 z-[999]"></div>
                {/* <div className="absolute top-[-120px] left-295 w-025 h-10 border-l-[1px] border-r-[110px] border-b-[350px] border-l-transparent border-r-transparent border-b-red rotate-100 z-[999]"></div> */}
                {/* <div className="absolute top-[40px] left-[830px] w-[300px] h-[300px] bg-[#0A3D62] rotate-160 "></div> */}
            </div>

            {/* CONTENIDO NAVBAR ENCIMA DEL FONDO */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* LOGO */}
            <div className="flex items-center">
                <img src={logo1} alt="UTA Logo" className="h-21 w-auto" />
            </div>

            {/* ENLACES EN ESCRITORIO */}
            <div className="hidden md:flex md:items-center md:space-x-6">
                {navigation.map((item) => (

                <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white hover:bg-[#06A2DB] px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                    {item.name}
                </a>
                ))}
                {/* BOTÓN AGENDAR CITA */}
        <button
            onClick={handleCardClick}
            className="bg-red-800 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-200"
        >
            Agendar cita
        </button>

            </div>

            {/* BOTÓN HAMBURGUESA */}
            <div className="flex md:hidden">
                <Disclosure.Button className="text-gray-300 hover:text-white focus:outline-none">
                {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                ) : (
                    <Bars3Icon className="block h-6 w-6" />
                )}
                </Disclosure.Button>
            </div>
            </div>

{isModalOpen && (
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
        <h2 className="text-2xl font-semibold mb-4 text-[#50C878]">
            ¡Atención!
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-[#E0F2F1]">
            Para poder Agendar una cita o realizar una prueba rapida de TDAH necesitas registrarte o iniciar sesión.
        </p>

        <div className="flex justify-center gap-4">
            <Link
            to="/createuser"
            className="
                bg-[#50C878]/80 
                hover:bg-[#50C878] 
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
            Ir
            </Link>
            <button
            onClick={handleCloseModal}
            className="
                bg-[#01274C]/80 
                hover:bg-[#01274C] 
                text-white 
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
            Atrás
            </button>
        </div>

        <button
            onClick={handleCloseModal}
            className="
            absolute 
            top-4 
            right-4 
            text-[#50C878] 
            hover:text-white 
            transition-transform 
            duration-200 
            transform 
            hover:scale-125
            "
        >
            &#10005;
        </button>
        </div>
    </div>
)}

            
        </div>

        {/* 📱 MENÚ MÓVIL */}
        <Disclosure.Panel className="md:hidden bg-[#14304E] border-t border-gray-600 relative z-10">
            <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
                <Disclosure.Button
                key={item.name}
                as="a"
                href={item.href}
                className="block text-gray-300 hover:text-white hover:bg-[#1E4D6B] px-3 py-2 rounded-md text-base font-medium"
                >
                {item.name}
                </Disclosure.Button>
            ))}
            </div>
            <Link
            to="/login"
            className="block text-white bg-red-800 hover:bg-[#C70039] px-3 py-2 rounded-md text-base font-semibold text-center transition duration-200"
            >
            Agendar cita
</Link>

        </Disclosure.Panel>
        </>
    )}
</Disclosure>

            <header className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-50">
        <div className="flex justify-between items-center h-9">
        
        {/* Logo / Nombre del hospital */}
        <div className="flex-shrink-0 text-black items-center font-bold text-2xl">
            ORBOT MD
        </div>
        </div>
    </div>
    </header>
    <main>
    <section className="bg-[#01274C] py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">
        
        {/* Slideshow - sin animación específica por ahora */}
        <div className='md:w-1/2'>
        <Slideshow />
        </div>

        {/* Contenido animado */}
        <div className='md:w-1/2 text-center md:text-left'>

        {/* Título - de arriba hacia su posición */}
        <motion.h2
            className='text-4xl font-bold text-white mb-4'
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            Descubre, entiende y potencia las capacidades de los niños con TDA.
        </motion.h2>

        {/* Descripción - de derecha hacia su posición */}
        <motion.p
            className='text-lg text-white mb-6'
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
        >
            Orbot MD transforma la educación y el desarrollo cognitivo con herramientas interactivas diseñadas para niños con TDAH. 
            ¡Haz que el aprendizaje sea una experiencia única!
        </motion.p>

        {/* Botones - desde abajo hacia su lugar */}
        <motion.div
            className='flex justify-center md:justify-start gap-4'
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >

<Link
    to="/login"
    className="flex items-center bg-white hover:bg-blue-600 text-black hover:text-white font-semibold px-5 py-3 rounded-lg shadow-md transition duration-300"
>
    {/* Icono de Usuario */}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z"
        />
    </svg>
    Iniciar sesión
</Link>

<button
        onClick={handleCardClick}
        className="flex items-center bg-emerald-500 hover:bg-teal-600 text-white font-semibold px-5 py-3 rounded-lg shadow-md transition duration-300"
        >
            {/* Ícono de IA */}
            <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
            />
            </svg>
            Prueba rápida de TDAH
        </button>



        </motion.div>
                </div>
                </div>
            </section>

            {/* section Informativa*/}
<section className="bg-white text-black py-16 px-6">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Texto descriptivo */}
        <div>
        <h2 className="text-4xl font-bold mb-6">Orbot MD: Innovación y Tecnología para un Futuro Brillante</h2>
        <p className="mb-4 text-lg">
            Fundado el 22 de mayo de 2025, Orbot MD nació con una visión clara: aprovechar la tecnología para 
            mejorar la evaluación y el desarrollo de niños con TDAH. A través de un enfoque disruptivo, combinamos robótica interactiva,
            machine learning y herramientas educativas inteligentes para transformar el proceso de diagnóstico y aprendizaje 
            en una experiencia atractiva y significativa.
        </p>

        <p className="mb-4 text-lg">
            <strong>Evaluación Inteligente</strong>: Utilizamos algoritmos de aprendizaje automático para analizar patrones de comportamiento y detectar señales tempranas de TDAH con mayor precisión.
        </p>

        <p className="mb-4 text-lg">
            <strong>Robots educativos</strong>: Creamos soluciones interactivas que mejoran la concentración, el razonamiento lógico y la gestión emocional de los niños, adaptándose a sus necesidades individuales.
        </p>

        <p className="mb-4 text-lg">
            <strong>Entorno de aprendizaje dinámico</strong>: Nuestra plataforma ofrece ejercicios gamificados y herramientas que refuerzan habilidades cognitivas clave.
        </p>

        <p className="mb-4 text-lg">
            <strong>Apoyo personalizado</strong>: Gracias al análisis de datos, Orbot MD ajusta estrategias educativas y terapéuticas para cada niño, potenciando su desarrollo de forma eficiente.

        </p>

        </div>

        {/* Galería de imágenes */}
        <div className="grid grid-cols-2 gap-4">

        <div className="bg-white rounded-xl h-40 overflow-hidden">
            <img
            src="ruta-imagen1.png"
            alt="Biblioteca Central"
            className="object-cover w-full h-full"
            />
        </div>
        <div className="bg-white rounded-xl h-40 overflow-hidden">
            <img
            src="home.png"
            alt="Biblioteca Central"
            className="object-cover w-full h-full"
            />
        </div>
        </div>
    </div>
</section>

{/* Sección de Autoridades */}
    {/* <section className="bg-[#01274C] text-white py-20 px-6">
    <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">Miembros Fundadores</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12">

        <div className="bg-white rounded-xl shadow-lg overflow-hidden text-black flex flex-col md:flex-row">
            <img
            src="public\user1.png"
            alt="Sara Camacho"
            className="w-full md:w-1/3 object-cover h-80"
            />
            <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">Usuario1</h3>
            <p className="font-semibold mb-2 text-[#6A1313]">Estudiante</p>
            <p className="text-sm">
                dssssssssssssssssss
            </p>
            </div>
        </div>


        <div className="bg-white rounded-xl shadow-lg overflow-hidden text-black flex flex-col md:flex-row">
            <img
            src="public\user1.png"
            alt="Santiago López"
            className="w-full md:w-1/3 object-cover h-80"
            />
            <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">User 1</h3>
            <p className="font-semibold mb-2 text-[#6A1313]">Estudiante</p>
            <p className="text-sm">
                dfsafsad dfa sfgasdg agafg asfgdasgffaf  fa  gasgag ag gdgag
            </p>
            </div>
        </div>


        <div className="bg-white rounded-xl shadow-lg overflow-hidden text-black flex flex-col md:flex-row">
            <img
            src="public\user1.png"
            alt="Alberto Ríos"
            className="w-full md:w-1/3 object-cover h-80"
            />
            <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">User 1</h3>
            <p className="font-semibold mb-2 text-[#6A1313]">Estudiante</p>
            <p className="text-sm">
                fasfsjf fsalhfa jfsdajf jfaodspfjasdj fjasfpasf jfaopdfa f .
            </p>
            </div>
        </div>


        <div className="bg-white rounded-xl shadow-lg overflow-hidden text-black flex flex-col md:flex-row">
            <img
            src="public\user1.png"
            alt="Fernanda Flores"
            className="w-full md:w-1/3 object-cover h-80"
            />
            <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">User 1 </h3>
            <p className="font-semibold mb-2 text-[#6A1313]">Estudiante</p>
            <p className="text-sm">
                Psfasdsadfsad fdsjalfsdah fdssaflksadfh fdsajlfsadfhasd fasdhofysadf  .
            </p>
            </div>
        </div>
        </div>
    </div>
    </section> */}


        </main> 

        {/* Pie de página */}
    <footer className="bg-[#013C6A] text-white py-10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo y Descripción */}
        <div>
        <h3 className="text-2xl font-bold mb-3">OrbotMD</h3>
        <p className="text-sm text-gray-300">
            Orbot MD transforma la educación y el desarrollo cognitivo con herramientas interactivas diseñadas para niños con TDAH. ¡Haz que el aprendizaje sea una experiencia única!
        </p>
        </div>

        {/* Enlaces rápidos */}
        <div>
        <h4 className="text-xl font-semibold mb-3">Enlaces útiles</h4>
        <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/" className="hover:text-white transition">Inicio</a></li>
            <li><a href="/symptons" className="hover:text-white transition">Síntomas Comunes</a></li>
            <li><a href="/earlydetection" className="hover:text-white transition">Detección temprana</a></li>
            <li><a href="/recomendations" className="hover:text-white transition">Recomendaciones</a></li>
            <li><a href="login" className="hover:text-white transition">Iniciar</a></li>
        </ul>
        </div>

        {/* Información de contacto */}
        <div>
        <h4 className="text-xl font-semibold mb-3">Contacto</h4>
        <p className="text-sm text-gray-300">Av. Bolivariana, Ambato, Ecuador</p>
        <p className="text-sm text-gray-300 mt-1">Tel: +593 98-487-4529</p>
        <p className="text-sm text-gray-300 mt-1">Email: info@orbot.edu.ec</p>
        {/* Redes Sociales */}
        <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-gray-100 transition">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.23 5.924a8.904 8.904 0 01-2.575.705 4.503 4.503 0 001.984-2.486 8.933 8.933 0 01-2.833 1.082 4.483 4.483 0 00-7.632 4.086 12.713 12.713 0 01-9.237-4.685 4.482 4.482 0 001.387 5.98A4.458 4.458 0 012 9.54v.057a4.485 4.485 0 003.593 4.392 4.489 4.489 0 01-2.016.076 4.488 4.488 0 004.19 3.116A8.993 8.993 0 012 19.54a12.673 12.673 0 006.88 2.018c8.253 0 12.77-6.838 12.77-12.768 0-.195-.004-.389-.013-.582a9.14 9.14 0 002.24-2.285z" />
            </svg>
            </a>
            <a href="#" className="hover:text-gray-100 transition">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M19.615 3.184H4.384C3.062 3.184 2 4.246 2 5.568v12.864c0 1.322 1.062 2.384 2.384 2.384h15.231c1.322 0 2.384-1.062 2.384-2.384V5.568c0-1.322-1.062-2.384-2.384-2.384zM9.846 16.615V7.384l8.615 4.615-8.615 4.616z" />
            </svg>
            </a>
            <a href="#" className="hover:text-gray-100 transition">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.41h3.128V8.793c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24h-1.918c-1.505 0-1.796.716-1.796 1.765v2.314h3.592l-.468 3.296h-3.124V24h6.127C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
            </svg>
            </a>
        </div>
        </div>
    </div>

    {/* Línea inferior */}
    <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} OrbotMD. Todos los derechos reservados.
    </div>
</footer>

            </div>
            </>
    )
}
