import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Team, MatchConfig } from '@/types/padel';
import { Settings, Users, Trophy, Zap, Wifi } from 'lucide-react';
import qrIcon from '@/assets/qr-config-icon.jpg';

interface MobileConfigProps {
  onStartMatch: (team1: Team, team2: Team, config: MatchConfig) => void;
  onJudgeMode: (enabled: boolean) => void;
}

const MobileConfig = ({ onStartMatch, onJudgeMode }: MobileConfigProps) => {
  const [team1Name, setTeam1Name] = useState('Equipo 1');
  const [team2Name, setTeam2Name] = useState('Equipo 2');
  const [team1Players, setTeam1Players] = useState(['', '']);
  const [team2Players, setTeam2Players] = useState(['', '']);
  const [bestOfSets, setBestOfSets] = useState<3 | 5>(3);
  const [gameMode, setGameMode] = useState<'traditional' | 'golden-point'>('traditional');
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [mode, setMode] = useState<'sensors' | 'judge'>('sensors');
  const [judgeMode, setJudgeMode] = useState(false);

  const handleStartMatch = () => {
    const team1: Team = {
      id: 'team1',
      name: team1Name,
      players: team1Players.filter(p => p.trim() !== ''),
      color: 'blue'
    };

    const team2: Team = {
      id: 'team2',
      name: team2Name,
      players: team2Players.filter(p => p.trim() !== ''),
      color: 'red'
    };

    const config: MatchConfig = {
      bestOfSets,
      gameMode,
      language,
      mode
    };

    onStartMatch(team1, team2, config);
  };

  const toggleJudgeMode = () => {
    setJudgeMode(!judgeMode);
    onJudgeMode(!judgeMode);
  };

  return (
    <div className="min-h-screen bg-white/95 backdrop-blur-sm p-4">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={qrIcon} 
              alt="Padel System" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-display text-3xl font-bold text-padel-primary mb-2">
            Sistema Pádel Pro
          </h1>
          <p className="text-score-secondary flex items-center justify-center gap-2">
            <Wifi size={16} className="text-padel-primary" />
            Modo Offline • Raspberry Pi
          </p>
        </div>

        {/* Teams Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-padel-primary" />
              Equipos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Team 1 */}
            <div className="space-y-2">
              <Label htmlFor="team1">Equipo 1 (Azul)</Label>
              <Input
                id="team1"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder="Nombre del equipo 1"
                className="border-team-blue/30 focus:border-team-blue"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Jugador 1"
                  value={team1Players[0]}
                  onChange={(e) => setTeam1Players([e.target.value, team1Players[1]])}
                  className="text-sm"
                />
                <Input
                  placeholder="Jugador 2"
                  value={team1Players[1]}
                  onChange={(e) => setTeam1Players([team1Players[0], e.target.value])}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Team 2 */}
            <div className="space-y-2">
              <Label htmlFor="team2">Equipo 2 (Rojo)</Label>
              <Input
                id="team2"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                placeholder="Nombre del equipo 2"
                className="border-team-red/30 focus:border-team-red"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Jugador 1"
                  value={team2Players[0]}
                  onChange={(e) => setTeam2Players([e.target.value, team2Players[1]])}
                  className="text-sm"
                />
                <Input
                  placeholder="Jugador 2"
                  value={team2Players[1]}
                  onChange={(e) => setTeam2Players([team2Players[0], e.target.value])}
                  className="text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-padel-primary" />
              Configuración del Juego
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Number of Sets */}
            <div className="space-y-2">
              <Label>Cantidad de Sets</Label>
              <Select value={bestOfSets.toString()} onValueChange={(value) => setBestOfSets(value as '3' | '5' === '3' ? 3 : 5)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Al mejor de 3 sets</SelectItem>
                  <SelectItem value="5">Al mejor de 5 sets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Game Mode */}
            <div className="space-y-2">
              <Label>Modo de Juego</Label>
              <Select value={gameMode} onValueChange={(value: 'traditional' | 'golden-point') => setGameMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traditional">Tradicional (con ventaja)</SelectItem>
                  <SelectItem value="golden-point">Punto de Oro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select value={language} onValueChange={(value: 'es' | 'en') => setLanguage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <Label>Modo de Control</Label>
              <Select value={mode} onValueChange={(value: 'sensors' | 'judge') => setMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sensors">Sensores Automáticos</SelectItem>
                  <SelectItem value="judge">Modo Juez Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Judge Mode Panel */}
        {mode === 'judge' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-padel-primary" />
                Modo Juez
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Activar control desde celular</Label>
                  <p className="text-sm text-score-secondary">
                    Permite registrar puntos manualmente
                  </p>
                </div>
                <Switch
                  checked={judgeMode}
                  onCheckedChange={toggleJudgeMode}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Match Button */}
        <Button 
          onClick={handleStartMatch} 
          className="w-full court-button text-lg py-6"
        >
          <Trophy className="w-5 h-5 mr-2" />
          Iniciar Partido
        </Button>

        {/* Info */}
        <div className="text-center text-sm text-score-secondary">
          <p>Sistema offline • Raspberry Pi 3B</p>
        </div>
      </div>
    </div>
  );
};

export default MobileConfig;