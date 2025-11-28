import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Star, ChevronRight, Delete, CheckCircle, XCircle } from 'lucide-react';
import { Question, GameStats } from '../types';
import { Button } from './Button';

interface GameScreenProps {
  onGameOver: (stats: GameStats) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [currentDan, setCurrentDan] = useState(2);
  const [progressInDan, setProgressInDan] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [history, setHistory] = useState<{questionIndex: number, score: number}[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Constants
  const QUESTIONS_TO_ADVANCE = 5;

  const generateQuestion = useCallback((dan: number) => {
    const multiplier = Math.floor(Math.random() * 9) + 1; // 1 to 9
    return {
      dan,
      multiplier,
      answer: dan * multiplier
    };
  }, []);

  // Initial Start
  useEffect(() => {
    setQuestion(generateQuestion(currentDan));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleInput = (num: number) => {
    if (feedback !== 'none') return;
    if (userAnswer.length >= 3) return; // Limit length
    setUserAnswer(prev => prev + num.toString());
  };

  const handleDelete = () => {
    if (feedback !== 'none') return;
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const checkAnswer = () => {
    if (!question || userAnswer === '') return;
    
    const numAnswer = parseInt(userAnswer);
    setTotalQuestions(prev => prev + 1);

    if (numAnswer === question.answer) {
      // Correct
      const points = currentDan * 10;
      const newScore = score + points;
      setScore(newScore);
      setHistory(prev => [...prev, { questionIndex: totalQuestions + 1, score: newScore }]);
      setFeedback('correct');
      setCorrectAnswersCount(prev => prev + 1);
      
      // Delay for animation then next question
      setTimeout(() => {
        setFeedback('none');
        setUserAnswer('');
        
        const newProgress = progressInDan + 1;
        if (newProgress >= QUESTIONS_TO_ADVANCE) {
          // Level Up
          setProgressInDan(0);
          setCurrentDan(prev => prev + 1);
          setQuestion(generateQuestion(currentDan + 1));
        } else {
          setProgressInDan(newProgress);
          setQuestion(generateQuestion(currentDan));
        }
      }, 800);

    } else {
      // Wrong
      setFeedback('wrong');
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(() => {
            onGameOver({
              score,
              maxDan: currentDan,
              totalQuestions: totalQuestions + 1,
              correctAnswers: correctAnswersCount,
              history: [...history, { questionIndex: totalQuestions + 1, score }]
            });
          }, 1000);
        } else {
          // Next question after wrong answer? Or retry? 
          // Let's move to next question to prevent stuck.
          setTimeout(() => {
            setFeedback('none');
            setUserAnswer('');
            setQuestion(generateQuestion(currentDan));
          }, 800);
        }
        return newLives;
      });
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (feedback !== 'none') return;
    if (e.key >= '0' && e.key <= '9') {
      handleInput(parseInt(e.key));
    } else if (e.key === 'Backspace') {
      handleDelete();
    } else if (e.key === 'Enter') {
      checkAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, userAnswer, question]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!question) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative">
      {/* Top HUD */}
      <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm rounded-b-3xl shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-xl">
            <span className="font-jua text-indigo-700 text-xl">{currentDan}단</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-bold">SCORE</span>
            <span className="font-jua text-xl text-slate-800 leading-none">{score.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <Heart 
              key={i} 
              className={`w-6 h-6 transition-colors ${i <= lives ? 'fill-rose-500 text-rose-500' : 'fill-slate-200 text-slate-200'}`} 
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mt-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1 font-bold">
          <span>LEVEL PROGRESS</span>
          <span>{progressInDan} / {QUESTIONS_TO_ADVANCE}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${(progressInDan / QUESTIONS_TO_ADVANCE) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className={`relative transition-transform duration-300 ${feedback === 'wrong' ? 'animate-shake' : ''} ${feedback === 'correct' ? 'scale-110' : ''}`}>
          
          {/* Feedback Overlay Icons */}
          {feedback === 'correct' && (
            <div className="absolute inset-0 flex items-center justify-center z-20 animate-bounce">
              <CheckCircle className="w-32 h-32 text-green-500 bg-white rounded-full" />
            </div>
          )}
          {feedback === 'wrong' && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <XCircle className="w-32 h-32 text-rose-500 bg-white rounded-full" />
            </div>
          )}

          <div className="flex items-center gap-4 font-jua text-6xl md:text-7xl text-slate-800">
            <span>{question.dan}</span>
            <span className="text-slate-400">×</span>
            <span>{question.multiplier}</span>
            <span className="text-slate-400">=</span>
            <div className={`
              min-w-[120px] h-20 border-b-4 text-center leading-normal
              ${userAnswer ? 'text-indigo-600 border-indigo-600' : 'text-transparent border-slate-300'}
              ${feedback === 'correct' ? 'text-green-500 border-green-500' : ''}
              ${feedback === 'wrong' ? 'text-rose-500 border-rose-500' : ''}
            `}>
              {userAnswer}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center h-8">
           {feedback === 'correct' && <span className="text-green-600 font-bold text-lg animate-pulse">정답입니다! (+{currentDan * 10}점)</span>}
           {feedback === 'wrong' && <span className="text-rose-500 font-bold text-lg">틀렸습니다! 정답: {question.answer}</span>}
        </div>
      </div>

      {/* Numpad */}
      <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-6 pb-8">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleInput(num)}
              className="h-14 rounded-2xl bg-slate-50 text-2xl font-jua text-slate-700 hover:bg-slate-100 active:bg-slate-200 active:scale-95 transition-all shadow-sm border border-slate-100"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center active:scale-95 transition-all"
          >
            <Delete className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleInput(0)}
            className="h-14 rounded-2xl bg-slate-50 text-2xl font-jua text-slate-700 hover:bg-slate-100 active:bg-slate-200 active:scale-95 transition-all shadow-sm border border-slate-100"
          >
            0
          </button>
          <button
            onClick={checkAnswer}
            disabled={userAnswer === ''}
            className="h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all shadow-indigo-200 shadow-lg disabled:opacity-50 disabled:shadow-none"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};