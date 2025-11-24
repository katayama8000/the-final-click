"use client";

import { useState, useEffect } from "react";
import { ref, onValue, runTransaction } from "firebase/database";
import { database } from "./firebase";
import confetti from 'canvas-confetti';

const TOTAL_CLICKS_GOAL = 100000000; // 100 million clicks

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function Home() {
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerEmail, setWinnerEmail] = useState("");
  const [isWinnerDeclared, setIsWinnerDeclared] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isConfettiShown, setIsConfettiShown] = useState(false);

  useEffect(() => {
    const clickRef = ref(database, 'clicks');
    const winnerRef = ref(database, 'winner');

    const unsubscribeClicks = onValue(clickRef, (snapshot) => {
      const currentCount = snapshot.val()?.count || 0;
      setClickCount(currentCount);
      if (currentCount >= TOTAL_CLICKS_GOAL && !isWinnerDeclared) {
        setIsGoalReached(true);
        setShowWinnerModal(true);
      }
      setIsLoading(false);
    }, (error) => {
      // Production: log to an error reporting service
      setIsLoading(false);
    });

    const unsubscribeWinner = onValue(winnerRef, (snapshot) => {
      if (snapshot.exists()) {
        setIsWinnerDeclared(true);
        setShowWinnerModal(false);
      }
    }, (error) => {
      // Production: log to an error reporting service
    });

    if (isGoalReached && !isConfettiShown) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
      setIsConfettiShown(true);
    }

    return () => {
      unsubscribeClicks();
      unsubscribeWinner();
    };
  }, [isGoalReached, isConfettiShown, isWinnerDeclared]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isGoalReached) {
      return;
    }

    const newParticle = {
      id: Date.now(),
      x: e.clientX + (Math.random() - 0.5) * 40,
      y: e.clientY - 50,
    };
    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1500);

    const clickRef = ref(database, 'clicks');
    runTransaction(clickRef, (currentData) => {
      if (currentData === null || typeof currentData.count !== 'number') {
        return { count: 1 };
      }
      if (currentData.count < TOTAL_CLICKS_GOAL) {
        currentData.count++;
      }
      return currentData;
    }).catch((error) => {
      // Production: log to an error reporting service
    });
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!winnerEmail) return;

    const winnerRef = ref(database, 'winner');
    runTransaction(winnerRef, (currentData) => {
      if (currentData === null) {
        return { email: winnerEmail, timestamp: Date.now() };
      }
      return;
    }).then(() => {
        setEmailSubmitted(true);
        setShowWinnerModal(false);
    }).catch((error) => {
      // Production: log to an error reporting service
    });
  };

  const remainingClicks = TOTAL_CLICKS_GOAL - clickCount;
  const progressPercentage = (clickCount / TOTAL_CLICKS_GOAL) * 100;

  return (
    <div className="overflow-hidden flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-8">
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-700 z-50">
        <div 
          className="h-full bg-cyan-400 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {particles.map(p => (
        <span 
          key={p.id}
          className="absolute text-cyan-400 font-bold text-2xl animate-float-up select-none"
          style={{ left: p.x, top: p.y }}
        >
          +1
        </span>
      ))}

      <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 sm:mb-4 text-center drop-shadow-lg tracking-wider z-10">The Final Click</h1>
      <p className="text-base sm:text-lg text-center mb-6 sm:mb-10 text-gray-300 animate-pulse z-10">Click the button! The last one to make it zero wins $500!</p>

      <p className="text-lg sm:text-xl mb-2 sm:mb-4 text-gray-400 z-10">Clicks Remaining</p>
      <div className="text-6xl sm:text-8xl font-mono font-bold mb-8 sm:mb-12 text-cyan-400 drop-shadow-xl tabular-nums z-10 h-28 flex items-center justify-center">
        {isLoading ? (
          <div className="animate-spin rounded-full h-20 sm:h-24 w-20 sm:w-24 border-t-4 border-b-4 border-cyan-400"></div>
        ) : (
          remainingClicks > 0 ? remainingClicks.toLocaleString() : 0
        )}
      </div>

      <button
        onClick={handleClick}
        disabled={isGoalReached || isWinnerDeclared}
        className={`relative flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full transition-all duration-200 ease-in-out transform shadow-2xl overflow-hidden z-10
          ${isGoalReached || isWinnerDeclared ? 'bg-gray-700 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 hover:scale-105'}
        `}
      >
        {!(isGoalReached || isWinnerDeclared) && <span className="absolute inset-0 bg-cyan-500 opacity-25 animate-ping-slow rounded-full"></span>}
        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold select-none z-10">
          {isGoalReached || isWinnerDeclared ? 'GOAL!' : 'CLICK ME!'}
        </span>
      </button>

      {showWinnerModal && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 sm:p-10 rounded-lg shadow-xl text-center max-w-sm w-full">
            <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-4">Congratulations!</h2>
            <p className="text-base sm:text-lg mb-6">You are the final clicker! Please enter your email to claim your prize.</p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={winnerEmail}
                onChange={(e) => setWinnerEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4"
                required
              />
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                Claim Prize
              </button>
            </form>
          </div>
        </div>
      )}

      {emailSubmitted && (
         <p className="mt-8 text-2xl sm:text-3xl font-bold text-green-400 z-10">Thank you! We will contact you shortly.</p>
      )}

      <style jsx>{`
        @keyframes ping-slow {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 3s infinite;
        }
        @keyframes float-up {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}