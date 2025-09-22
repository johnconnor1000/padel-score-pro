import { useState, useEffect, useCallback } from 'react';
import { Match, Score, GameState, MatchConfig, Team, StatusMessage } from '@/types/padel';

const PADEL_POINTS = ['0', '15', '30', '40'];

export const usePadelMatch = (initialConfig: MatchConfig) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    type: 'info',
    text: '',
    visible: false
  });
  const [showVictoryScreen, setShowVictoryScreen] = useState(false);

  // Initialize match
  const startMatch = useCallback((team1: Team, team2: Team) => {
    const newMatch: Match = {
      id: Date.now().toString(),
      team1,
      team2,
      score: {
        team1Points: 0,
        team2Points: 0,
        team1Games: 0,
        team2Games: 0,
        team1Sets: 0,
        team2Sets: 0,
      },
      gameState: {
        currentSet: 1,
        isFinished: false,
        winner: null,
        tiebreak: false,
        deuce: false,
        advantage: null,
      },
      config: initialConfig,
      startTime: new Date(),
      duration: 0,
      sideChanged: false,
    };
    setMatch(newMatch);
  }, [initialConfig]);

  // Get formatted score display
  const getScoreDisplay = useCallback((points: number, isDeuce: boolean, advantage: string | null, teamId: string) => {
    if (match?.gameState.tiebreak) {
      return points.toString();
    }
    
    if (isDeuce) {
      if (advantage === teamId) return 'AD';
      if (advantage && advantage !== teamId) return '40';
      return '40';
    }
    
    if (points >= 3 && !isDeuce) return '40';
    return PADEL_POINTS[points] || '0';
  }, [match]);

  // Add point to team
  const addPoint = useCallback((teamId: string) => {
    if (!match || match.gameState.isFinished) return;

    setMatch(prevMatch => {
      if (!prevMatch) return null;
      
      const newMatch = { ...prevMatch };
      const isTeam1 = teamId === newMatch.team1.id;
      
      // Show point message
      setStatusMessage({
        type: 'point',
        text: isTeam1 ? `Punto para ${newMatch.team1.name}` : `Punto para ${newMatch.team2.name}`,
        visible: true
      });
      
      setTimeout(() => {
        setStatusMessage(prev => ({ ...prev, visible: false }));
      }, 2000);

      // Add point logic
      if (isTeam1) {
        newMatch.score.team1Points++;
      } else {
        newMatch.score.team2Points++;
      }

      // Check game won logic
      const { team1Points, team2Points } = newMatch.score;
      
      if (newMatch.gameState.tiebreak) {
        // Tiebreak logic
        const minScore = 7;
        const diff = Math.abs(team1Points - team2Points);
        
        if ((team1Points >= minScore || team2Points >= minScore) && diff >= 2) {
          // Tiebreak won
          if (team1Points > team2Points) {
            newMatch.score.team1Games++;
          } else {
            newMatch.score.team2Games++;
          }
          
          // Reset tiebreak
          newMatch.score.team1Points = 0;
          newMatch.score.team2Points = 0;
          newMatch.gameState.tiebreak = false;
          
          // Check set won
          checkSetWon(newMatch);
        }
      } else {
        // Regular game logic
        if (newMatch.config.gameMode === 'golden-point') {
          // Golden point: at deuce (40-40), next point wins immediately
          if (team1Points >= 3 && team2Points >= 3) {
            if (team1Points === team2Points) {
              // Deuce state (both have same points, 3 or more)
              newMatch.gameState.deuce = true;
              newMatch.gameState.advantage = null;
            } else {
              // One team has more points after deuce - they win the game immediately (golden point)
              if (team1Points > team2Points) {
                newMatch.score.team1Games++;
              } else {
                newMatch.score.team2Games++;
              }
              
              newMatch.score.team1Points = 0;
              newMatch.score.team2Points = 0;
              newMatch.gameState.deuce = false;
              newMatch.gameState.advantage = null;
              
              checkSetWon(newMatch);
            }
          } else if (team1Points >= 4 || team2Points >= 4) {
            // Game won (one team has 4+ and other has less than 3)
            if (team1Points > team2Points) {
              newMatch.score.team1Games++;
            } else {
              newMatch.score.team2Games++;
            }
            
            newMatch.score.team1Points = 0;
            newMatch.score.team2Points = 0;
            newMatch.gameState.deuce = false;
            newMatch.gameState.advantage = null;
            
            checkSetWon(newMatch);
          }
        } else {
          // Traditional with advantage
          if (team1Points >= 3 && team2Points >= 3) {
            const diff = Math.abs(team1Points - team2Points);
            
            if (diff === 0) {
              newMatch.gameState.deuce = true;
              newMatch.gameState.advantage = null;
            } else if (diff === 1) {
              newMatch.gameState.deuce = true;
              newMatch.gameState.advantage = team1Points > team2Points ? newMatch.team1.id : newMatch.team2.id;
            } else if (diff >= 2) {
              // Game won
              if (team1Points > team2Points) {
                newMatch.score.team1Games++;
              } else {
                newMatch.score.team2Games++;
              }
              
              newMatch.score.team1Points = 0;
              newMatch.score.team2Points = 0;
              newMatch.gameState.deuce = false;
              newMatch.gameState.advantage = null;
              
              checkSetWon(newMatch);
            }
          } else if (team1Points >= 4 || team2Points >= 4) {
            // Game won (one team has 4+ and other has less than 3)
            if (team1Points > team2Points) {
              newMatch.score.team1Games++;
            } else {
              newMatch.score.team2Games++;
            }
            
            newMatch.score.team1Points = 0;
            newMatch.score.team2Points = 0;
            
            checkSetWon(newMatch);
          }
        }
      }
      
      return newMatch;
    });
  }, [match]);

  // Check if set is won
  const checkSetWon = (match: Match) => {
    const { team1Games, team2Games } = match.score;
    const diff = Math.abs(team1Games - team2Games);
    
    // Check for 6-6 tiebreak
    if (team1Games === 6 && team2Games === 6) {
      match.gameState.tiebreak = true;
      return;
    }
    
    // Check set won (6+ games with 2+ difference, or 7+ games)
    if ((team1Games >= 6 || team2Games >= 6) && diff >= 2) {
      if (team1Games > team2Games) {
        match.score.team1Sets++;
      } else {
        match.score.team2Sets++;
      }
      
      // Reset games
      match.score.team1Games = 0;
      match.score.team2Games = 0;
      match.gameState.currentSet++;
      
      // Check side change (odd games total in new set)
      const totalGames = match.score.team1Games + match.score.team2Games;
      if (totalGames % 2 === 1) {
        showSideChangeMessage();
      }
      
      // Check match won
      const setsToWin = Math.ceil(match.config.bestOfSets / 2);
      if (match.score.team1Sets === setsToWin || match.score.team2Sets === setsToWin) {
        match.gameState.isFinished = true;
        match.gameState.winner = match.score.team1Sets > match.score.team2Sets ? match.team1.id : match.team2.id;
        
        setShowVictoryScreen(true);
        
        // After 1 minute, reset to configuration
        setTimeout(() => {
          setMatch(null);
          setShowVictoryScreen(false);
        }, 60000);
      }
    }
  };

  const showSideChangeMessage = () => {
    setStatusMessage({
      type: 'side-change',
      text: 'Cambio de lado',
      countdown: 60,
      visible: true
    });
  };

  // Undo last point
  const undoLastPoint = useCallback(() => {
    if (!match || match.gameState.isFinished) return;

    setMatch(prevMatch => {
      if (!prevMatch) return null;
      
      // Simple implementation: just subtract one point from the last team that scored
      const newMatch = { ...prevMatch };
      
      if (newMatch.score.team1Points > 0) {
        newMatch.score.team1Points--;
      } else if (newMatch.score.team2Points > 0) {
        newMatch.score.team2Points--;
      }
      
      // Reset game state flags if needed
      if (newMatch.score.team1Points < 3 || newMatch.score.team2Points < 3) {
        newMatch.gameState.deuce = false;
        newMatch.gameState.advantage = null;
      }
      
      setStatusMessage({
        type: 'info',
        text: 'Punto deshecho',
        visible: true
      });
      
      setTimeout(() => {
        setStatusMessage(prev => ({ ...prev, visible: false }));
      }, 1500);
      
      return newMatch;
    });
  }, [match]);

  return {
    match,
    statusMessage,
    showVictoryScreen,
    startMatch,
    addPoint,
    undoLastPoint,
    getScoreDisplay,
  };
};