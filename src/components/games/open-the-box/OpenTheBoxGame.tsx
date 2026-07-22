"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Howl, Howler } from "howler";
import resultImg from "../../../../assets/openthebox/result.png";

let sounds: { [key: string]: Howl } | null = null;
const playSound = (name: 'click' | 'correct' | 'wrong' | 'progress' | 'win') => {
  if (typeof window === "undefined") return;
  if (!sounds) {
    sounds = {
      click: new Howl({ src: ['/sounds/click.wav'], volume: 0.5 }),
      correct: new Howl({ src: ['/sounds/correct.wav'], volume: 0.5 }),
      wrong: new Howl({ src: ['/sounds/wrong.wav'], volume: 0.5 }),
      progress: new Howl({ src: ['/sounds/progress.wav'], volume: 0.3 }),
      win: new Howl({ src: ['/sounds/fahh.mp3'], volume: 0.8 })
    };
  }
  sounds[name].play();
};

export function OpenTheBoxGame() {
  const [level, setLevel] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [input, setInput] = useState("");
  const [patienceProgress, setPatienceProgress] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [mathAnswer, setMathAnswer] = useState("");
  
  // Audio Toggle
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    Howler.mute(!newState);
  };

  // Dynamic Completion
  const [startTime] = useState(() => typeof window !== 'undefined' ? Date.now() : 0);
  const [completionStat, setCompletionStat] = useState("0.8");

  // Shake effect
  const [isShake, setIsShake] = useState(false);

  // Evasive button positions
  const [btnPos, setBtnPos] = useState({ top: "50%", left: "50%" });

  const triggerShake = () => {
    playSound('wrong');
    setIsShake(true);
    setTimeout(() => setIsShake(false), 400);
  };

  const hitBox = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 150);
  };

  // Transition state
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextLevel = React.useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (level < 8) {
      playSound('correct');
    } else if (level === 8) {
      playSound('win');
    }
    
    if (level === 8) {
      const elapsed = (Date.now() - startTime) / 1000;
      let calc = (elapsed / 8) + (Math.random() * 0.5);
      calc = Math.max(0.1, Math.min(99.9, calc));
      setCompletionStat(calc.toFixed(1));
    }

    setTimeout(() => {
      setLevel((l) => l + 1);
      setInput("");
      setClicks(0);
      setMathAnswer("");
      setPatienceProgress(0);
      setHoldProgress(0);
      setBtnPos({ top: "50%", left: "50%" });
      setIsTransitioning(false);
    }, 500); // 500ms delay before next challenge appears
  }, [level, startTime, isTransitioning]);

  // Challenge 4: Patience (5 seconds of doing nothing)
  useEffect(() => {
    if (level !== 4) return;
    
    const resetPatience = () => {
      setPatienceProgress(0);
    };

    window.addEventListener('mousemove', resetPatience);
    window.addEventListener('keydown', resetPatience);
    window.addEventListener('click', resetPatience);

    const interval = setInterval(() => {
      setPatienceProgress((p) => {
        const next = p + 2;
        if (next >= 100) {
          setTimeout(nextLevel, 0);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => {
      window.removeEventListener('mousemove', resetPatience);
      window.removeEventListener('keydown', resetPatience);
      window.removeEventListener('click', resetPatience);
      clearInterval(interval);
    };
  }, [level, nextLevel]);

  // Challenge 5: Window resize
  useEffect(() => {
    if (level !== 5) return;
    const handleResize = () => nextLevel();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [level, nextLevel]);

  // Challenge 7: Hold button (3 seconds)
  useEffect(() => {
    if (level !== 7) return;
    
    let interval: NodeJS.Timeout;
    if (holdProgress > 0) {
      interval = setInterval(() => {
        setHoldProgress((p) => {
          const next = p + 3.33;
          if (next >= 100) {
            setTimeout(nextLevel, 0);
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [holdProgress, level, nextLevel]);

  // Level 2 mobile elusive button
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (level === 2 && isTouchDevice) {
      const interval = setInterval(() => {
        setBtnPos({
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
        });
      }, 500); // Darts around every 500ms
      return () => clearInterval(interval);
    }
  }, [level, isTouchDevice]);

  const renderBox = () => {
    const getBoxState = () => {
      if (level === 0) return "scale-100 rotate-0";
      if (level === 1) return ""; // Handled by inline style for smooth scaling
      if (level < 3) return "scale-105 rotate-1";
      if (level < 6) return "scale-110 -rotate-2 drop-shadow-2xl";
      if (level < 9) return "scale-105 rotate-3 drop-shadow-sm";
      return "scale-125 opacity-70";
    };

    const boxInlineStyle = level === 1 ? { transform: `scale(${1 + clicks/150}) rotate(${clicks % 2 === 0 ? 2 : -2}deg)` } : {};

    return (
      <div 
        className={`w-40 h-40 md:w-56 md:h-56 flex items-center justify-center transition-all duration-300 mx-auto touch-manipulation ${getBoxState()} ${isShake ? 'animate-shake' : ''}`}
        style={boxInlineStyle}
      >
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
          {/* Main Box Body */}
          <path d="M21 7.5L12 2.5L3 7.5V16.5L12 21.5L21 16.5V7.5Z" fill="#c18a59" stroke="#5c4033" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M12 21.5V12" stroke="#5c4033" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M3 7.5L12 12L21 7.5" stroke="#5c4033" strokeWidth="1.5" strokeLinejoin="round"/>
          {/* Lock / Keyhole */}
          <circle cx="16.5" cy="14" r="0.8" fill="#5c4033" />
          <path d="M16.1 14.5 L16.3 15.5 L16.7 15.5 L16.9 14.5 Z" fill="#5c4033" />
          
          {/* Heavy Cracks accumulating during Level 1 and staying forever */}
          {(level > 1 || (level === 1 && clicks > 10)) && (
            <path d="M5 16.5 L7.5 15 L6.5 13 L9 11.5" stroke="#5c4033" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {(level > 1 || (level === 1 && clicks > 20)) && (
            <path d="M20 14.5 L18 16 L17.5 18.5" stroke="#5c4033" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {(level > 1 || (level === 1 && clicks > 30)) && (
            <path d="M7 5.5 L9.5 7 L8.5 9 L11.5 9.5" stroke="#5c4033" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {(level > 1 || (level === 1 && clicks > 40)) && (
            <path d="M16 19.5 L15 17.5 L16.5 15.5" stroke="#5c4033" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Additional massive cracks appearing in later levels */}
          {level > 3 && (
            <path d="M17 5 L14 7.5 L15 10 L12.5 11.5" stroke="#5c4033" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {level > 5 && (
            <path d="M3 11 L6 9.5 L5 13 L8 14.5" stroke="#5c4033" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {level > 7 && (
            <path d="M11 12.5 L9 14.5 L10.5 17" stroke="#5c4033" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {level > 8 && (
            <path d="M4 18 L6.5 19.5 L8 17.5" stroke="#5c4033" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {level > 8 && (
            <path d="M13.5 12.5 L15 11 L18 11.5" stroke="#5c4033" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </div>
    );
  };

  const renderChallengeUI = () => {
    switch (level) {
      case 0:
        return (
          <button 
            onClick={() => {
              playSound('click');
              nextLevel();
            }}
            className="mt-12 px-8 py-3 border-2 border-ink hover:bg-ink hover:text-paper font-bold transition-colors"
          >
            Start
          </button>
        );
      
      case 1:
        return (
          <div className="mt-12 flex flex-col items-center">
            <button 
              onClick={() => {
                if (isTransitioning) return;
                playSound('click');
                hitBox();
                const newClicks = clicks + 1;
                setClicks(newClicks);
                if (newClicks >= 50) nextLevel();
              }}
              className={`px-8 py-3 border-2 border-ink font-bold touch-manipulation select-none ${isTransitioning ? 'opacity-50' : 'active:scale-95 transition-transform hover:bg-ink hover:text-paper'}`}
            >
              Click me 50 times
            </button>
            <div className="w-64 h-1 bg-ink/20 mt-4 overflow-hidden">
              <div className="h-full bg-ink/50 transition-all" style={{ width: `${(clicks / 50) * 100}%` }} />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="mt-12 relative w-full h-56 md:h-40">
            <button
              onClick={() => {
                playSound('click');
                nextLevel();
              }}
              onMouseEnter={() => {
                if (isTouchDevice) return; // Handled by interval on mobile
                playSound('progress');
                setBtnPos({
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`,
                });
              }}
              style={{ position: 'absolute', top: btnPos.top, left: btnPos.left, transform: 'translate(-50%, -50%)' }}
              className="px-6 py-2 border-2 border-ink hover:bg-ink hover:text-paper font-bold transition-all duration-300 ease-in-out whitespace-nowrap touch-manipulation select-none"
            >
              Catch me
            </button>
          </div>
        );
      
      case 3:
        return (
          <div className="mt-12 flex flex-col items-center">
            <p className="text-sm mb-4">Type &quot;open the box&quot; backwards</p>
            <input 
              type="text" 
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (e.target.value.toLowerCase() === "xob eht nepo") {
                  nextLevel();
                }
              }}
              className="bg-transparent border-b-2 border-ink text-center py-2 outline-none text-xl w-64"
              autoFocus
            />
          </div>
        );

      case 4:
        return (
          <div className="mt-12 flex flex-col items-center">
            <p className="text-sm mb-6 text-ink/70">Do absolutely nothing.</p>
            <div className="w-72 h-1 bg-ink/20 mt-2">
              <div className="h-full bg-ink/50 transition-all duration-100" style={{ width: `${patienceProgress}%` }} />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="mt-12 text-center">
            <p className="text-lg">Resize your browser window.</p>
          </div>
        );

      case 6:
        return (
          <div className="mt-12 flex flex-col items-center">
            <p className="text-xl mb-4 font-bold">15 × 6 = ?</p>
            <input 
              type="text" 
              value={mathAnswer}
              onChange={(e) => {
                setMathAnswer(e.target.value);
                if (e.target.value === "90") {
                  nextLevel();
                } else if (e.target.value.length >= 2) {
                  triggerShake();
                  setMathAnswer("");
                }
              }}
              className="bg-transparent border-b-2 border-ink text-center py-2 outline-none text-2xl w-24"
              maxLength={3}
              autoFocus
            />
          </div>
        );

      case 7:
        return (
          <div className="mt-12 flex flex-col items-center select-none">
            <button 
              onMouseDown={() => { playSound('progress'); setHoldProgress(1); }}
              onMouseUp={() => {
                if (holdProgress < 100) setHoldProgress(0);
              }}
              onMouseLeave={() => setHoldProgress(0)}
              onTouchStart={() => { playSound('progress'); setHoldProgress(1); }}
              onTouchEnd={() => {
                if (holdProgress < 100) setHoldProgress(0);
              }}
              className={`px-8 py-3 border-2 border-ink font-bold transition-all ${holdProgress > 0 ? 'bg-ink text-paper scale-95' : 'hover:bg-ink/10'}`}
            >
              Hold for 3 seconds
            </button>
            <div className="w-72 h-1 bg-ink/20 mt-6 overflow-hidden">
              <div className="h-full bg-ink/50" style={{ width: `${holdProgress}%` }} />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="mt-12 flex flex-col items-center">
            <p className="text-sm mb-4">What year is it?</p>
            <input 
              type="text" 
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (e.target.value === new Date().getFullYear().toString()) {
                  nextLevel();
                } else if (e.target.value.length === 4) {
                  triggerShake();
                  setInput("");
                }
              }}
              className="bg-transparent border-b-2 border-ink text-center py-2 outline-none text-xl w-32 tracking-widest"
              maxLength={4}
              autoFocus
            />
          </div>
        );

      default:
        return null;
    }
  };

  const shareResult = async () => {
    const shareData = {
      title: "Open The Box",
      text: `I opened the box! Completion: ${completionStat}%. Can you?`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

  if (level === 9) {
    return (
      <div className="min-h-screen w-full bg-paper flex flex-col items-center justify-center p-4 font-mono relative">
        <div className="absolute top-6 left-6 z-10">
          <Link href="/" className="flex items-center gap-2 text-ink font-bold text-xl tracking-tight hover:opacity-70 transition-opacity">
            <Image src="/logo.jpg" alt="Glimmick Logo" width={24} height={24} className="w-6 h-6 rounded shadow-sm border border-ink" />
            Glimmick
          </Link>
        </div>
        
        <div className="text-center animate-fade-in">
          <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mx-auto mb-8 relative">
            <Image 
              src={resultImg} 
              alt="The Opened Box" 
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
          
          <h1 className="text-3xl font-bold text-ink mb-2 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">You opened the box!</h1>
          <p className="text-ink/60 mb-8 font-bold">Completion: {completionStat}%</p>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setLevel(0)}
              className="px-6 py-2 border-2 border-ink text-ink font-bold hover:bg-ink hover:text-paper transition-colors touch-manipulation"
            >
              Play Again
            </button>
            <button 
              onClick={shareResult}
              className="px-6 py-2 bg-ink text-paper font-bold hover:bg-ink/80 transition-colors touch-manipulation"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-paper flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
      {/* Top Left Navigation */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center gap-2 text-ink font-bold text-xl tracking-tight hover:opacity-70 transition-opacity">
          <Image src="/logo.jpg" alt="Glimmick Logo" width={24} height={24} className="w-6 h-6 rounded shadow-sm border border-ink" />
          Glimmick
        </Link>
      </div>

      {/* Title */}
      <div className="absolute top-16 md:top-6 w-full text-center pointer-events-none z-0">
        <h2 className="text-2xl font-bold text-ink tracking-tighter uppercase font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">Open The Box</h2>
      </div>

      {/* Top Right Audio Toggle */}
      <div className="absolute top-6 right-6 z-10">
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

      {/* Main Game Area */}
      <div className="w-full max-w-lg flex flex-col items-center justify-center z-10 mt-10">
        {renderBox()}
        <div className="min-h-[200px] w-full flex items-center justify-center">
          {renderChallengeUI()}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
      `}} />
    </div>
  );
}
