import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Match } from '@/types/padel';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface JudgePanelProps {
  match: Match;
  addPoint: (teamId: string) => void;
  undoLastPoint: () => void;
  getScoreDisplay: (points: number, isDeuce: boolean, advantage: string | null, teamId: string) => string;
}

const JudgePanel = ({ match, addPoint, undoLastPoint, getScoreDisplay }: JudgePanelProps) => {
  if (!match) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-padel-accent to-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-padel-primary mb-2">
            Panel de Juez
          </h1>
          <p className="text-score-secondary">Registra puntos manualmente</p>
        </div>

        {/* Current Score Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Marcador Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              
              {/* Team 1 Score */}
              <div className="space-y-2">
                <h3 className="font-semibold text-team-blue">{match.team1.name}</h3>
                <div className="text-4xl font-score text-team-blue">
                  {getScoreDisplay(
                    match.score.team1Points,
                    match.gameState.deuce,
                    match.gameState.advantage,
                    match.team1.id
                  )}
                </div>
                <div className="text-sm text-score-secondary">
                  Games: {match.score.team1Games} | Sets: {match.score.team1Sets}
                </div>
              </div>

              {/* Team 2 Score */}
              <div className="space-y-2">
                <h3 className="font-semibold text-team-red">{match.team2.name}</h3>
                <div className="text-4xl font-score text-team-red">
                  {getScoreDisplay(
                    match.score.team2Points,
                    match.gameState.deuce,
                    match.gameState.advantage,
                    match.team2.id
                  )}
                </div>
                <div className="text-sm text-score-secondary">
                  Games: {match.score.team2Games} | Sets: {match.score.team2Sets}
                </div>
              </div>
            </div>

            {/* Game State */}
            <div className="mt-4 text-center">
              <div className="text-sm text-score-secondary">
                Set {match.gameState.currentSet} • {match.config.gameMode === 'golden-point' ? 'Punto de Oro' : 'Tradicional'}
              </div>
              {match.gameState.tiebreak && (
                <div className="mt-2 bg-warning text-white px-3 py-1 rounded-full text-sm font-bold">
                  TIE-BREAK
                </div>
              )}
              {match.gameState.deuce && !match.gameState.tiebreak && (
                <div className="mt-2 bg-info text-white px-3 py-1 rounded-full text-sm font-bold">
                  DEUCE
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Point Controls */}
        <div className="space-y-4">
          
          {/* Team 1 Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-team-blue">{match.team1.name}</span>
                <Button
                  onClick={() => addPoint(match.team1.id)}
                  className="bg-team-blue hover:bg-team-blue/90 text-white px-8 py-6 text-lg"
                  disabled={match.gameState.isFinished}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Punto
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team 2 Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-team-red">{match.team2.name}</span>
                <Button
                  onClick={() => addPoint(match.team2.id)}
                  className="bg-team-red hover:bg-team-red/90 text-white px-8 py-6 text-lg"
                  disabled={match.gameState.isFinished}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Punto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Undo Control */}
        <Button
          onClick={undoLastPoint}
          variant="outline"
          className="w-full py-6 text-lg border-padel-primary text-padel-primary hover:bg-padel-primary hover:text-white"
          disabled={match.gameState.isFinished}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Deshacer Último Punto
        </Button>

        {/* Match Status */}
        {match.gameState.isFinished && (
          <Card className="bg-padel-primary text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">¡Partido Finalizado!</h3>
              <p className="text-lg">
                Ganó: {match.gameState.winner === match.team1.id ? match.team1.name : match.team2.name}
              </p>
              <p className="text-padel-accent">
                Resultado: {match.score.team1Sets} - {match.score.team2Sets}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-score-secondary space-y-1">
          <p>• Toca "Punto" para registrar puntos</p>
          <p>• El marcador de TV se actualiza automáticamente</p>
          <p>• Usa "Deshacer" para corregir errores</p>
        </div>
      </div>
    </div>
  );
};

export default JudgePanel;