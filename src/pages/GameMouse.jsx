import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { stop } from "framer-motion/m";
import { useNavigate } from 'react-router-dom'; 


// Componente para los botones de control (comandos)
const CommandButton = ({ children, onClick, label }) => {
    return (
        <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
        aria-label={label}
        className="w-16 h-16 rounded-xl border-2 border-white/10 bg-white/5 text-white font-bold flex items-center justify-center transition-all duration-200 hover:bg-white/20"
        >
        <span className="text-3xl">{children}</span>
        </motion.button>
    );
    };  

    // Componente para el ratón con animación
    const Mouse = ({ cellSize }) => (
    <motion.div
        layout
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 26 }}
        className="absolute inset-0 flex items-center justify-center"
    >
        <div
        className="rounded-full shadow-lg bg-[#ffda79] flex items-center justify-center"
        style={{
            width: Math.max(36, cellSize * 0.7),
            height: Math.max(36, cellSize * 0.7),
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        }}
        >
        <span className="text-xl">🐭</span>
        </div>
    </motion.div>
    );

    // ++++++++++++++++++++++++++++++Definiciones de Laberintos -----------------

    // #region ➡️Laberinto

    function mazeStraightLine() {
    const rows = 15;
    const cols = 15;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(1));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1 && Math.random() < 0.1) {
            grid[r][c] = 0;
        }
        }
    }
    
    grid[1][1] = 0;
    grid[1][2] = 0;
    grid[1][3] = 0;
    grid[1][4] = 0;
    return { grid, start: { r: 1, c: 1 }, goal: { r: 1, c: 4 } };
    }


    function mazeDownLeft() {
    const rows = 15;
    const cols = 15;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(1));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1 && Math.random() < 0.1) {
            grid[r][c] = 0;
        }
        }
    }

    for (let r = 1; r <= 7; r++) {
        grid[r][1] = 0;
    }
    grid[7][2] = 0;
    grid[7][3] = 0;
    return { grid, start: { r: 1, c: 1 }, goal: { r: 7, c: 3 } };
    }

    // --- Nuevo laberinto: en forma de S ---
    function mazeS() {
    const rows = 15;
    const cols = 15;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(1));

    // Camino en forma de S
    for (let c = 1; c <= 8; c++) grid[1][c] = 0;
    for (let r = 1; r <= 10; r++) grid[r][8] = 0;
    for (let c = 8; c >= 3; c--) grid[10][c] = 0;
    for (let r = 10; r >= 5; r--) grid[r][3] = 0;

    return { grid, start: { r: 1, c: 1 }, goal: { r: 5, c: 3 } };
    }

    function mazeHiddenWalls() {
    const rows = 15;
    const cols = 15;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(1));

    // Camino principal: dos giros a la derecha
    for (let r = 1; r <= 5; r++) grid[r][1] = 0;
    for (let c = 1; c <= 8; c++) grid[5][c] = 0;
    for (let r = 5; r <= 10; r++) grid[r][8] = 0;

    // Paredes decorativas aleatorias
    for (let i = 0; i < (rows * cols) / 10; i++) {
        const randR = Math.floor(Math.random() * (rows - 2)) + 1;
        const randC = Math.floor(Math.random() * (cols - 2)) + 1;
        if (grid[randR][randC] === 1) {
            grid[randR][randC] = 0;
        }
    }

    // Asegura el camino principal y el objetivo
    grid[1][1] = 0;
    grid[2][1] = 0;
    grid[3][1] = 0;
    grid[4][1] = 0;
    grid[5][1] = 0;
    grid[5][2] = 0;
    grid[5][3] = 0;
    grid[5][4] = 0;
    grid[5][5] = 0;
    grid[5][6] = 0;
    grid[5][7] = 0;
    grid[5][8] = 0;
    grid[6][8] = 0;
    grid[7][8] = 0;
    grid[8][8] = 0;
    grid[9][8] = 0;
    grid[10][8] = 0;

    return { grid, start: { r: 1, c: 1 }, goal: { r: 10, c: 8 } };
    }

    function mazeRepeatedPattern() {
    const rows = 15;
    const cols = 15;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(1));

    // Patrón "arriba-derecha-abajo"
    let r = 1;
    let c = 1;
    while (c < cols - 2) {
        grid[r][c] = 0;
        grid[r][c + 1] = 0;
        grid[r + 1][c + 1] = 0;
        c += 2;
        r++;
    }
    
    // Ajustar el camino final
    const lastC = c - 2;
    grid[r-1][lastC] = 0;
    
    const start = { r: 1, c: 1 };
    const goal = { r: r - 1, c: lastC };
    grid[start.r][start.c] = 0;
    grid[goal.r][goal.c] = 0;

    return { grid, start: start, goal: goal };
    }

    // #endregion



        function getMazeByIndex(index) {
    switch (index) {
        case 0:
            return mazeStraightLine();
        case 1:
            return mazeDownLeft();
        case 2:
            return mazeRepeatedPattern();
        case 3:
            return mazeS();
        case 4:
            return mazeHiddenWalls();
        default:
            return mazeStraightLine();
    }
    }

    // ----------------- Main component -----------------
    export default function GameMouseV1() {
    const navigate = useNavigate(); // <--- Descomenta si usas React Router


    const [mazeIndex, setMazeIndex] = useState(0);
    const [mazeData, setMazeData] = useState(() => getMazeByIndex(0));
    const [pos, setPos] = useState(mazeData.start);
    const [commands, setCommands] = useState([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [won, setWon] = useState(false);
    const [lost, setLost] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    // 👇 ESTADOS CLAVE PARA EL FLUJO DE CONSENTIMIENTO
    const [modeSelectionVisible, setModeSelectionVisible] = useState(true); // Controla el primer modal (Modo)
    const [tycVisible, setTycVisible] = useState(false);                     // Controla el segundo modal (TyC)
    const [scanEnabled, setScanEnabled] = useState(false);                  // Guarda la decisión final
    const [adultCheck, setAdultCheck] = useState(false);                    // Checkbox de TyC
    const leftAreaRef = useRef(null);
    const [cellSize, setCellSize] = useState(56);
    const rows = mazeData.grid.length;
    const cols = mazeData.grid[0].length;
      // --- Estados / refs para cámara y monitoreo ---
    const [consent, setConsent] = useState(false);
    const [stream, setStream] = useState(null);
    const [monitoring, setMonitoring] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [movementHistory, setMovementHistory] = useState([]); // Historial de % de movimiento
    const [sessionSummary, setSessionSummary] = useState(null); // Resultado final para el modal

    // --- Referencias clave faltantes en GameMouseV1 ---
    const prevFrameRef = useRef(null); // Frame anterior
    const samplingIntervalRef = useRef(null); // ID del Intervalo
    const startAtRef = useRef(null); // Timestamp de inicio

    // --- Constantes de Ajuste (opcionales, pero recomendadas) ---
    const SAMPLE_MS = 200; 
    const DIFF_THRESHOLD_PERCENT = 3;


    // AÑADE ESTAS FUNCIONES A TU GameMouseV1

    // ------------------------------------
    // --- 3. Lógica de Detección de Movimiento ---
    // ------------------------------------

    /**
     * Calcula el porcentaje de píxeles que han cambiado entre dos frames.
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
        // El video.videoWidth/Height se toman una vez el stream está cargado
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
                // Solo actualiza el estado si el componente está montado
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

    // -----------------------------------
  // startCamera / stopCamera
  // -----------------------------------
    // --- 2. Función startCamera simplificada ---
    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
            setStream(s);
            // ¡Ya no hacemos nada más aquí! El useEffect se encarga del .play()
            
        } catch (err) {
            console.error("No se pudo acceder a la cámara:", err);
            alert("Permite acceso a la cámara para usar la función de supervisión.");
        }
    };


    const stopCamera = () => {
            if (stream) {
            stream.getTracks().forEach((t) => t.stop());
            setStream(null);
            }
    };

    // --- Función 4. Finalización y Reporte de Datos (Cópiala tal cual) ---
// RENOMBRAMOS el argumento 'timeMs' a 'gameTimeMs' para mayor claridad
    const finishSessionAndSend = ({ score, gameTimeMs }) => {
        stopMonitoring();
        
        // Si no hay historial, salimos o generamos un payload básico
        if (movementHistory.length === 0) {
            setSessionSummary({ 
                score, 
                gameTimeMs, // Usamos el tiempo de juego provisto
                monitoringDurationMs: 0, // Añadimos el nuevo campo
                samples: 0, 
                avgMovement: 0, 
                percentMoving: 0, 
                cameraAllowed: !!stream 
            });
            setShowModal(true);
            //stopCamera();
            return;
        }

        const endAt = new Date(); // Captura el timestamp final como objeto Date
        const arr = movementHistory;

        // --- CÁLCULO DE LA DURACIÓN DEL MONITOREO ---
        const startAt = new Date(startAtRef.current); // Convierte la referencia de inicio a Date
        const monitoringDurationMs = endAt.getTime() - startAt.getTime(); // Duración total en ms

        // Cálculo de métricas de movimiento
        const avgMovement = arr.length ? (arr.reduce((s, x) => s + x.percent, 0) / arr.length) : 0;
        // Usa la constante DIFF_THRESHOLD_PERCENT
        const movingSamples = arr.filter(x => x.percent > DIFF_THRESHOLD_PERCENT).length; 
        const percentMoving = arr.length ? (movingSamples / arr.length) * 100 : 0;

        const payload = {
            sessionId: crypto.randomUUID(), 
            userId: 'GameMouseUser', 
            gameName: 'GameMouseV1',
            startAt: startAtRef.current, 
            endAt: endAt.toISOString(), // Lo devolvemos en formato ISO string
            score,
            gameTimeMs, // Tiempo de ejecución del ratón
            monitoringDurationMs, // Duración total de la cámara activa
            
            // Datos clave del monitoreo
            avgMovement: parseFloat(avgMovement.toFixed(2)),
            percentMoving: parseFloat(percentMoving.toFixed(2)),
            samples: arr.length,
            consent,
            adultPresent: adultCheck, 
            cameraAllowed: !!stream,
            movementEvents: arr.filter((_,i)=> i % Math.max(1,Math.floor(arr.length/50)) === 0) 
        };

        sendConcentrationMetrics(payload); 


        setSessionSummary(payload); 
        setShowModal(true); 

        // Aquí iría el envío al backend (comentado)
        // ...

        stopCamera();
    };

    const computeScore = () => {
        if (!won) return 0;
        const timeFactor = Math.max(0, 10000 - Math.floor(elapsedTime));
        const movesFactor = Math.max(0, 1000 - commands.length * 50);
        return Math.floor((timeFactor + movesFactor) / 100);
    };



    // --- Nuevo useEffect para asegurar que el video se muestre ---
    useEffect(() => {
        const videoElement = videoRef.current;
    
    // Si tenemos el stream y la referencia al elemento video,
    // debemos asignarlo e iniciar la reproducción.
    if (stream && videoElement) {
        videoElement.srcObject = stream;
        
        // Es crucial llamar a .play() para que la imagen se muestre
        videoElement.play().catch(err => {
             // Esto puede ocurrir si el navegador bloquea el autoplay sin 'muted', 
             // pero ya tienes 'muted' en el elemento, así que no debería ser un problema.
            console.error("Error al intentar reproducir el video:", err);
        });
    }
    
    // NOTA: No necesitamos un cleanup complejo aquí, ya que stopCamera()
    // se encarga de detener el stream al desmontar o al cerrarse.
    
    }, [stream]); // Se ejecuta cuando el stream cambia.




    useEffect(() => {
        if (!isExecuting) return;

        if (currentMoveIndex >= commands.length) {
        setIsExecuting(false);
        return;
        }

        const timer = setTimeout(() => {
        const command = commands[currentMoveIndex];
        let newPos = { ...pos };
        switch (command) {
            case "up":
            newPos.r -= 1;
            break;
            case "down":
            newPos.r += 1;
            break;
            case "left":
            newPos.c -= 1;
            break;
            case "right":
            newPos.c += 1;
            break;
            default:
            break;
        }

        if (canMoveTo(newPos.r, newPos.c)) {
            setPos(newPos);
            setCurrentMoveIndex((prev) => prev + 1);
        } else {
            setIsExecuting(false);
            setLost(true);
            setShowModal(true);
        }
        }, 400);

        return () => clearTimeout(timer);
    }, [isExecuting, currentMoveIndex, commands, pos, mazeData]);

// Reemplaza tu segundo useEffect que maneja la victoria/derrota
useEffect(() => {
    // ⚠️ Evitar bucles
    if (won || lost) {
        return; 
    }

    // Comprueba si la ejecución ha terminado y se han procesado todos los comandos.
    if (!isExecuting && commands.length > 0 && currentMoveIndex === commands.length) {
        
        // --- Condición de Victoria (Llegó a la meta) ---
        if (pos.r === mazeData.goal.r && pos.c === mazeData.goal.c) {
            
            setWon(true);
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });

            if (scanEnabled && consent) {
                // 💡 ¡SOLO AQUÍ ANALIZAMOS!
                finishSessionAndSend({ score: computeScore(), gameTimeMs: elapsedTime });
            } else {
                // Victoria sin escaneo
                setShowModal(true);
            }
            
        } else {
            // --- Condición de Derrota (Terminó comandos sin llegar) ---
            setLost(true);
            // 💡 No importa si scanEnabled está activo o no, ¡solo mostramos el modal simple!
            setShowModal(true); 
            
            // ❌ IMPORTANTE: Si perdemos, detenemos el monitoreo sin analizar.
            if (scanEnabled && consent) {
                 stopMonitoring(); // Detenemos el muestreo
                 stopCamera(); // Detenemos el stream de la cámara (para liberar recursos)
            }
        }
    }
    // ... (dependencias) ...
}, [isExecuting, pos, commands, currentMoveIndex, mazeData, scanEnabled, consent, elapsedTime, computeScore, won, lost, finishSessionAndSend]);

useLayoutEffect(() => {
        function measure() {
        const el = leftAreaRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const padding = 32;
        const availableWidth = Math.max(80, rect.width - padding * 2);
        const availableHeight = Math.max(80, rect.height - padding * 2);
        const size = Math.floor(
            Math.min(availableWidth / cols, availableHeight / rows)
        );
        const finalSize = Math.max(48, Math.min(80, size));
        setCellSize(finalSize);
        }
        
        measure();
        window.addEventListener("resize", measure);
        const ro = new ResizeObserver(measure);
        const el = leftAreaRef.current;
        if (el) {
        ro.observe(el);
        }
        
        return () => {
        window.removeEventListener("resize", measure);
        if (el) {
            ro.disconnect();
        }
        };
    }, [cols, rows]);

    useEffect(() => {
        let intervalId;
        if (isExecuting) {
        if (!startTime) {
            setStartTime(Date.now());
        }
        intervalId = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 100);
        } else if (!isExecuting && startTime) {
        setElapsedTime(Date.now() - startTime);
        setStartTime(null);
        clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [isExecuting, startTime]);

    const canMoveTo = (r, c) => {
        return r >= 0 && r < rows && c >= 0 && c < cols && mazeData.grid[r][c] === 0;
    };

    const addCommand = (direction) => {
        if (commands.length < 200 && !isExecuting) {
        setCommands([...commands, direction]);
        }
    };

    const removeLastCommand = () => {
        if (!isExecuting) {
        setCommands(commands.slice(0, -1));
        }
    };

    const runCommands = () => {
        if (isExecuting || won || lost) return;
        setPos(mazeData.start);
        setCurrentMoveIndex(0);
        setIsExecuting(true);
    };

    const resetGame = () => {
        setPos(mazeData.start);
        setCommands([]);
        setIsExecuting(false);
        setWon(false);
        setLost(false);
        setShowModal(false);
        setCurrentMoveIndex(-1);
        setElapsedTime(0);
        setStartTime(null);
    };

    const generateNewMaze = () => {
        // Lógica para generar el nuevo laberinto
        const newIndex = (mazeIndex + 1) % 5;
        const newMazeData = getMazeByIndex(newIndex);
        setMazeIndex(newIndex);
        setMazeData(newMazeData);
        
        // Resetear el estado del juego
        setPos(newMazeData.start);
        setCommands([]);
        setIsExecuting(false);
        setWon(false);
        setLost(false);
        setShowModal(false);
        setCurrentMoveIndex(-1);
        setElapsedTime(0);
        setStartTime(null);
        
        // === LÓGICA CLAVE PARA CONTINUAR EL MONITOREO ===
        if (scanEnabled && consent) {
            // 1. Aseguramos que el muestreo anterior se detenga

                setSessionSummary(null); 

            stopCamera();
            stopMonitoring(); 
            
            // 2. Reseteamos el historial y el timestamp de inicio para la nueva sesión
            setMovementHistory([]);
            startAtRef.current = new Date().toISOString(); 
            
            // 3. Reiniciamos el monitoreo de movimiento (la cámara ya está encendida)
            // El nuevo useEffect de "loadedmetadata" ya no es necesario aquí porque el video ya está cargado.
            startCamera();
            startMonitoring(); 
        }
        // ===============================================
    };


const finishGameAndNavigate = () => {
    // 1. Detener el monitoreo y la cámara
    stopMonitoring();
    stopCamera();

    // 2. Detener los timers del juego
    // Aunque el useEffect de elapsedTime tiene cleanup, es buena práctica hacer un reset.
    // Detenemos el loop de ejecución (si estuviera activo)
    setIsExecuting(false); 
    // Aseguramos que el estado de tiempo se resetea para detener el timer en el useEffect
    setStartTime(null); 
    
    // 3. Limpiar cualquier estado de modal/resumen
    setShowModal(false);
    setSessionSummary(null);

    // 4. Navegar a la página del paciente (Reemplaza con tu lógica de navegación real)
    navigate('/dashpatient'); // <--- Descomenta si usas React Router
    
    // Placeholder para demostrar que la navegación ocurriría
    console.log("Juego finalizado. Navegando a /dashpatient...");
};



    // --- Funciones de Modal ---
// Opción 1: El usuario elige jugar sin monitorear
const handleStartWithoutScan = () => {
    setScanEnabled(false);
    setModeSelectionVisible(false); // Cierra el primer modal
};

// Opción 2: El usuario elige Monitorear (abre el segundo modal)
const handleSelectScan = () => {
    setModeSelectionVisible(false); // Cierra el primer modal
    setTycVisible(true);            // Abre el segundo modal (TyC)
};



const API_URL = `${import.meta.env.VITE_API_URL}/api/ConcetrationMetric/create-free`;

const sendConcentrationMetrics = async (data) => {
    // 💡 CORRECCIÓN CLAVE: Usar "token" si esa es la clave correcta en localStorage.
    const token = localStorage.getItem('token'); 
    
    if (!token) {
        console.error("Token: NO ENCONTRADO. Verifique si la clave 'token' es correcta en localStorage.");
        return;
    }

    const apiPayload = {
        ConcetrationMetricDurationMs: parseInt(data.monitoringDurationMs || 0, 10),
        ConcetrationMetricPercentMoving: parseFloat(data.percentMoving || 0),
        ConcetrationMetricAvgMovement: parseFloat(data.avgMovement || 0),
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(apiPayload),
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            console.error(
                `❌ Error ${response.status}: La API rechazó el envío de métricas.`, 
                'Respuesta del servidor:', 
                errorText
            );
            // Esto le indicará al usuario si el token (401) o los datos (400) fallaron.
        } else {
            const result = await response.json();
            console.log('✅ Métricas de Concentración guardadas exitosamente:', result);
        }

    } catch (error) {
        console.error('Error de red/conexión al enviar métricas:', error);
    }
};

// Opción 3: El usuario acepta los TyC y empieza a jugar con monitoreo
// Opción 3: El usuario acepta los TyC y empieza a jugar con monitoreo
const handleAcceptTyc = async () => {
    // 1) marcar consentimiento y cerrar modal
    setConsent(true);
    setScanEnabled(true);
    setTycVisible(false); // Cierra el TyC
    
    // 2) *SOLO* intentar iniciar cámara. El monitoreo lo hará un useEffect.
    startCamera(); // Ya es async, pero la llamamos sin await para no bloquear
    
    // También debes iniciar la lógica del juego o al menos abrir la UI principal
    // Asumiendo que el juego comienza cuando tycVisible=false
};

    // Opción 4: El usuario rechaza los TyC (vuelve al modal 1 o juega sin escanear)
    const handleRejectTyc = () => {
        // Si rechaza, vuelve al modal de selección o forzamos el modo sin escaneo.
        // Optaremos por forzar el modo sin escaneo para no volver a preguntar.
        setAdultCheck(false); // Resetea el checkbox
        setTycVisible(false); // Cierra el segundo modal
        setScanEnabled(false); // Juega sin escanear
        // También podrías poner: setModeSelectionVisible(true); para que vuelva a elegir.
    };


// --- Nuevo useEffect para iniciar el Monitoreo de forma segura ---
useEffect(() => {
    const videoElement = videoRef.current;
    
    // Si la cámara está activa, el escaneo está habilitado y NO estamos monitoreando aún:
    if (stream && scanEnabled && videoElement && !monitoring) {
        
        // Función para empezar el monitoreo una vez que el video cargue los metadatos
        const handleLoadedMetadata = () => {
             // 💡 ¡AQUÍ ESTÁ EL ARREGLO! Llamamos a startMonitoring solo cuando es seguro.
            startMonitoring();
        };

        // Si los metadatos ya están cargados (a veces sucede muy rápido), lo hacemos de inmediato.
        if (videoElement.readyState >= 2) { // READY_STATE_HAVE_CURRENT_DATA o superior
            handleLoadedMetadata();
        } else {
            // Sino, esperamos el evento 'loadedmetadata'
            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        }

        // Cleanup: removemos el listener si el componente o el stream cambian
        return () => {
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }
}, [stream, scanEnabled, monitoring]); // Depende de stream y scanEnabled

      //Cleanup al desmontar
    useEffect(() => {
        return () => {
        stopMonitoring();
        //stopCamera();
        };
    }, []);

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-b from-indigo-900 to-sky-800 p-4">
        <div className="h-full flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 max-w-[1400px] mx-auto">
            {/* Maze */}
            <div
            ref={leftAreaRef}
            className="rounded-xl bg-white/5 p-4 flex items-center justify-center overflow-hidden"
            >
            <div
                key={mazeIndex} // Agrega esta línea
                role="grid"
                aria-label="Laberinto"
                className="grid gap-2 bg-white/5 p-4 rounded-xl"
                style={{
                width: cols * cellSize,
                height: rows * cellSize,
                gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
                }}
            >
                {mazeData.grid.map((row, r) =>
                row.map((cell, c) => {
                    const isGoal = mazeData.goal.r === r && mazeData.goal.c === c;
                    const isStart = mazeData.start.r === r && mazeData.start.c === c;
                    const isMouse = pos.r === r && pos.c === c;

                    return (
                    <div
                        key={`${r}-${c}`}
                        role="gridcell"
                        className="relative rounded-lg flex items-center justify-center"
                        style={{
                        background:
                            cell === 1 ? "#1f2937" : "rgba(255,255,255,0.04)",
                        boxShadow:
                            cell === 1 ? "inset 0 2px 4px rgba(0,0,0,0.6)" : "none",
                        }}
                    >
                        {isGoal && cell === 0 && <span className="text-3xl">🧀</span>}
                        {isStart && cell === 0 && <span className="text-3xl">🏡</span>}
                        {isMouse && <Mouse cellSize={cellSize} />}
                    </div>
                    );
                })
                )}
            </div>
            </div>

            {/* Controles */}
            <div className="p-3 md:p-4 rounded-xl bg-white/6 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center mb-4">
                </div>

                <div className="bg-white/5 p-4 rounded-lg mb-4">
                <div className="flex flex-wrap gap-2 h-56 bg-white/5 p-2 rounded-lg items-start overflow-y-auto">
                    {commands.map((cmd, index) => (
                    <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`w-12 h-12 rounded-md flex items-center justify-center font-bold text-white ${
                        index === currentMoveIndex ? "bg-yellow-500" : "bg-indigo-600"
                        }`}
                    >
                        {cmd === "up" && "▲"}
                        {cmd === "down" && "▼"}
                        {cmd === "left" && "◄"}
                        {cmd === "right" && "►"}
                    </motion.div>
                    ))}
                </div>
                </div>

                <div className="flex justify-center my-4">
                <div className="grid gap-4 grid-rows-3 items-center justify-items-center">
                    <CommandButton onClick={() => addCommand("up")} label="Arriba">
                    ▲
                    </CommandButton>
                    <div className="flex gap-4 items-center justify-center">
                    <CommandButton
                        onClick={() => addCommand("left")}
                        label="Izquierda"
                    >
                        ◄
                    </CommandButton>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={runCommands}
                        aria-label="Ejecutar comandos"
                        disabled={isExecuting || won || lost}
                        className="w-16 h-16 rounded-full bg-green-500 text-white font-bold flex items-center justify-center transition-all duration-200 hover:bg-green-600 disabled:opacity-50"
                    >
                        <span className="text-3xl">▶</span>
                    </motion.button>
                    <CommandButton
                        onClick={() => addCommand("right")}
                        label="Derecha"
                    >
                        ►
                    </CommandButton>
                    </div>
                    <CommandButton onClick={() => addCommand("down")} label="Abajo">
                    ▼
                    </CommandButton>
                </div>
                </div>

                <div class="flex flex-col space-y-3 p-4 bg-gray-800 rounded-xl shadow-2xl">
                    
                    <div class="flex space-x-3">
                        <button
                            onClick={removeLastCommand}
                            class="flex-1 p-3 rounded-xl border border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all text-sm font-medium"
                        >
                            🗑️ Borrar último
                        </button>

                        <button
                            onClick={resetGame}
                            class="flex-1 p-3 rounded-xl border border-teal-500/50 bg-teal-800/20 text-teal-300 hover:bg-teal-800/30 transition-all text-sm font-medium"
                        >
                            🔄 Reiniciar Nivel
                        </button>
                    </div>

                    <button
                        onClick={finishGameAndNavigate}
                        class="w-full py-3 rounded-xl bg-red-600 text-white font-bold tracking-wide shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.01]"
                    >
                        🛑 Finalizar Juego y Salir
                    </button>
    <button
        onClick={generateNewMaze}
        class="w-full py-3 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-200 hover:scale-[1.01] shadow-teal-500/50 shadow-md"
    >
        ✨ Generar Nuevo Laberinto
    </button>
                </div>
            </div>
            </div>

            
        </div>


{/* ======================= MODALES CONSOLIDADOS (Inicio, TyC, y Resultado Final) ======================= */}
<AnimatePresence>
    {/* MODAL 1: SELECCIÓN DE MODO */}
    {modeSelectionVisible && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#01274C]/60 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.8, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: -50 }}
                className="relative bg-gradient-to-br from-[#009689]/80 to-[#013C6A]/80 rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border border-[#01274C]/50 backdrop-blur-xl"
            >
                <h3 className="text-3xl font-extrabold mb-4 text-[#FFCD3C]">
                    Bienvenido a Misión Queso .!!
                </h3>
                <p className="text-sm mb-6 text-[#E0F2F1] leading-relaxed">
                    ¿Quieres usar el <span className="font-semibold">Monitor de Concentración</span> para obtener métricas de avance más precisas? <br/>
                    <span className="italic">(Requiere acceso a la cámara)</span>
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleSelectScan}
                        className="bg-[#FFCD3C]/90 hover:bg-[#FFCD3C] text-[#01274C] font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 hover:scale-105"
                    >
                        Activar Escaneo de Movimiento (Recomendado)
                    </button>
                    <button
                        onClick={handleStartWithoutScan}
                        className="bg-white/20 text-[#E0F2F1] font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 hover:bg-white/30"
                    >
                        Empezar Juego Sin Escaneo
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )}

    {/* MODAL 2: TÉRMINOS Y CONDICIONES (TyC) */}
    {tycVisible && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#01274C]/60 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.8, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: -50 }}
                className="relative bg-gradient-to-br from-[#009689]/80 to-[#013C6A]/80 rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border border-[#01274C]/50 backdrop-blur-xl"
            >
                <h3 className="text-2xl font-extrabold mb-4 text-[#FFCD3C]">
                    Confirmación de Monitoreo 🧐
                </h3>
                <p className="text-xs mb-6 text-[#E0F2F1] p-3 border border-[#FFCD3C]/40 bg-[#01274C]/40 rounded-lg leading-relaxed">
                    <span className="font-bold">Términos y Condiciones:</span> Al presionar "Aceptar", autorizas el acceso a la cámara. Solo se analiza el <span className="font-semibold">cambio de píxeles (movimiento)</span> para métricas de concentración. <br/>
                    <span className="italic">No se graba, almacena, ni transmite ningún video o imagen.</span>
                </p>

                {/* Checkbox */}
                <label className="flex items-center justify-center mb-6 text-sm font-semibold text-[#E0F2F1]">
                    <input 
                        type="checkbox" 
                        checked={adultCheck} 
                        onChange={e => setAdultCheck(e.target.checked)} 
                        className="w-5 h-5 text-[#FFCD3C] rounded mr-2 accent-[#FFCD3C]"
                    />
                    Confirmo que he leído y acepto los TyC y que hay un adulto responsable presente.
                </label>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleAcceptTyc}
                        disabled={!adultCheck}
                        className="bg-[#FFCD3C]/90 hover:bg-[#FFCD3C] text-[#01274C] font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    >
                        Aceptar TyC y Empezar a Jugar
                    </button>
                    <button
                        onClick={handleRejectTyc}
                        className="bg-white/20 text-[#E0F2F1] font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 hover:bg-white/30"
                    >
                        Rechazar y Jugar Sin Escaneo
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )}

    {/* MODAL 3: RESULTADO FINAL (VICTORIA/DERROTA/RESUMEN) */}
    {/* Solo se muestra si el modal de resultado está activo y los modales iniciales están cerrados */}
    {showModal && !modeSelectionVisible && !tycVisible && ( 
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#01274C]/60 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.8, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: -50 }}
                className="relative bg-gradient-to-br from-[#009689]/80 to-[#013C6A]/80 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-[#01274C]/50 backdrop-blur-xl"
            >
                
                {sessionSummary ? (
                    // --- RESUMEN DE MONITOREO (GANÓ CON ESCANEO) - FORMATO CORREGIDO Y TIEMPOS CORREGIDOS ---
                    <div className="text-left text-[#E0F2F1]">
                        <h2 className="text-3xl font-extrabold mb-4 text-[#FFCD3C] text-center">
                            ¡Ganaste y Analizamos! 🎉
                        </h2>

                        <h4 className="text-xl font-bold mt-4 mb-2 border-b border-[#009689] pb-1">Análisis de Concentración</h4>
                        
                        {/* Tiempo Total de Monitoreo (Nueva Métrica) */}
                        {/* Se asume que monitoringDurationMs es el campo nuevo que creaste en finishSessionAndSend */}
                        <p className="mb-1"><strong>⏳ Duración de la Sesión:</strong> {Math.floor(sessionSummary.monitoringDurationMs / 1000)} segundos</p>
                        
                        <p className="mb-1"><strong>✅ % de Tiempo en Movimiento:</strong> {sessionSummary.percentMoving}%</p>
                        <p><strong>✅ Movimiento Promedio:</strong> {sessionSummary.avgMovement}%</p>

                        <button 
                            onClick={() => { 
                                // Eliminamos el reset de setSessionSummary(null) y setShowModal(false) 
                                // ya que generateNewMaze() se encarga de todo el reinicio, incluyendo cerrar el modal.
                                generateNewMaze(); 
                            }}
                            className="bg-[#FFCD3C]/90 hover:bg-[#FFCD3C] text-[#01274C] font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 hover:scale-105 mt-6 w-full mb-4"
                        >
                            Siguiente Desafío 🚀
                        </button>
                        <button 
                            onClick={finishGameAndNavigate} // Llama a la nueva función
                            className="bg-red-500/90 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 w-full"
                        >
                            Finalizar Juego y Volver
                        </button>
                    </div>
                ) : (
                    // --- MODAL NORMAL (PERDIÓ O GANÓ SIN ESCANEO) ---
                    <>
                        <h3 className="text-3xl font-extrabold mb-4 text-[#FFCD3C]">
                            {won ? "🎉 ¡Felicitaciones!" : "😓 ¡Inténtalo de Nuevo!"}
                        </h3>
                        <p className="text-[#E0F2F1] text-base mb-6 leading-relaxed">
                            {won
                                ? `¡Programaste la ruta perfecta y obtuviste un puntaje de ${computeScore()}!`
                                : "El ratón chocó o no llegó a la meta."}
                        </p>
                        <button
                            onClick={won ? generateNewMaze : resetGame}
                            className="bg-[#FFCD3C]/90 hover:bg-[#FFCD3C] text-[#01274C] font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 hover:scale-105 m-4"
                        >
                            {won ? 'Siguiente Nivel' : 'Nuevo Intento'}
                        </button>
                                <button 
                                    onClick={finishGameAndNavigate} // También para el caso de victoria/derrota simple
                                    className="bg-red-500/90 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 w-full"
                                >
                                    Finalizar Juego y Volver
                                </button>
                    </>
                )}
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>


        {/* Canvas oculto (para procesar frames) */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* ======================= MINIATURA FIJA DE CÁMARA ======================= */}

        {consent && stream && (
                <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    position: "fixed",
                    top: 20,
                    left: 20,
                    width: 160,
                    height: 120,
                    borderRadius: 8,
                    border: "2px solid #3498db",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    zIndex: 1000,
                }}
                />
            )}
        
        </div>

        
    );

    
}