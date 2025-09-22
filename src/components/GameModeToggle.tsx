import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tv } from 'lucide-react';

interface GameModeToggleProps {
  currentView: 'config' | 'tv' | 'judge';
  onViewChange: (view: 'config' | 'tv' | 'judge') => void;
  hasMatch: boolean;
}

const GameModeToggle = ({ currentView, onViewChange, hasMatch }: GameModeToggleProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      
      {/* Config Mode - Always available */}
      <Button
        variant={currentView === 'config' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('config')}
        className="flex items-center gap-2"
      >
        <Smartphone size={16} />
        Config
      </Button>

      {/* TV Mode - Available when match exists */}
      {hasMatch && (
        <Button
          variant={currentView === 'tv' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange('tv')}
          className="flex items-center gap-2"
        >
          <Tv size={16} />
          TV
        </Button>
      )}

      {/* Judge Mode - Available when match exists */}
      {hasMatch && (
        <Button
          variant={currentView === 'judge' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange('judge')}
          className="flex items-center gap-2"
        >
          <Monitor size={16} />
          Juez
        </Button>
      )}
    </div>
  );
};

export default GameModeToggle;