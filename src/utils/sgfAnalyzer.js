import sgf from '@sabaki/sgf';
const { parse } = sgf;

export class SGFAnalyzer {
  constructor() {
    this.gameData = null;
    this.moves = [];
    this.analysis = {
      totalMoves: 0,
      blackMoves: 0,
      whiteMoves: 0,
      territoryBalance: 0,
      aggressionLevel: 0,
      gamePhase: 'opening',
      movePatterns: [],
      captureCount: { black: 0, white: 0 },
      influenceMap: [],
      scoreProgression: []
    };
  }

  parseSGF(sgfContent) {
    try {
      this.gameData = parse(sgfContent);
      this.extractMoves();
      this.analyzeGame();
      return this.analysis;
    } catch (error) {
      console.error('Error parsing SGF:', error);
      throw new Error('Invalid SGF file format');
    }
  }

  extractMoves() {
    this.moves = [];
    let currentNode = this.gameData;

    while (currentNode) {
      const properties = currentNode.properties || {};

      if (properties.AB) {
        properties.AB.forEach(pos => {
          this.moves.push({
            type: 'setup',
            color: 'black',
            position: this.parsePosition(pos),
            moveNumber: 0
          });
        });
      }

      if (properties.AW) {
        properties.AW.forEach(pos => {
          this.moves.push({
            type: 'setup',
            color: 'white',
            position: this.parsePosition(pos),
            moveNumber: 0
          });
        });
      }

      if (properties.B) {
        this.moves.push({
          type: 'move',
          color: 'black',
          position: this.parsePosition(properties.B[0]),
          moveNumber: this.moves.length + 1
        });
      }

      if (properties.W) {
        this.moves.push({
          type: 'move',
          color: 'white',
          position: this.parsePosition(properties.W[0]),
          moveNumber: this.moves.length + 1
        });
      }

      if (currentNode.children && currentNode.children.length > 0) {
        currentNode = currentNode.children[0];
      } else {
        currentNode = null;
      }
    }
  }

  parsePosition(pos) {
    if (pos === 'tt' || pos === '') return null; // Pass move
    
    const x = pos.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
    const y = pos.charCodeAt(1) - 97;
    return { x, y };
  }

  analyzeGame() {
    this.analysis.totalMoves = this.moves.filter(m => m.type === 'move').length;
    this.analysis.blackMoves = this.moves.filter(m => m.color === 'black' && m.type === 'move').length;
    this.analysis.whiteMoves = this.moves.filter(m => m.color === 'white' && m.type === 'move').length;
    
    this.analyzeMovePatterns();
    this.analyzeSimpleAggression();
    this.analyzeSimpleTerritory();
    this.analyzeGamePhase();
  }

  analyzeMovePatterns() {
    const moveMoves = this.moves.filter(m => m.type === 'move');
    this.analysis.movePatterns = moveMoves.map((move, index) => {
      const pattern = {
        moveNumber: move.moveNumber,
        color: move.color,
        position: move.position,
        // Simple factors
        distanceFromCenter: this.calculateDistanceFromCenter(move.position),
        boardQuadrant: this.getBoardQuadrant(move.position),
        isCorner: this.isCornerMove(move.position),
        isSide: this.isSideMove(move.position),
        isCenter: this.isCenterMove(move.position)
      };
      return pattern;
    });
  }

  calculateDistanceFromCenter(position) {
    if (!position) return 0;
    const centerX = 9, centerY = 9;
    return Math.sqrt((position.x - centerX) ** 2 + (position.y - centerY) ** 2);
  }

  getBoardQuadrant(position) {
    if (!position) return 'center';
    const { x, y } = position;
    if (x < 9 && y < 9) return 'top-left';
    if (x >= 9 && y < 9) return 'top-right';
    if (x < 9 && y >= 9) return 'bottom-left';
    if (x >= 9 && y >= 9) return 'bottom-right';
    return 'center';
  }

  isCornerMove(position) {
    if (!position) return false;
    const { x, y } = position;
    return (x <= 2 || x >= 16) && (y <= 2 || y >= 16);
  }

