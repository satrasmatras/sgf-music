import React from 'react';
import { TrendingUp, Target, Users, Clock, BarChart3, Zap, Shield, Map } from 'lucide-react';

const GameAnalysis = ({ analysis }) => {
  const {
    totalMoves,
    blackMoves,
    whiteMoves,
    aggressionLevel,
    territoryBalance,
    gamePhase,
    movePatterns,
    scoreProgression
  } = analysis;

  const getAggressionLabel = (level) => {
    if (level > 0.7) return 'Very Aggressive';
    if (level > 0.4) return 'Moderately Aggressive';
    return 'Defensive';
  };

  const getBalanceLabel = (balance) => {
    if (balance > 0.5) return 'Black Dominant';
    if (balance < -0.5) return 'White Dominant';
    return 'Balanced';
  };

  const getPhaseLabel = (phase) => {
    return phase.charAt(0).toUpperCase() + phase.slice(1);
  };

  const getAggressionColor = (level) => {
    if (level > 0.7) return 'text-red-400';
    if (level > 0.4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBalanceColor = (balance) => {
    if (balance > 0.5) return 'text-black';
    if (balance < -0.5) return 'text-white';
    return 'text-gray-400';
  };

  const recentMoves = movePatterns.slice(-10);

  return (
    <div className="space-y-6">
      {/* Game Overview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Game Overview
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{totalMoves}</div>
            <div className="text-sm text-white/70">Total Moves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{blackMoves}</div>
            <div className="text-sm text-white/70">Black Moves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{whiteMoves}</div>
            <div className="text-sm text-white/70">White Moves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{getPhaseLabel(gamePhase)}</div>
            <div className="text-sm text-white/70">Game Phase</div>
          </div>
        </div>
      </div>

      {/* Game Characteristics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Aggression Level
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Level:</span>
              <span className={`font-semibold ${getAggressionColor(aggressionLevel)}`}>
                {getAggressionLabel(aggressionLevel)}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-red-400 h-2 rounded-full transition-all"
                style={{ width: `${aggressionLevel * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-white/60">
              {(aggressionLevel * 100).toFixed(1)}% aggressive
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Territory Balance
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Balance:</span>
              <span className={`font-semibold ${getBalanceColor(territoryBalance)}`}>
                {getBalanceLabel(territoryBalance)}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-white via-gray-400 to-black h-2 rounded-full transition-all"
                style={{ 
                  width: '100%',
                  background: `linear-gradient(to right, white ${50 + territoryBalance * 50}%, gray ${50 + territoryBalance * 50}%, black)`
                }}
              ></div>
            </div>
            <div className="text-sm text-white/60">
              {territoryBalance > 0 ? '+' : ''}{territoryBalance.toFixed(2)} balance
            </div>
          </div>
        </div>
      </div>

      {/* Recent Moves */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Moves
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentMoves.map((move, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${move.color === 'black' ? 'bg-black' : 'bg-white'}`}></div>
                <span className="text-sm font-mono">
                  Move {move.moveNumber}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`px-2 py-1 rounded ${move.aggression > 0.6 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                  {(move.aggression * 100).toFixed(0)}% aggression
                </span>
                <span className="text-white/60">
                  {(move.territory * 100).toFixed(0)}% territory
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Progression */}
      {scoreProgression.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Score Progression
          </h3>
          <div className="h-32 flex items-end justify-between space-x-1">
            {scoreProgression.slice(-20).map((score, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-purple-400 to-pink-400 rounded-t"
                  style={{ 
                    height: `${Math.max(2, Math.abs(score.difference) * 2)}px`,
                    opacity: 0.7
                  }}
                ></div>
                <div className="text-xs text-white/50 mt-1">
                  {score.moveNumber}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-white/60 mt-2">
            <span>Black: {scoreProgression[scoreProgression.length - 1]?.blackScore || 0}</span>
            <span>White: {scoreProgression[scoreProgression.length - 1]?.whiteScore || 0}</span>
          </div>
        </div>
      )}

      {/* Music Characteristics Preview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Map className="h-5 w-5 mr-2" />
          Music Characteristics
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-400">
              {aggressionLevel > 0.7 ? 'Minor' : aggressionLevel > 0.4 ? 'Major' : 'Lydian'}
            </div>
            <div className="text-white/60">Scale</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-400">
              {aggressionLevel > 0.7 ? '140' : aggressionLevel > 0.4 ? '130' : '110'} BPM
            </div>
            <div className="text-white/60">Tempo</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-400">
              {territoryBalance > 0.5 ? 'C' : territoryBalance < -0.5 ? 'F' : 'G'}
            </div>
            <div className="text-white/60">Key</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameAnalysis;
