"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Howl, Howler } from "howler";

// --- Types ---
type Point = { x: number; y: number; time: number };
type GameState = "idle" | "drawing" | "dot" | "short_roast" | "too_slow" | "wrong_shape" | "result";

// --- Roasts & Messages ---
const ROASTS = [
  "That's a dot, not a line. Try again!",
  "Are you afraid of the canvas? Draw a real line!",
  "My grandma draws longer lines in her sleep.",
  "Is your mouse stuck? Move your hand!",
  "That's cute. Now draw an actual line.",
  "Error 404: Line not found. Too short!",
  "Did you run out of digital ink?",
  "I've seen longer lines at the DMV.",
];

const WRONG_SHAPE_MSG = [
  "That's not even a straight line!",
  "Nice circle, but this is a STRAIGHT line game!",
  "Sir, that is a rollercoaster, not a line.",
  "What is that shape? Draw a straight line!",
];

// --- Audio ---
let sounds: { [key: string]: Howl } | null = null;
const playSound = (name: "click" | "correct" | "wrong" | "progress") => {
  if (typeof window === "undefined") return;
  if (!sounds) {
    sounds = {
      click: new Howl({ src: ["/sounds/click.wav"], volume: 0.5 }),
      correct: new Howl({ src: ["/sounds/correct.wav"], volume: 0.5 }),
      wrong: new Howl({ src: ["/sounds/wrong.wav"], volume: 0.5 }),
      progress: new Howl({ src: ["/sounds/progress.wav"], volume: 0.6 }),
    };
  }
  if (sounds[name]) {
    sounds[name].play();
  }
};