  isSideMove(position) {
    if (!position) return false;
    const { x, y } = position;
    return (x <= 2 || x >= 16) || (y <= 2 || y >= 16);
  }

  isCenterMove(position) {
    if (!position) return false;
    const { x, y } = position;
    return x >= 6 && x <= 12 && y >= 6 && y <= 12;
  }

  analyzeSimpleAggression() {
    const movePatterns = this.analysis.movePatterns;
    
    // Simple aggression: based on distance from center
    const aggressionScores = movePatterns.map(move => {
      const maxDistance = Math.sqrt(9 ** 2 + 9 ** 2); // Distance from center to corner
      return Math.max(0, 1 - (move.distanceFromCenter / maxDistance));
    });
    
    this.analysis.aggressionLevel = aggressionScores.reduce((sum, score) => sum + score, 0) / movePatterns.length;
  }

  analyzeSimpleTerritory() {
    const movePatterns = this.analysis.movePatterns;
    
    // Simple territory: corner moves = high, side moves = medium, center moves = low
    const territoryScores = movePatterns.map(move => {
      if (move.isCorner) return 1.0;
      if (move.isSide) return 0.5;
      return 0.1; // Center moves
    });
    
    const blackTerritory = movePatterns
      .filter(m => m.color === 'black')
      .map((move, index) => territoryScores[index])
      .reduce((sum, score) => sum + score, 0);
    
    const whiteTerritory = movePatterns
      .filter(m => m.color === 'white')
      .map((move, index) => territoryScores[index])
      .reduce((sum, score) => sum + score, 0);
    
    this.analysis.territoryBalance = blackTerritory - whiteTerritory;
  }

  analyzeGamePhase() {
    const totalMoves = this.analysis.totalMoves;
    
    if (totalMoves <= 50) {
      this.analysis.gamePhase = 'opening';
    } else if (totalMoves <= 150) {
      this.analysis.gamePhase = 'middlegame';
    } else {
      this.analysis.gamePhase = 'endgame';
    }
  }

  generateInfluenceMap() {
    this.analysis.influenceMap = [];
    
    for (let y = 0; y < 19; y++) {
      for (let x = 0; x < 19; x++) {
        const blackInfluence = this.calculatePointInfluence(x, y, 'black');
        const whiteInfluence = this.calculatePointInfluence(x, y, 'white');
        
        this.analysis.influenceMap.push({
          x, y,
          blackInfluence,
          whiteInfluence,
          dominantColor: blackInfluence > whiteInfluence ? 'black' : 'white',
          influenceStrength: Math.abs(blackInfluence - whiteInfluence)
        });
      }
    }
  }

  calculatePointInfluence(x, y, color) {
    let influence = 0;
    
    this.moves.forEach(move => {
      if (move.color === color && move.position) {
        const distance = Math.sqrt((x - move.position.x) ** 2 + (y - move.position.y) ** 2);
        influence += Math.max(0, 1 - distance / 5);
      }
    });
    
    return influence;
  }

  analyzeScoreProgression() {
    this.analysis.scoreProgression = [];
    let blackScore = 0, whiteScore = 0;
    
    this.analysis.movePatterns.forEach((move, index) => {
      if (move.color === 'black') {
        blackScore += move.territory * 10;
      } else {
        whiteScore += move.territory * 10;
      }
      
      this.analysis.scoreProgression.push({
        moveNumber: move.moveNumber,
        blackScore,
        whiteScore,
        difference: blackScore - whiteScore
      });
    });
  }

  getGameCharacteristics() {
    return {
      totalMoves: this.analysis.totalMoves,
      aggressionLevel: this.analysis.aggressionLevel,
      territoryBalance: this.analysis.territoryBalance,
      gamePhase: this.analysis.gamePhase,
      movePatterns: this.analysis.movePatterns,
      influenceMap: this.analysis.influenceMap,
      scoreProgression: this.analysis.scoreProgression
    };
  }
}
