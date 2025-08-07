import { readFileSync } from 'fs';
import { SGFAnalyzer } from './src/utils/sgfAnalyzer.js';

// Read the SGF file
const sgfContent = readFileSync('./public/75262578-234-BangVo-satras.sgf', 'utf8');

// Test the analyzer
const analyzer = new SGFAnalyzer();
try {
  const analysis = analyzer.parseSGF(sgfContent);
  
  console.log('✅ SGF Parsing Test Results:');
  console.log('==============================');
  console.log(`Total Moves: ${analysis.totalMoves}`);
  console.log(`Black Moves: ${analysis.blackMoves}`);
  console.log(`White Moves: ${analysis.whiteMoves}`);
  console.log(`Game Phase: ${analysis.gamePhase}`);
  console.log(`Aggression Level: ${(analysis.aggressionLevel * 100).toFixed(1)}%`);
  console.log(`Territory Balance: ${analysis.territoryBalance.toFixed(2)}`);
  console.log(`Move Patterns: ${analysis.movePatterns.length} moves analyzed`);
  
  // Show first few moves
  console.log('\n📋 First 5 Moves:');
  analysis.movePatterns.slice(0, 5).forEach((move, index) => {
    console.log(`Move ${index + 1}: ${move.color} at (${move.position?.x}, ${move.position?.y}) - Aggression: ${(move.aggression * 100).toFixed(1)}%`);
  });
  
  console.log('\n✅ SGF parsing successful!');
} catch (error) {
  console.error('❌ SGF parsing failed:', error.message);
}
