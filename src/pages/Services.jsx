import React from "react";
import { Link } from "react-router-dom";

const ServicesPage = () => {
    return (
        <div className="min-h-screen bg-[#01274C] text-white px-4 py-10 flex flex-col items-center">
        <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-6">

            <h1 className="text-4xl font-extrabold text-[#06A2DB]">Servicios</h1>

            <p className="text-lg text-[#D1ECF6] max-w-3xl">
            En <span className="font-semibold text-white">OrbotMD</span>, ofrecemos una variedad de servicios para satisfacer las necesidades de nuestros clientes. Desde consultoría y asesoramiento hasta desarrollo de software y soluciones de tecnología, estamos aquí para ayudarte a alcanzar tus objetivos.
            </p>

            {/* Servicio 1: Consultoría y Asesoramiento */}
            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left">
            <h2 className="text-2xl font-bold text-white mb-4">Consultoría y Asesoramiento</h2>
            <p className="text-lg text-[#D1ECF6] mb-4">
            Nuestros expertos en consultoría y asesoramiento pueden ayudarte a identificar y resolver problemas en tu negocio, mejorar tus procesos y aumentar tu eficiencia.
            </p>
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>Análisis de mercado y competencia</li>
                <li>Desarrollo de estrategias de marketing y ventas</li>
                <li>Mejora de procesos y eficiencia</li>
                <li>Asesoramiento en tecnología y innovación</li>
            </ul>
            </div>

            {/* Servicio 2: Desarrollo de Software */}
            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left mt-6">
            <h2 className="text-2xl font-bold text-white mb-4">Desarrollo de Software</h2>
            <p className="text-lg text-[#D1ECF6] mb-4">
            Nuestros desarrolladores de software pueden crear soluciones personalizadas para satisfacer tus necesidades, desde aplicaciones móviles hasta sistemas de gestión de datos.
            </p>
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>Desarrollo de aplicaciones móviles</li>
                <li>Creación de sistemas de gestión de datos</li>
                <li>Desarrollo de software de gestión de proyectos</li>
                <li>Integración de sistemas y tecnologías</li>
            </ul>
            </div>

            {/* Servicio 3: Soluciones de Tecnología */}
            <div className="bg-[#015B97] p-6 rounded-2xl shadow-xl w-full max-w-3xl text-left mt-6">
            <h2 className="text-2xl font-bold text-white mb-4">Soluciones de Tecnología</h2>
            <p className="text-lg text-[#D1ECF6] mb-4">
            Nuestros expertos en tecnología pueden ayudarte a encontrar soluciones innovadoras para tus necesidades, desde la implementación de tecnologías de la información hasta la creación de sistemas de seguridad.
            </p>
            <ul className="list-disc pl-6 text-lg space-y-2">
                <li>Implementación de tecnologías de la información</li>
                <li>Creación de sistemas de seguridad</li>
                <li>Desarrollo de soluciones de inteligencia artificial</li>
                <li>Integración de tecnologías de la información</li>
            </ul>
            </div>

            <Link
            to="/constact"
            className="inline-block mt-8 bg-[#06A2DB] hover:bg-[#015B97] text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-300"
            >
            ¡Contactanos para saber más sobre nuestros servicios!
            </Link>
        </div>
        </div>
    );
};

export default ServicesPage;