export function PerfectLineGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sampleCanvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("glimmick_perfect_line_best");
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [roastMsg, setRoastMsg] = useState<string>("");
  const [lastRoastIdx, setLastRoastIdx] = useState<number>(-1);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Drawing refs
  const pointsRef = useRef<Point[]>([]);
  const isDrawingRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  // Window resize handler
  useEffect(() => {
    const resizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvasRef.current) {
        canvasRef.current.width = w;
        canvasRef.current.height = h;
      }
      if (sampleCanvasRef.current) {
        sampleCanvasRef.current.width = w;
        sampleCanvasRef.current.height = h;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Idle Background Sample Line Animation
  useEffect(() => {
    if (gameState !== "idle") return;

    let offset = 0;
    const canvas = sampleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderSample = () => {
      offset -= 2; // Move dashes to the right visually
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const centerY = h / 2;
      const startX = w * 0.15;
      const endX = w * 0.85;

      ctx.beginPath();
      ctx.setLineDash([20, 15]);
      ctx.lineDashOffset = offset;
      ctx.moveTo(startX, centerY);
      ctx.lineTo(endX, centerY);
      
      ctx.strokeStyle = "rgba(15, 23, 42, 0.2)"; // Slate-900 with low opacity
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw starting dot and end dot
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(startX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(endX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(renderSample);
    };

    renderSample();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState]);

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    if (typeof window !== "undefined") {
      Howler.mute(!newState);
    }
  };

  const startGame = () => {
    playSound("click");
    setGameState("drawing");
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState === "idle") return; // Must click START first
    
    // Auto-clear overlays and start immediately
    if (gameState !== "drawing") {
      setGameState("drawing");
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const x = e.clientX;
    const y = e.clientY;

    pointsRef.current = [{ x, y, time: Date.now() }];
    isDrawingRef.current = true;
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || gameState !== "drawing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const x = e.clientX;
    const y = e.clientY;
    const pts = pointsRef.current;
    pts.push({ x, y, time: Date.now() });

    if (pts.length < 2) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw the clean solid line
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = "#0f172a"; // Slate 900
    ctx.lineWidth = 6;
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!isDrawingRef.current || gameState !== "drawing") return;
    isDrawingRef.current = false;

    const pts = pointsRef.current;
    if (pts.length < 2) {
      handleDot();
      return;
    }

    evaluateLine(pts);
  };

  const handleDot = () => {
    playSound("wrong");
    setGameState("dot");
  };

  const evaluateLine = (pts: Point[]) => {
    const start = pts[0];
    const end = pts[pts.length - 1];

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const totalDistance = Math.sqrt(dx * dx + dy * dy);

    // 1. Check Dot (very tiny movement < 15px)
    if (totalDistance < 15) {
      handleDot();
      return;
    }

    // 2. Check Short Line (< 120px) => Roast
    if (totalDistance < 120) {
      playSound("wrong");
      let rIdx = Math.floor(Math.random() * ROASTS.length);
      if (rIdx === lastRoastIdx) {
        rIdx = (rIdx + 1) % ROASTS.length;
      }
      setLastRoastIdx(rIdx);
      setRoastMsg(ROASTS[rIdx]);
      setGameState("short_roast");
      return;
    }

    // 3. Check Speed (no slow drawing)
    const duration = end.time - start.time;
    const speed = totalDistance / duration; // px per ms
    if (speed < 0.2) {
      playSound("wrong");
      setGameState("too_slow");
      return;
    }

    // 4. Check Shape (Not a straight line: circle/loop/wave)
    let totalError = 0;
    let maxError = 0;

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const dist = Math.abs(dx * (start.y - p.y) - dy * (start.x - p.x)) / totalDistance;
      totalError += dist;
      if (dist > maxError) maxError = dist;
    }

    // If max error is huge relative to total distance
    if (maxError > totalDistance * 0.35) {
      playSound("wrong");
      const randomWrongMsg = WRONG_SHAPE_MSG[Math.floor(Math.random() * WRONG_SHAPE_MSG.length)];
      setRoastMsg(randomWrongMsg);
      setGameState("wrong_shape");
      return;
    }

    // 5. Calculate Final Accuracy Score
    const avgError = totalError / pts.length;
    let calcScore = 100 - avgError * 4 - (maxError / totalDistance) * 30;
    calcScore = Math.max(0, Math.min(100, calcScore));

    const finalScore = parseFloat(calcScore.toFixed(1));
    setScore(finalScore);

    // 6. Handle Best Score & Sounds
    if (finalScore > bestScore && finalScore > 0) {
      setBestScore(finalScore);
      setIsNewBest(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("glimmick_perfect_line_best", finalScore.toString());
      }
      playSound("progress"); // Cheerful best score sound
    } else {
      setIsNewBest(false);
      playSound("correct"); // Normal cheerful score sound
    }

    setGameState("result");
  };

  const copyScore = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound("click");
    const text = `I drew a ${score}% perfect straight line on GLIMMICK! Can you beat me?\nhttps://glimmick.vercel.app/games/perfect-line`;
    navigator.clipboard.writeText(text);
    alert("Score copied to clipboard!");
  };

  const shareScore = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound("click");
    const text = `I drew a ${score}% perfect straight line on GLIMMICK! Can you beat me?`;
    const url = "https://glimmick.vercel.app/games/perfect-line";
    if (navigator.share) {
      navigator.share({ title: "Perfect Straight Line", text, url }).catch(console.error);
    } else {
      copyScore(e);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#e0f2fe] text-slate-800 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif] overflow-hidden select-none touch-none">
      
      {/* Sample Canvas (Idle State) */}
      <canvas 
        ref={sampleCanvasRef} 
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${gameState === 'idle' ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* Main Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={endDrawing}
        onPointerLeave={endDrawing}
        className={`absolute inset-0 w-full h-full z-10 ${gameState !== 'idle' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
      />

      {/* Top Header Bar */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
        <Link 
          href="/"
          className="flex items-center gap-2 font-display font-bold text-2xl md:text-3xl tracking-wider text-slate-900 hover:text-slate-600 transition-colors pointer-events-auto"
        >
          <img src="/logo.jpg" alt="Glimmick Logo" className="w-8 h-8 rounded shadow-sm border-2 border-slate-900" />
          GLIMMICK
        </Link>

        <button
          onClick={toggleAudio}
          className="p-3 bg-white/50 hover:bg-white rounded-full border-2 border-slate-900 text-slate-900 transition-all active:scale-95 shadow-[2px_2px_0_0_#0f172a] pointer-events-auto"
          aria-label={isAudioEnabled ? "Mute audio" : "Enable audio"}
        >
          {isAudioEnabled ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>
      </header>

      {/* Overlays */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4 text-center">
        
        {/* Start Screen */}
        {gameState === "idle" && (
          <div className="flex flex-col items-center pointer-events-auto animate-fade-in">
            <button
              onClick={startGame}
              className="px-10 py-4 bg-white text-slate-900 font-extrabold text-2xl md:text-3xl rounded-full border-4 border-slate-900 shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#0f172a] active:translate-y-2 active:shadow-[0px_0px_0_0_#0f172a] transition-all"
            >
              START
            </button>
            <p className="mt-8 text-slate-600 font-semibold tracking-wide text-lg bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm">
              Draw a perfect straight line across the screen.
            </p>
          </div>
        )}

        {/* Feedback / Errors */}
        {["dot", "short_roast", "too_slow", "wrong_shape"].includes(gameState) && (
          <div className="flex flex-col items-center pointer-events-none animate-fade-in max-w-md">
            
            {gameState === "dot" && (
              <>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 drop-shadow-sm">Oops!</h2>
                <p className="text-xl md:text-2xl text-slate-700 font-bold mb-2">Draw a straight line, not a dot.</p>
              </>
            )}

            {gameState === "short_roast" && (
              <>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 drop-shadow-sm">Too Short!</h2>
                <p className="text-xl md:text-2xl text-slate-700 font-bold mb-2">&quot;{roastMsg}&quot;</p>
              </>
            )}

            {gameState === "too_slow" && (
              <>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 drop-shadow-sm">Too Slow!</h2>
                <p className="text-xl md:text-2xl text-slate-700 font-bold mb-2">A true master draws swiftly. No cheating!</p>
              </>
            )}

            {gameState === "wrong_shape" && (
              <>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 drop-shadow-sm">Wrong Draw!</h2>
                <p className="text-xl md:text-2xl text-slate-700 font-bold mb-2">&quot;{roastMsg}&quot;</p>
              </>
            )}

            <p className="text-base md:text-lg text-slate-500 font-semibold mt-12">Draw anywhere to restart</p>
          </div>
        )}

        {/* Results Screen */}
        {gameState === "result" && (
          <div className="flex flex-col items-center pointer-events-none animate-fade-in">
            <div className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 mb-2 drop-shadow-sm">
              {score.toFixed(1)}<span className="text-4xl md:text-6xl">%</span>
            </div>

            {isNewBest ? (
              <p className="text-xl md:text-2xl text-green-600 font-extrabold mb-8 animate-pulse">
                New best score!
              </p>
            ) : (
              <p className="text-xl md:text-2xl text-slate-600 font-bold mb-8">
                Best score: {bestScore.toFixed(1)}%
              </p>
            )}

            <div className="flex flex-wrap justify-center items-center gap-6 pointer-events-auto">
              <button
                onClick={shareScore}
                className="px-8 py-3.5 bg-[#4ade80] text-slate-900 font-bold text-xl rounded-full border-4 border-slate-900 shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 active:translate-y-2 active:shadow-[0px_0px_0_0_#0f172a] transition-all flex items-center gap-3"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                Share
              </button>
              
              <button
                onClick={copyScore}
                className="px-8 py-3.5 bg-[#c084fc] text-slate-900 font-bold text-xl rounded-full border-4 border-slate-900 shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 active:translate-y-2 active:shadow-[0px_0px_0_0_#0f172a] transition-all flex items-center gap-3"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copy
              </button>
            </div>
            
            <p className="text-base md:text-lg text-slate-500 font-semibold mt-12 pointer-events-none">
              Draw anywhere to restart
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
