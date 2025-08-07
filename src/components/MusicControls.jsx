import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Settings, Play, Pause, RotateCcw } from 'lucide-react';

const MusicControls = ({ 
  gameAnalysis, 
  musicGenerator, 
  isPlaying, 
  onVolumeChange, 
  onTempoChange 
}) => {
  const [volume, setVolume] = useState(0.7);
  const [tempo, setTempo] = useState(120);
  const [showSettings, setShowSettings] = useState(false);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    onVolumeChange(newVolume * 100 - 100); // Convert to dB
  };

  const handleTempoChange = (newTempo) => {
    setTempo(newTempo);
    onTempoChange(newTempo);
  };

  const getMusicPreview = () => {
    if (!musicGenerator || !gameAnalysis) return null;
    
    return musicGenerator.generatePreview(gameAnalysis);
  };

  const musicPreview = getMusicPreview();

  return (
    <div className="space-y-6">
      {/* Music Preview */}
      {musicPreview && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Music className="h-5 w-5 mr-2" />
            Music Characteristics
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {musicPreview.key}
              </div>
              <div className="text-white/70">Key</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {musicPreview.scale.join(' ')}
              </div>
              <div className="text-white/70">Scale</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {musicPreview.tempo}
              </div>
              <div className="text-white/70">BPM</div>
            </div>
          </div>
          
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/5 rounded p-3">
              <div className="font-semibold text-purple-400 mb-1">Aggression</div>
              <div className="text-white/70">
                {musicPreview.characteristics.aggression > 0.7 ? 'High' : 
                 musicPreview.characteristics.aggression > 0.4 ? 'Medium' : 'Low'}
              </div>
            </div>
            
            <div className="bg-white/5 rounded p-3">
              <div className="font-semibold text-purple-400 mb-1">Balance</div>
              <div className="text-white/70">
                {musicPreview.characteristics.balance > 0.5 ? 'Black Dominant' :
                 musicPreview.characteristics.balance < -0.5 ? 'White Dominant' : 'Balanced'}
              </div>
            </div>
            
            <div className="bg-white/5 rounded p-3">
              <div className="font-semibold text-purple-400 mb-1">Phase</div>
              <div className="text-white/70 capitalize">
                {musicPreview.characteristics.phase}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Volume Control */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Volume2 className="h-5 w-5 mr-2" />
            Volume Control
          </h3>
          <button
            onClick={() => handleVolumeChange(volume === 0 ? 0.7 : 0)}
            className="p-2 rounded bg-white/10 hover:bg-white/20"
          >
            {volume === 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Volume:</span>
            <span className="font-semibold text-purple-400">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
        </div>
      </div>

      {/* Tempo Control */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Music className="h-5 w-5 mr-2" />
            Tempo Control
          </h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded bg-white/10 hover:bg-white/20"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Tempo:</span>
            <span className="font-semibold text-purple-400">
              {tempo} BPM
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="200"
            step="1"
            value={tempo}
            onChange={(e) => handleTempoChange(parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((tempo - 60) / 140) * 100}%, rgba(255,255,255,0.2) ${((tempo - 60) / 140) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-white/50">
            <span>60 BPM</span>
            <span>130 BPM</span>
            <span>200 BPM</span>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      {showSettings && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Music Generation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Melody Synth:</span>
                  <span className="text-purple-400">Sine Wave</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Bass Synth:</span>
                  <span className="text-purple-400">Square Wave</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Pad Synth:</span>
                  <span className="text-purple-400">Triangle Wave</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Effects:</span>
                  <span className="text-purple-400">Reverb + Delay</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Game Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Moves:</span>
                  <span className="text-purple-400">{gameAnalysis.totalMoves}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Aggression:</span>
                  <span className="text-purple-400">
                    {(gameAnalysis.aggressionLevel * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Balance:</span>
                  <span className="text-purple-400">
                    {gameAnalysis.territoryBalance.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Phase:</span>
                  <span className="text-purple-400 capitalize">
                    {gameAnalysis.gamePhase}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setVolume(0.7);
                setTempo(120);
                handleVolumeChange(0.7);
                handleTempoChange(120);
              }}
              className="flex items-center px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-all"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">How It Works</h3>
        <div className="space-y-3 text-sm text-white/70">
          <p>
            • <strong>Aggression Level:</strong> Determines the musical scale and tempo. 
            More aggressive games use minor scales and faster tempos.
          </p>
          <p>
            • <strong>Territory Balance:</strong> Influences the musical key. 
            Black-dominant games use C major, white-dominant use F major, balanced use G major.
          </p>
          <p>
            • <strong>Move Patterns:</strong> Each move generates a note based on its position, 
            aggression level, and territory impact.
          </p>
          <p>
            • <strong>Game Phase:</strong> Different sections (opening, middle, end) 
            create distinct musical movements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MusicControls;
