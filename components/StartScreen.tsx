import React from 'react';
import { Play, GraduationCap, Calculator } from 'lucide-react';
import { Button } from './Button';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-6 text-center animate-fade-in">
      <div className="space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-100 p-4 rounded-full">
            <Calculator className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-jua text-indigo-900">
          구구단 마스터
        </h1>
        <p className="text-slate-500 text-lg">
          단수가 올라갈수록 점수도 쑥쑥!
        </p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-indigo-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">최고 점수</span>
          <GraduationCap className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="text-4xl font-black text-slate-800 font-jua">
          {highScore.toLocaleString()} 점
        </div>
      </div>

      <div className="space-y-4 w-full max-w-sm">
        <Button 
          onClick={onStart} 
          size="lg" 
          className="w-full flex items-center justify-center gap-2"
        >
          <Play className="w-6 h-6 fill-current" />
          게임 시작
        </Button>
        
        <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-600 text-left">
          <p className="font-bold mb-1">🎮 게임 규칙:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>2단부터 시작합니다.</li>
            <li>정답을 맞추면 <strong>(현재 단 × 10점)</strong>을 획득합니다.</li>
            <li>5문제를 맞추면 다음 단으로 승급합니다.</li>
            <li>목숨은 3개입니다. 틀리면 깎여요!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};