import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Eye } from 'lucide-react';

const GameBoard = ({ analysis }) => {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfluence, setShowInfluence] = useState(false);
  
  const { movePatterns, influenceMap } = analysis;
  const boardSize = 19;
  
  // Create board state up to current move
  const getBoardState = (moveIndex) => {
    const board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    
    // Add setup stones and moves up to current index
    const movesToShow = movePatterns.slice(0, moveIndex + 1);
    
    movesToShow.forEach(move => {
      if (move.position) {
        const { x, y } = move.position;
        board[y][x] = move.color;
      }
    });
    
    return board;
  };

  const currentBoard = getBoardState(currentMoveIndex);
  const currentMove = movePatterns[currentMoveIndex];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentMoveIndex(Math.max(0, currentMoveIndex - 1));
  };

  const handleNext = () => {
    setCurrentMoveIndex(Math.min(movePatterns.length - 1, currentMoveIndex + 1));
  };

  const handleMoveClick = (index) => {
    setCurrentMoveIndex(index);
  };

  const getInfluenceColor = (x, y) => {
    const influence = influenceMap.find(i => i.x === x && i.y === y);
    if (!influence) return 'transparent';
    
    const strength = influence.influenceStrength;
    const alpha = Math.min(0.8, strength * 0.5);
    
    if (influence.dominantColor === 'black') {
      return `rgba(0, 0, 0, ${alpha})`;
    } else {
      return `rgba(255, 255, 255, ${alpha})`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Board Controls */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Game Board</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInfluence(!showInfluence)}
              className={`px-3 py-1 rounded text-sm ${
                showInfluence 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Eye className="h-4 w-4 inline mr-1" />
              Influence
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={handlePrevious}
            disabled={currentMoveIndex === 0}
            className="p-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-2 rounded bg-purple-600 hover:bg-purple-700"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentMoveIndex === movePatterns.length - 1}
            className="p-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-center text-sm text-white/70">
          Move {currentMoveIndex + 1} of {movePatterns.length}
          {currentMove && (
            <span className="ml-4">
              ({currentMove.color} - {(currentMove.aggression * 100).toFixed(0)}% aggression)
            </span>
          )}
        </div>
      </div>

      {/* GO Board */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div className="flex justify-center">
          <div 
            className="relative bg-go-board rounded-lg shadow-lg"
            style={{ 
              width: '400px', 
              height: '400px',
              backgroundImage: 'linear-gradient(45deg, #dcb35c 25%, transparent 25%), linear-gradient(-45deg, #dcb35c 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #dcb35c 75%), linear-gradient(-45deg, transparent 75%, #dcb35c 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
          >
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              {/* Vertical lines */}
              {Array.from({ length: boardSize }, (_, i) => (
                <line
                  key={`v${i}`}
                  x1={20 + i * 20}
                  y1="20"
                  x2={20 + i * 20}
                  y2="380"
                  stroke="#8B4513"
                  strokeWidth="1"
                />
              ))}
              
              {/* Horizontal lines */}
              {Array.from({ length: boardSize }, (_, i) => (
                <line
                  key={`h${i}`}
                  x1="20"
                  y1={20 + i * 20}
                  x2="380"
                  y2={20 + i * 20}
                  stroke="#8B4513"
                  strokeWidth="1"
                />
              ))}
              
              {/* Star points */}
              {[3, 9, 15].map(x => 
                [3, 9, 15].map(y => (
                  <circle
                    key={`star-${x}-${y}`}
                    cx={20 + x * 20}
                    cy={20 + y * 20}
                    r="2"
                    fill="#8B4513"
                  />
                ))
              )}
            </svg>

            {/* Stones */}
            {currentBoard.map((row, y) =>
              row.map((stone, x) => {
                if (!stone) return null;
                
                const influenceColor = showInfluence ? getInfluenceColor(x, y) : 'transparent';
                
                return (
                  <div
                    key={`stone-${x}-${y}`}
                    className="absolute w-4 h-4 rounded-full border-2 border-gray-800 shadow-lg"
                    style={{
                      left: `${16 + x * 20}px`,
                      top: `${16 + y * 20}px`,
                      backgroundColor: stone === 'black' ? '#000' : '#fff',
                      background: influenceColor !== 'transparent' 
                        ? `radial-gradient(circle, ${stone === 'black' ? '#000' : '#fff'} 60%, ${influenceColor} 100%)`
                        : stone === 'black' ? '#000' : '#fff'
                    }}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Move History */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">Move History</h4>
        <div className="max-h-32 overflow-y-auto">
          <div className="grid grid-cols-8 gap-1">
            {movePatterns.map((move, index) => (
              <button
                key={index}
                onClick={() => handleMoveClick(index)}
                className={`p-2 text-xs rounded transition-all ${
                  index === currentMoveIndex
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${move.color === 'black' ? 'bg-black' : 'bg-white'}`}></div>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Move Info */}
      {currentMove && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-3">Current Move Analysis</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/70">Color:</span>
              <span className={`ml-2 font-semibold ${currentMove.color === 'black' ? 'text-black' : 'text-white'}`}>
                {currentMove.color.charAt(0).toUpperCase() + currentMove.color.slice(1)}
              </span>
            </div>
            <div>
              <span className="text-white/70">Aggression:</span>
              <span className="ml-2 font-semibold text-purple-400">
                {(currentMove.aggression * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-white/70">Territory:</span>
              <span className="ml-2 font-semibold text-green-400">
                {(currentMove.territory * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-white/70">Influence:</span>
              <span className="ml-2 font-semibold text-blue-400">
                {(currentMove.influence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
