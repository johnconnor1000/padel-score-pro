import React, { useState } from 'react';
import { usePadelMatch } from '@/hooks/usePadelMatch';
import { MatchConfig, Team } from '@/types/padel';
import TVScoreboard from '@/components/TVScoreboard';
import MobileConfig from '@/components/MobileConfig';
import JudgePanel from '@/components/JudgePanel';
import GameModeToggle from '@/components/GameModeToggle';
import heroImage from '@/assets/padel-court-hero.jpg';

const Index = () => {
  const [currentView, setCurrentView] = useState<'config' | 'tv' | 'judge'>('config');
  const [judgeMode, setJudgeMode] = useState(false);

  const initialConfig: MatchConfig = {
    bestOfSets: 3,
    gameMode: 'traditional',
    language: 'es',
    mode: 'sensors'
  };

  const {
    match,
    statusMessage,
    startMatch,
    addPoint,
    undoLastPoint,
    getScoreDisplay,
  } = usePadelMatch(initialConfig);

  const handleStartMatch = (team1: Team, team2: Team, config: MatchConfig) => {
    startMatch(team1, team2);
    // Auto-switch to TV mode after match starts
    setCurrentView('tv');
    
    // If judge mode is enabled, show both interfaces
    if (config.mode === 'judge') {
      setJudgeMode(true);
    }
  };

  const handleJudgeMode = (enabled: boolean) => {
    setJudgeMode(enabled);
  };

  const handleViewChange = (view: 'config' | 'tv' | 'judge') => {
    setCurrentView(view);
  };

  // Configuration view - Mobile interface
  if (currentView === 'config') {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10">
          <GameModeToggle 
            currentView={currentView} 
            onViewChange={handleViewChange}
            hasMatch={!!match}
          />
          <MobileConfig 
            onStartMatch={handleStartMatch}
            onJudgeMode={handleJudgeMode}
          />
        </div>
      </div>
    );
  }

  // TV Scoreboard view - Main display
  if (currentView === 'tv') {
    return (
      <>
        <GameModeToggle 
          currentView={currentView} 
          onViewChange={handleViewChange}
          hasMatch={!!match}
        />
        <TVScoreboard 
          match={match}
          statusMessage={statusMessage}
          getScoreDisplay={getScoreDisplay}
        />
      </>
    );
  }

  // Judge Panel view - Mobile scoring interface
  if (currentView === 'judge' && match) {
    return (
      <>
        <GameModeToggle 
          currentView={currentView} 
          onViewChange={handleViewChange}
          hasMatch={!!match}
        />
        <JudgePanel
          match={match}
          addPoint={addPoint}
          undoLastPoint={undoLastPoint}
          getScoreDisplay={getScoreDisplay}
        />
      </>
    );
  }

  // Default fallback to config
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10">
        <GameModeToggle 
          currentView={currentView} 
          onViewChange={handleViewChange}
          hasMatch={!!match}
        />
        <MobileConfig 
          onStartMatch={handleStartMatch}
          onJudgeMode={handleJudgeMode}
        />
      </div>
    </div>
  );
};

export default Index;
