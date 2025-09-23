import React, { useEffect, useState } from 'react';
import { Match, StatusMessage } from '@/types/padel';
import { Clock } from 'lucide-react';

interface TVScoreboardProps {
  match: Match;
  statusMessage: StatusMessage;
  showVictoryScreen: boolean;
  getScoreDisplay: (points: number, isDeuce: boolean, advantage: string | null, teamId: string) => string;
}

const TVScoreboard = ({ match, statusMessage, showVictoryScreen, getScoreDisplay }: TVScoreboardProps) => {
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
    <div className="min-h-screen bg-gradient-to-r from-background via-muted/20 to-background flex flex-col">
      {/* Header Bar */}
      <div className="h-16 bg-gradient-to-r from-court-surface/90 to-court-surface/90 backdrop-blur-sm flex items-center justify-between px-8">
        <div className="flex items-center gap-3 text-foreground/90">
          <Clock size={28} className="text-padel-primary" />
          <span className="tv-header-info">{formatTime(matchDuration)}</span>
        </div>
        <div className="text-center">
          <div className="tv-header-info text-padel-primary font-black">Set {match.gameState.currentSet}</div>
          <div className="text-sm md:text-base text-foreground/70 uppercase tracking-wider font-medium">
            {match.config.gameMode === 'golden-point' ? 'Punto de Oro' : 'Tradicional'}
          </div>
        </div>
        <div className="w-32"></div> {/* Spacer for balance */}
      </div>

      {/* Main Scoreboard - Full Screen */}
      <div className="flex-1 flex">
        {/* Team 1 Side - Blue */}
        <div className="flex-1 bg-gradient-to-br from-team-blue/10 via-team-blue/5 to-transparent flex flex-col justify-center items-center relative">
          {/* Team Info */}
          <div className="absolute top-8 left-8 right-8">
            <div className="bg-team-blue/20 backdrop-blur-sm rounded-3xl p-6 text-center border border-team-blue/30">
              <h2 className="tv-team-info text-team-blue mb-2">{match.team1.name}</h2>
              {match.team1.players && (
                <div className="text-xl md:text-2xl lg:text-3xl text-team-blue/80">
                  {match.team1.players.join(' / ')}
                </div>
              )}
            </div>
          </div>

          {/* Main Score - HUGE */}
          <div className="text-center">
            <div className="team-score text-team-blue drop-shadow-2xl">
              {getScoreDisplay(
                match.score.team1Points,
                match.gameState.deuce,
                match.gameState.advantage,
                match.team1.id
              )}
            </div>
          </div>

          {/* Sets and Games */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-team-blue/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-team-blue/30">
                <div className="tv-sets-games text-team-blue">{match.score.team1Sets}</div>
                <div className="text-xl md:text-2xl text-team-blue/80 font-medium mt-2">SETS</div>
              </div>
              <div className="bg-team-blue/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-team-blue/30">
                <div className="tv-sets-games text-team-blue">{match.score.team1Games}</div>
                <div className="text-xl md:text-2xl text-team-blue/80 font-medium mt-2">GAMES</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Divider */}
        <div className="w-2 bg-gradient-to-b from-padel-primary/20 via-padel-primary to-padel-primary/20 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-padel-primary/30 to-transparent"></div>
          <div className="bg-padel-primary/90 backdrop-blur-sm rounded-full p-4 z-10">
            <div className="text-2xl font-black text-white">VS</div>
          </div>
        </div>

        {/* Team 2 Side - Red */}
        <div className="flex-1 bg-gradient-to-bl from-team-red/10 via-team-red/5 to-transparent flex flex-col justify-center items-center relative">
          {/* Team Info */}
          <div className="absolute top-8 left-8 right-8">
            <div className="bg-team-red/20 backdrop-blur-sm rounded-3xl p-6 text-center border border-team-red/30">
              <h2 className="tv-team-info text-team-red mb-2">{match.team2.name}</h2>
              {match.team2.players && (
                <div className="text-xl md:text-2xl lg:text-3xl text-team-red/80">
                  {match.team2.players.join(' / ')}
                </div>
              )}
            </div>
          </div>

          {/* Main Score - HUGE */}
          <div className="text-center">
            <div className="team-score text-team-red drop-shadow-2xl">
              {getScoreDisplay(
                match.score.team2Points,
                match.gameState.deuce,
                match.gameState.advantage,
                match.team2.id
              )}
            </div>
          </div>

          {/* Sets and Games */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-team-red/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-team-red/30">
                <div className="tv-sets-games text-team-red">{match.score.team2Sets}</div>
                <div className="text-xl md:text-2xl text-team-red/80 font-medium mt-2">SETS</div>
              </div>
              <div className="bg-team-red/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-team-red/30">
                <div className="tv-sets-games text-team-red">{match.score.team2Games}</div>
                <div className="text-xl md:text-2xl text-team-red/80 font-medium mt-2">GAMES</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game State Indicators - Floating */}
      {(match.gameState.tiebreak || match.gameState.deuce) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          {match.gameState.tiebreak && (
            <div className="tv-floating-indicator bg-warning backdrop-blur-sm border border-warning/30 text-white">
              TIE-BREAK
            </div>
          )}
          {match.gameState.deuce && !match.gameState.tiebreak && (
            <div className="tv-deuce-indicator bg-info backdrop-blur-sm border border-info/30 text-white">
              DEUCE
            </div>
          )}
        </div>
      )}

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
      {showVictoryScreen && match && (
        <div className="fixed inset-0 bg-gradient-to-br from-padel-primary to-padel-secondary flex items-center justify-center z-50">
          <div className="text-center text-white celebration">
            <h1 className="font-display text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-8">
              ¡{match.gameState.winner === match.team1.id ? match.team1.name : match.team2.name} GANÓ!
            </h1>
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-8">
              {match.score.team1Sets} - {match.score.team2Sets}
            </div>
            <div className="text-lg md:text-xl lg:text-2xl opacity-90 mb-4">
              Tiempo total: {formatTime(matchDuration)}
            </div>
            <div className="text-sm md:text-base opacity-70">
              Volviendo a configuración en 60 segundos...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TVScoreboard;