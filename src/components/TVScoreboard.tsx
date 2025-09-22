import React, { useEffect, useState } from 'react';
import { Match, StatusMessage } from '@/types/padel';
import { Clock } from 'lucide-react';

interface TVScoreboardProps {
  match: Match;
  statusMessage: StatusMessage;
  getScoreDisplay: (points: number, isDeuce: boolean, advantage: string | null, teamId: string) => string;
}

const TVScoreboard = ({ match, statusMessage, getScoreDisplay }: TVScoreboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [matchDuration, setMatchDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (match && !match.gameState.isFinished) {
        const duration = Math.floor((Date.now() - match.startTime.getTime()) / 1000);
        setMatchDuration(duration);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [match]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-padel-primary to-padel-secondary flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="font-display text-6xl font-bold mb-4">Sistema de Puntuación Pádel</h1>
          <p className="text-2xl opacity-90">Esperando configuración...</p>
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-2xl">
            <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-500 text-sm font-medium">Código QR</span>
            </div>
            <p className="mt-4 text-gray-700 font-medium">Escanea para configurar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-court-surface to-background p-8">
      {/* Header with Timer */}
      <div className="flex justify-between items-center mb-8">
        <div className="match-timer flex items-center gap-2">
          <Clock size={24} />
          <span>Tiempo: {formatTime(matchDuration)}</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-score-secondary">Set {match.gameState.currentSet}</div>
          <div className="text-lg font-medium">
            {match.config.gameMode === 'golden-point' ? 'Punto de Oro' : 'Tradicional'}
          </div>
        </div>
      </div>

      {/* Main Scoreboard */}
      <div className="scoreboard-display rounded-3xl p-8 mb-8">
        <div className="grid grid-cols-2 gap-8">
          
          {/* Team 1 */}
          <div className="text-center">
            <div className={`team-indicator-${match.team1.color} rounded-2xl p-6 mb-6`}>
              <h2 className="team-name text-white">{match.team1.name}</h2>
              {match.team1.players && (
                <div className="text-white/90 text-lg mt-2">
                  {match.team1.players.join(' / ')}
                </div>
              )}
            </div>
            
            {/* Current Game Score */}
            <div className="team-score text-team-blue mb-4">
              {getScoreDisplay(
                match.score.team1Points,
                match.gameState.deuce,
                match.gameState.advantage,
                match.team1.id
              )}
            </div>
            
            {/* Games and Sets */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-score-primary">{match.score.team1Games}</div>
                <div className="text-sm text-score-secondary">Games</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-score-primary">{match.score.team1Sets}</div>
                <div className="text-sm text-score-secondary">Sets</div>
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center">
            <div className="text-6xl font-display font-bold text-padel-primary">VS</div>
          </div>

          {/* Team 2 */}
          <div className="text-center">
            <div className={`team-indicator-${match.team2.color} rounded-2xl p-6 mb-6`}>
              <h2 className="team-name text-white">{match.team2.name}</h2>
              {match.team2.players && (
                <div className="text-white/90 text-lg mt-2">
                  {match.team2.players.join(' / ')}
                </div>
              )}
            </div>
            
            {/* Current Game Score */}
            <div className="team-score text-team-red mb-4">
              {getScoreDisplay(
                match.score.team2Points,
                match.gameState.deuce,
                match.gameState.advantage,
                match.team2.id
              )}
            </div>
            
            {/* Games and Sets */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-score-primary">{match.score.team2Games}</div>
                <div className="text-sm text-score-secondary">Games</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-score-primary">{match.score.team2Sets}</div>
                <div className="text-sm text-score-secondary">Sets</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game State Indicators */}
        <div className="mt-8 text-center">
          {match.gameState.tiebreak && (
            <div className="bg-warning text-white px-6 py-3 rounded-full inline-block font-bold text-xl">
              TIE-BREAK
            </div>
          )}
          {match.gameState.deuce && !match.gameState.tiebreak && (
            <div className="bg-info text-white px-6 py-3 rounded-full inline-block font-bold text-xl">
              DEUCE
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {statusMessage.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="status-message text-2xl font-bold max-w-lg">
            {statusMessage.text}
            {statusMessage.countdown && (
              <div className="mt-4 text-6xl font-mono text-padel-primary">
                {statusMessage.countdown}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Match Finished Celebration */}
      {match.gameState.isFinished && (
        <div className="fixed inset-0 bg-gradient-to-br from-padel-primary to-padel-secondary flex items-center justify-center z-50">
          <div className="text-center text-white celebration">
            <h1 className="font-display text-8xl font-bold mb-8">
              ¡{match.gameState.winner === match.team1.id ? match.team1.name : match.team2.name} GANÓ!
            </h1>
            <div className="text-4xl font-bold mb-8">
              {match.score.team1Sets} - {match.score.team2Sets}
            </div>
            <div className="text-2xl opacity-90">
              Tiempo total: {formatTime(matchDuration)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TVScoreboard;