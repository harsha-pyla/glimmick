"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Howl, Howler } from "howler";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// --- Audio Setup ---
let sounds: { [key: string]: Howl } | null = null;
const playSound = (name: "click" | "delete" | "error" | "win") => {
  if (typeof window === "undefined") return;
  if (!sounds) {
    sounds = {
      click: new Howl({ src: ["/sounds/click.wav"], volume: 0.5 }),
      delete: new Howl({ src: ["/sounds/progress.wav"], volume: 0.6 }),
      error: new Howl({ src: ["/sounds/wrong.wav"], volume: 0.5 }),
      win: new Howl({ src: ["/sounds/correct.wav"], volume: 0.7 }),
    };
  }
  if (sounds[name]) sounds[name].play();
};

export function DeleteMeGame() {
  const [level, setLevel] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  // Level 9 specific
  const [isCursorHidden, setIsCursorHidden] = useState(false);
  const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Constants
  const MAX_LEVEL = 10;
  const INSTRUCTION_TEXT = "There is one mistake.";

  // Level Definitions (HARD MODE)
  const levelData = {
    // Level 1: Prime numbers (9 is not prime)
    1: { items: ["2", "3", "5", "7", "9", "11", "13", "17"], targetId: "item-4" }, // 9
    
    // Level 2: Months of the year (Missing July 'J', so August 'A' is out of place)
    2: { items: ["J", "F", "M", "A", "M", "J", "A", "S", "O", "N", "D"], targetId: "item-6" }, // Second 'A' (August)
    
    // Level 3: British vs American spelling
    3: { items: ["Color", "Flavor", "Humor", "Labour", "Armor"], targetId: "item-3" }, // Labour
    
    // Level 4: Extremely subtle character difference (Uppercase I vs lowercase l)
    4: { items: ["lIllI", "lIllI", "lIIIl", "lIllI", "llIll"], targetId: "item-2" }, // lIIIl
    
    // Level 5: The word "Mistake" is literally spelled wrong in the list
    5: { items: ["Error", "Flaw", "Misteak", "Fault", "Glitch"], targetId: "item-2" }, // Misteak
    
    // Level 6: Items are a complex math distraction. The target is the Title "LEVEL 17".
    6: { items: ["x² + y² = z²", "E = mc²", "F = ma", "a² + b² = c²"], targetId: "level-title" },
    
    // Level 7: Items claim everything is fine. Target is the DELETE button itself.
    7: { items: ["No errors here.", "Everything is perfect.", "Look closely.", "Are you sure?"], targetId: "delete-button" },
    
    // Level 8: The target is the website logo text itself (Gllmmick instead of Glimmick)
    8: { items: ["Perfect", "Flawless", "Correct", "Accurate", "Exact"], targetId: "logo" },
    
    // Level 9: Stop moving mouse for 5 seconds to win
    9: { 
      items: [
        "Are you stuck?",
        "Clicking won't help you here.",
        "There is no target on the screen.",
        "The mistake is you trying so hard.",
        "Just let go."
      ], 
      targetId: "cursor" 
    },
    
    // Level 10: Target is the instruction text at the top
    10: { items: ["Apple", "Banana", "Orange", "Car", "Mango"], targetId: "instruction" },
  };

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    if (typeof window !== "undefined") {
      Howler.mute(!newState);
    }
  };

  const handleSelect = (id: string) => {
    if (level > MAX_LEVEL) return;
    playSound("click");
    setSelectedId(id);
  };

  const handleDelete = () => {
    if (level > MAX_LEVEL) return;

    const currentLevelData = levelData[level as keyof typeof levelData];
    const target = currentLevelData.targetId;

    // Special case for Level 7 (Delete button is the target)
    if (level === 7 && (selectedId === "delete-button" || selectedId === null)) {
      passLevel();
      return;
    }

    if (selectedId === target) {
      passLevel();
    } else {
      // Wrong guess
      playSound("error");
      setShakeId(selectedId || "delete-button");
      setTimeout(() => setShakeId(null), 500);
      setSelectedId(null);
    }
  };

  const passLevel = () => {
    playSound("delete");
    setSelectedId(null);
    setIsCursorHidden(false); // Reset cursor on level change
    if (level === MAX_LEVEL) {
      playSound("win");
      setLevel(11); // Win screen
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0f172a', '#3b82f6', '#ef4444', '#10b981']
      });
    } else {
      setLevel((prev) => prev + 1);
    }
  };

  // Level 9: Stop moving mouse for 5 seconds to win (Desktop) OR Two-finger tap (Mobile)
  useEffect(() => {
    if (level !== 9) return;

    if (isTouchDevice) {
      // Mobile: Two-finger tap
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length >= 2) {
          passLevel();
        }
      };
      window.addEventListener("touchstart", handleTouchStart);
      return () => window.removeEventListener("touchstart", handleTouchStart);
    } else {
      // Desktop: Hide mouse by not moving for 5 seconds
      const handleMouseMove = () => {
        setIsCursorHidden(false);
        if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
        cursorTimeoutRef.current = setTimeout(() => {
          setIsCursorHidden(true);
          passLevel();
        }, 5000);
      };
      
      window.addEventListener("mousemove", handleMouseMove);
      handleMouseMove(); // Start timer immediately
      
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, isTouchDevice, passLevel]);

  // Render helpers
  const currentLevelData = level <= MAX_LEVEL ? levelData[level as keyof typeof levelData] : null;

  return (
    <div className={`fixed inset-0 w-screen h-screen bg-paper text-ink font-mono overflow-hidden select-none transition-colors duration-1000 ${isCursorHidden ? 'cursor-none' : 'cursor-default'}`}>
      
      {/* Top Left Navigation (Target for Level 8) */}
      <div className="absolute left-6 top-6 z-20">
        {level === 8 ? (
          <button 
            onClick={() => handleSelect("logo")}
            className={`flex items-center gap-2 text-ink font-bold text-xl tracking-tight transition-all pointer-events-auto px-2 py-1 rounded ${selectedId === "logo" ? "bg-ink text-paper" : "hover:opacity-70"} ${shakeId === "logo" ? "animate-shake border-red-500 text-red-500" : ""}`}
          >
            <Image src="/logo.jpg" alt="Glimmick Logo" width={24} height={24} className="w-6 h-6 rounded shadow-sm border border-ink" />
            Gllmmick
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2 text-ink font-bold text-xl tracking-tight hover:opacity-70 transition-opacity pointer-events-auto px-2 py-1">
            <Image src="/logo.jpg" alt="Glimmick Logo" width={24} height={24} className="w-6 h-6 rounded shadow-sm border border-ink" />
            Glimmick
          </Link>
        )}
      </div>

      {/* Top Right Audio Toggle (Matches Open The Box) */}
      <div className="absolute right-6 top-6 z-20 pointer-events-auto">
        <button onClick={toggleAudio} className="p-2 text-ink hover:opacity-70 transition-opacity" aria-label="Toggle Audio">
          {isAudioEnabled ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 pb-32 px-4 max-w-3xl mx-auto w-full">
        
        {level <= MAX_LEVEL ? (
          <div className="w-full flex flex-col items-center flex-1 justify-center">
            
            {/* Level Title */}
            <div 
              onClick={() => level === 6 && handleSelect("level-title")}
              className={`text-sm tracking-[0.3em] text-ink/50 mb-12 uppercase cursor-default transition-all ${level === 6 ? 'hover:text-ink cursor-pointer p-2 rounded' : ''} ${selectedId === "level-title" ? 'bg-ink text-paper font-bold' : ''} ${shakeId === "level-title" ? 'animate-shake text-red-500' : ''}`}
            >
              {level === 6 ? "LEVEL 17" : `LEVEL ${level}`}
            </div>

            {/* Instruction */}
            <div 
              onClick={() => level === 10 && handleSelect("instruction")}
              className={`text-2xl md:text-3xl font-serif text-ink mb-16 text-center cursor-default transition-all ${level === 10 ? 'hover:text-ink/60 cursor-pointer p-2 rounded' : ''} ${selectedId === "instruction" ? 'bg-ink text-paper' : ''} ${shakeId === "instruction" ? 'animate-shake text-red-500' : ''}`}
            >
              {INSTRUCTION_TEXT}
            </div>

            {/* Items List */}
            <div className={`flex ${level === 9 ? 'flex-col gap-4 w-full max-w-xs' : 'flex-wrap justify-center gap-4 w-full max-w-2xl'}`}>
              {(level === 9 && isTouchDevice ? [
                "Are you stuck?",
                "A single finger won't solve this.",
                "You can't do it alone.",
                "It takes two to tango.",
                "Peace out."
              ] : currentLevelData?.items)?.map((item, idx) => {
                const itemId = `item-${idx}`;
                const isSelected = selectedId === itemId;
                const isShaking = shakeId === itemId;
                
                return (
                  <div
                    key={itemId}
                    onClick={() => handleSelect(itemId)}
                    className={`text-xl md:text-2xl py-3 px-6 rounded-lg text-center cursor-pointer transition-all border-2 flex-grow sm:flex-grow-0
                      ${isSelected ? 'bg-ink text-paper scale-105 shadow-[4px_4px_0_0_#0f172a] border-ink' : 'bg-transparent border-ink/20 hover:border-ink hover:shadow-[4px_4px_0_0_#0f172a] text-ink'}
                      ${isShaking ? 'animate-shake border-red-500 text-red-500' : ''}
                    `}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
            
          </div>
        ) : (
          // WIN SCREEN
          <div className="flex flex-col items-center justify-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-ink mb-6 text-center font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">Document Finished.</h1>
            <p className="text-xl text-ink/60 mb-12 font-bold">You found every mistake.</p>
            <button
              onClick={() => setLevel(1)}
              className="px-8 py-4 bg-transparent border-4 border-ink text-ink font-bold text-xl rounded-full shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#0f172a] active:translate-y-2 active:shadow-[0px_0px_0_0_#0f172a] transition-all"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Giant DELETE Button (Hidden on Win Screen & Level 9) */}
      {level <= MAX_LEVEL && level !== 9 && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center px-4 pointer-events-none">
          <button
            onClick={handleDelete}
            className={`w-full max-w-sm py-5 md:py-6 rounded-2xl font-black text-2xl md:text-3xl tracking-widest transition-all border-4 pointer-events-auto
              ${level === 7 && selectedId === "delete-button" ? 'bg-red-500 text-white border-red-700 shadow-[0_6px_0_0_#991b1b]' : 'bg-[#e5e7eb] border-ink text-ink shadow-[0_8px_0_0_#0f172a] active:shadow-[0_0px_0_0_#0f172a] active:translate-y-2 hover:-translate-y-1 hover:shadow-[0_10px_0_0_#0f172a]'}
              ${shakeId === "delete-button" ? 'animate-shake bg-red-100 text-red-600 border-red-600' : ''}
            `}
          >
            DELETE
          </button>
        </div>
      )}

    </div>
  );
}
