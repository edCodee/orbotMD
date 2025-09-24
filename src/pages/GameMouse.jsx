import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

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

    const leftAreaRef = useRef(null);
    const [cellSize, setCellSize] = useState(56);

    const rows = mazeData.grid.length;
    const cols = mazeData.grid[0].length;

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

    useEffect(() => {
        if (!isExecuting && commands.length > 0 && currentMoveIndex === commands.length) {
        if (pos.r === mazeData.goal.r && pos.c === mazeData.goal.c) {
            setWon(true);
            setShowModal(true);
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        } else {
            setLost(true);
            setShowModal(true);
        }
        }
    }, [isExecuting, pos, commands, currentMoveIndex, mazeData]);

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
        const newIndex = (mazeIndex + 1) % 5;
        setMazeIndex(newIndex); // Con esto es suficiente
        const newMazeData = getMazeByIndex(newIndex);
        setMazeIndex(newIndex);
        setMazeData(newMazeData);
        
        setPos(newMazeData.start);
        setCommands([]);
        setIsExecuting(false);
        setWon(false);
        setLost(false);
        setShowModal(false);
        setCurrentMoveIndex(-1);
        setElapsedTime(0);
        setStartTime(null);
    };

    const computeScore = () => {
        if (!won) return 0;
        const timeFactor = Math.max(0, 10000 - Math.floor(elapsedTime));
        const movesFactor = Math.max(0, 1000 - commands.length * 50);
        return Math.floor((timeFactor + movesFactor) / 100);
    };

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
                <div>
                    <h2 className="text-white text-xl md:text-2xl font-extrabold mb-0">Code & Go — Robotón</h2>
                    <div className="text-white/80 text-sm">
                    ¡Programa al ratón para que encuentre el queso!
                    </div>
                </div>
                </div>

                <div className="bg-white/5 p-4 rounded-lg mb-4">
                <h3 className="text-white font-bold mb-2">
                    Comandos ({commands.length}/{200})
                </h3>
                <div className="flex flex-wrap gap-2 min-h-[48px] bg-white/5 p-2 rounded-lg items-center">
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

                <div className="flex gap-2 justify-center mt-4">
                <button
                    onClick={removeLastCommand}
                    className="p-2 md:p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                    Borrar último
                </button>
                <button
                    onClick={resetGame}
                    className="p-2 md:p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    Reiniciar
                </button>
                </div>
                
                <button
                onClick={generateNewMaze}
                className="w-full mt-4 p-3 rounded-lg font-bold text-teal-900 bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-200 hover:scale-105"
                >
                Generar Nuevo Laberinto
                </button>

            </div>
            </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
            {showModal && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            >
                <motion.div
                initial={{ scale: 0.8, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: -50 }}
                className="bg-white/95 rounded-xl p-8 text-center text-gray-900 shadow-2xl"
                >
                <h3 className="text-4xl font-extrabold text-indigo-700 mb-2">
                    {won ? "¡Felicitaciones! 🎉" : "¡Inténtalo de Nuevo! 😓"}
                </h3>
                <p className="text-xl mb-4">
                    {won
                    ? `¡Programaste la ruta perfecta y obtuviste un puntaje de ${computeScore()}!`
                    : "El ratón chocó o no llegó a la meta."}
                </p>
                <button
                    onClick={resetGame}
                    className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-600 transition-colors"
                >
                    Nuevo Juego
                </button>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    );
}