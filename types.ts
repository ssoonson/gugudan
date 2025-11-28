export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface Question {
  dan: number;
  multiplier: number;
  answer: number;
}

export interface GameStats {
  score: number;
  maxDan: number;
  totalQuestions: number;
  correctAnswers: number;
  history: {
    questionIndex: number;
    score: number;
  }[];
}