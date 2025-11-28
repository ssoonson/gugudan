import React from 'react';
import { GameStats } from '../types';
import { Button } from './Button';
import { RotateCcw, Trophy, Target, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultScreenProps {
  stats: GameStats;
  onRestart: () => void;
  isNewHighScore: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ stats, onRestart, isNewHighScore }) => {
  return (
    <div className="flex flex-col h-full p-6 animate-fade-in overflow-y-auto">
      <div className="text-center mt-4 mb-8">
        <h2 className="text-3xl font-jua text-slate-800 mb-2">게임 종료!</h2>
        <p className="text-slate-500">수고하셨습니다</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-50 mb-6 relative overflow-hidden">
        {isNewHighScore && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">
            NEW RECORD!
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">최종 점수</span>
          <span className="text-5xl font-jua text-indigo-600 drop-shadow-sm">
            {stats.score.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-1">
              <Trophy className="w-3 h-3" />
              <span>최고 레벨</span>
            </div>
            <span className="text-xl font-bold text-slate-700">{stats.maxDan}단</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-1">
              <Target className="w-3 h-3" />
              <span>정답률</span>
            </div>
            <span className="text-xl font-bold text-slate-700">
              {stats.totalQuestions > 0 
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
                : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-100 flex-1 min-h-[200px] mb-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-700">점수 성장 그래프</h3>
        </div>
        <div className="flex-1 w-full min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.history}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="questionIndex" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Button onClick={onRestart} size="lg" className="w-full flex items-center justify-center gap-2">
        <RotateCcw className="w-5 h-5" />
        다시 도전하기
      </Button>
    </div>
  );
};