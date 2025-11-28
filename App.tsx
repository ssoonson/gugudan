import React, { useState, useEffect } from 'react';
import { GameState, GameStats } from './types';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [highScore, setHighScore] = useState(0);
  const [lastStats, setLastStats] = useState<GameStats | null>(null);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('gugudan-highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  const handleStart = () => {
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (stats: GameStats) => {
    if (stats.score > highScore) {
      setHighScore(stats.score);
      localStorage.setItem('gugudan-highscore', stats.score.toString());
    }
    setLastStats(stats);
    setGameState(GameState.GAME_OVER);
  };

  const handleRestart = () => {
    setGameState(GameState.MENU);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="w-full max-w-lg h-[100dvh] md:h-[800px] bg-slate-50 md:bg-white md:rounded-[40px] md:shadow-2xl overflow-hidden relative border-0 md:border-8 md:border-slate-800">
        
        {/* Mobile Background decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

        <main className="h-full relative z-10">
          {gameState === GameState.MENU && (
            <StartScreen onStart={handleStart} highScore={highScore} />
          )}
          {gameState === GameState.PLAYING && (
            <GameScreen onGameOver={handleGameOver} />
          )}
          {gameState === GameState.GAME_OVER && lastStats && (
            <ResultScreen 
              stats={lastStats} 
              onRestart={handleRestart} 
              isNewHighScore={lastStats.score === highScore && lastStats.score > 0} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;