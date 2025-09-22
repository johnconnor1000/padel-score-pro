export interface Team {
  id: string;
  name: string;
  players?: string[];
  color: 'blue' | 'red';
}

export interface Score {
  team1Points: number;
  team2Points: number;
  team1Games: number;
  team2Games: number;
  team1Sets: number;
  team2Sets: number;
}

export interface GameState {
  currentSet: number;
  isFinished: boolean;
  winner: string | null;
  tiebreak: boolean;
  deuce: boolean;
  advantage: string | null;
}

export interface MatchConfig {
  bestOfSets: 3 | 5;
  gameMode: 'traditional' | 'golden-point';
  language: 'es' | 'en';
  mode: 'sensors' | 'judge';
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  score: Score;
  gameState: GameState;
  config: MatchConfig;
  startTime: Date;
  duration: number; // in seconds
  sideChanged: boolean;
}

export interface StatusMessage {
  type: 'point' | 'side-change' | 'set-won' | 'match-won' | 'info';
  text: string;
  countdown?: number;
  visible: boolean;
}