import React, { useRef, useState, useEffect } from "react";

// =======================================================================
// === 1. Lógica Central: Componente de Monitoreo de Movimiento ===
// =======================================================================

export default function CameraMotionMonitor({ userId, gameName, onReadyToStart, onSendSummary }) {
    // === ESTADOS DEL COMPONENTE ===
    const videoRef = useRef(null);      // Referencia al elemento <video> (cámara)
    const canvasRef = useRef(null);     // Referencia al elemento <canvas> (para procesar frames)
    const [stream, setStream] = useState(null);         // Objeto MediaStream de la cámara
    const [consent, setConsent] = useState(false);      // Estado de aceptación de TyC
    const [adultPresent, setAdultPresent] = useState(false); // Confirmación de adulto
    const [monitoring, setMonitoring] = useState(false);    // Indica si la detección de movimiento está activa
    const [movementHistory, setMovementHistory] = useState([]); // Historial de % de movimiento por muestra
    const [sessionSummary, setSessionSummary] = useState(null); // Resumen de datos final (para visualización de prueba)

    // === REFERENCIAS PARA EL MONITOREO ===
    const prevFrameRef = useRef(null);      // Almacena la imagen del frame anterior para la comparación
    const samplingIntervalRef = useRef(null); // ID del intervalo para detener el muestreo
    const startAtRef = useRef(null);        // Timestamp del inicio del monitoreo

    // === CONSTANTES DE AJUSTE ===
    const SAMPLE_MS = 200; // 5 FPS (Frecuencia de muestreo: cada 200ms se toma un frame)
    const DIFF_THRESHOLD_PERCENT = 3; // Umbral: 3% de píxeles cambiados se considera "Movimiento"

    // -----------------------------------
    // --- 2. Funciones de la Cámara ---
    // -----------------------------------

    // Abre el flujo de video de la cámara del usuario
    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setStream(s);
            if (videoRef.current) videoRef.current.srcObject = s;
        } catch (err) {
            console.error("No se pudo acceder a la cámara:", err);
            alert("Permite acceso a la cámara para usar la función de supervisión.");
        }
    };

    // Detiene todas las pistas de la cámara y limpia el estado
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
    };

    // ------------------------------------
    // --- 3. Lógica de Detección de Movimiento ---
    // ------------------------------------

    /**
     * Calcula el porcentaje de píxeles que han cambiado entre dos frames.
     * @param {ImageData} prevImageData - Datos de imagen del frame anterior.
     * @param {ImageData} currImageData - Datos de imagen del frame actual.
     * @returns {number} Porcentaje de píxeles que superan el umbral de cambio.
     */
    const computeFrameDiffPercent = (prevImageData, currImageData) => {
        if (!prevImageData || !currImageData) return 0;
        const len = currImageData.data.length; // Longitud del array de datos (R, G, B, A)
        let changeCount = 0;
        
        // Se itera cada 4 posiciones (saltando el canal Alpha)
        for (let i = 0; i < len; i += 4) {
            // Conversión simplificada a escala de grises para comparación (Promedio de RGB)
            const r1 = prevImageData.data[i], g1 = prevImageData.data[i+1], b1 = prevImageData.data[i+2];
            const r2 = currImageData.data[i], g2 = currImageData.data[i+1], b2 = currImageData.data[i+2];
            const gray1 = (r1 + g1 + b1) / 3;
            const gray2 = (r2 + g2 + b2) / 3;
            
            // Umbral: si la diferencia de intensidad de gris es > 15, cuenta como "cambio"
            if (Math.abs(gray1 - gray2) > 15) changeCount++; 
        }

        const pixels = len / 4; // Número total de píxeles
        return (changeCount / pixels) * 100; // Devuelve el porcentaje
    };

    // Inicia el monitoreo de movimiento en un intervalo fijo
    const startMonitoring = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Ajuste de canvas a baja resolución (160px de ancho) para optimizar performance
        const W = 160;
        const H = Math.round((video.videoHeight / video.videoWidth) * W) || 120;
        canvas.width = W;
        canvas.height = H;

        prevFrameRef.current = null;
        setMovementHistory([]);
        startAtRef.current = new Date().toISOString();
        setMonitoring(true);

        samplingIntervalRef.current = setInterval(() => {
            try {
                // 1. Dibuja el frame actual del video en el canvas
                ctx.drawImage(video, 0, 0, W, H);
                // 2. Extrae los datos de la imagen
                const img = ctx.getImageData(0, 0, W, H);
                
                // 3. Compara con el frame anterior
                const prev = prevFrameRef.current;
                const percent = computeFrameDiffPercent(prev, img);
                
                // 4. Almacena el frame actual para la próxima comparación y registra la muestra
                prevFrameRef.current = img;
                const ts = new Date().toISOString();
                setMovementHistory(prev => [...prev, { ts, percent }]);
            } catch (err) {
                console.error("Error al muestrear el frame:", err);
            }
        }, SAMPLE_MS);
    };

    // Detiene el intervalo de monitoreo
    const stopMonitoring = () => {
        if (samplingIntervalRef.current) {
            clearInterval(samplingIntervalRef.current);
            samplingIntervalRef.current = null;
        }
        setMonitoring(false);
    };

    // ------------------------------------
    // --- 4. Finalización y Reporte de Datos ---
    // ------------------------------------

    // Calcula el resumen y prepara los datos para el envío
    const finishSessionAndSend = async ({ score, timeMs }) => {
        stopMonitoring();
        const endAt = new Date().toISOString();
        const arr = movementHistory;
        
        // Cálculo de métricas de movimiento
        const avgMovement = arr.length ? (arr.reduce((s, x) => s + x.percent, 0) / arr.length) : 0;
        // Cuenta cuántas muestras superaron el umbral de movimiento
        const movingSamples = arr.filter(x => x.percent > DIFF_THRESHOLD_PERCENT).length; 
        const percentMoving = arr.length ? (movingSamples / arr.length) * 100 : 0;
        
        const payload = {
            sessionId: crypto.randomUUID(),
            userId,
            gameName,
            startAt: startAtRef.current,
            endAt,
            score,
            timeMs,
            // Datos clave del monitoreo, redondeados para mejor lectura
            avgMovement: parseFloat(avgMovement.toFixed(2)),         
            percentMoving: parseFloat(percentMoving.toFixed(2)),     
            samples: arr.length,
            consent,
            adultPresent,
            cameraAllowed: !!stream,
            // Muestreo de eventos para el backend (ej: solo 50 muestras del total)
            movementEvents: arr.filter((_,i)=> i % Math.max(1,Math.floor(arr.length/50)) === 0) 
        };

        // *Función de Prueba*: Muestra el resumen de datos al usuario
        setSessionSummary(payload); 

        // Opcional: Ejecutar callback con el resumen antes de enviar (para integrar con el juego principal)
        if (onSendSummary) onSendSummary(payload);

        // Envío al Backend (descomentar para producción)
        /*
        try {
            await fetch(`${process.env.REACT_APP_API_URL || ""}/api/telemetry/session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            console.error("No se pudo enviar el resumen:", err);
        } finally {
            stopCamera();
        }
        */
        stopCamera();
    };

    // ------------------------------------
    // --- 5. Efectos (Cleanup) ---
    // ------------------------------------

    // Limpieza al desmontar el componente (cierra la cámara y el intervalo)
    useEffect(() => {
        return () => {
            stopMonitoring();
            stopCamera();
        };
    }, []);

    // ------------------------------------
    // --- 6. Renderizado (Diseño Mejorado) ---
    // ------------------------------------
    
    // Estilos internos para un diseño limpio y profesional
    const modalStyle = {
        background: '#34495e', 
        padding: 30, 
        borderRadius: 10, 
        boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
        maxWidth: 500
    };
    const buttonStyle = (color) => ({
        background: color,
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: 6,
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.2s',
        marginTop: 5,
        marginRight: 10
    });
    const summaryStyle = {
        marginTop: 30, 
        padding: 20, 
        border: '1px solid #3498db', 
        background: '#2c3e50', 
        borderRadius: 10, 
        color: '#ecf0f1'
    };


    return (
        <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', background: '#2c3e50', color: 'white', minHeight: '100vh' }}>
            <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: 10, marginBottom: 20 }}>
                Monitor de Concentración 🧠
            </h2>

            {/* ======================= FASE 1: CONSENTIMIENTO ======================= */}
            {!consent ? (
                <div style={modalStyle}>
                    <h3 style={{ color: '#3498db', fontSize: '1.5rem', marginBottom: 15 }}>Términos y Condiciones de Uso</h3>
                    <p style={{ marginBottom: 20, lineHeight: 1.5 }}>
                        Para optimizar la experiencia y evaluar el nivel de movimiento, necesitamos activar la cámara. 
                        **Importante:** Solo calculamos movimiento (diferencia de cuadros); **no se guarda ningún video**.
                    </p>
                    <label style={{ display: 'block', marginBottom: 15 }}>
                        <input type="checkbox" checked={adultPresent} onChange={e => setAdultPresent(e.target.checked)} style={{ marginRight: 10 }} />
                        **Confirmo que un adulto responsable está presente.**
                    </label>
                    <button 
                        style={buttonStyle(adultPresent ? '#2ecc71' : '#bdc3c7')} 
                        disabled={!adultPresent} 
                        onClick={() => { setConsent(true); startCamera(); }}
                    >
                        Aceptar y Activar Cámara
                    </button>
                </div>
            ) : (
                // ======================= FASE 2: MONITOREO Y CONTROLES =======================
                <div style={{ background: '#34495e', padding: 20, borderRadius: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                    
                    {/* Visualización de Cámara (pequeña y discreta) */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, border: '1px solid #4a637d', padding: 10, borderRadius: 8 }}>
                        <video ref={videoRef} autoPlay playsInline muted 
                            style={{ 
                                width: 160, 
                                height: 120, 
                                borderRadius: 8, 
                                border: '2px solid #3498db', 
                                marginRight: 15 
                            }} 
                        />
                        <div style={{ fontSize: '1rem', color: '#ecf0f1' }}>
                            {monitoring ? 
                                <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>🔴 MONITORIZANDO MOVIMIENTO...</span> : 
                                <span>Cámara Lista. Pulsa para empezar a monitorear.</span>
                            }
                        </div>
                    </div>

                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                        {!monitoring ? (
                            <button 
                                style={buttonStyle('#27ae60')} 
                                onClick={() => { startMonitoring(); if(onReadyToStart) onReadyToStart(); }}
                            >
                                ▶️ Iniciar Monitoreo y Juego
                            </button>
                        ) : (
                            <button 
                                style={buttonStyle('#e67e22')} 
                                onClick={() => stopMonitoring()}
                            >
                                ⏸️ Pausar Monitoreo
                            </button>
                        )}
                        <button 
                            style={buttonStyle('#e74c3c')} 
                            onClick={() => { stopCamera(); setConsent(false); setSessionSummary(null); }}
                        >
                            ❌ Cerrar Cámara y Salir
                        </button>
                    </div>

                    {/* Botón de ejemplo para terminar juego y ver datos */}
                    <button 
                        style={buttonStyle('#8e44ad')}
                        onClick={() => finishSessionAndSend({ score: 123, timeMs: 45000 })}
                    >
                        Terminar Juego (ejemplo) y Mostrar Datos 📊
                    </button>
                </div>
            )}
            
            {/* ======================= FASE 3: RESUMEN DE DATOS (PARA PRUEBA) ======================= */}
            {sessionSummary && (
                <div style={summaryStyle}>
                    <h4 style={{ color: '#3498db', fontSize: '1.4rem', borderBottom: '1px solid #3498db', paddingBottom: 10, marginBottom: 10 }}>
                        Resultados de Monitoreo (Datos Abstraídos)
                    </h4>
                    <p>✅ **Movimiento Promedio:** El porcentaje promedio de la imagen que cambió en cada muestra. **{sessionSummary.avgMovement}%**</p>
                    <p>✅ **% de Tiempo en Movimiento:** El porcentaje de muestras que superaron el umbral de movimiento. **{sessionSummary.percentMoving}%**</p>
                    <p>🔢 **Muestras Analizadas:** {sessionSummary.samples}</p>
                    <p>⏱️ **Duración de la Sesión (ms):** {sessionSummary.timeMs}</p>
                    <button 
                        style={{ ...buttonStyle('#f39c12'), marginTop: 15 }} 
                        onClick={() => setSessionSummary(null)}
                    >
                        Ocultar Resumen
                    </button>
                </div>
            )}
        </div>
    );
}