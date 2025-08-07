import sgf from '@sabaki/sgf';
import { readFileSync } from 'fs';

const { parse } = sgf;

// Read the SGF file
const sgfContent = readFileSync('./public/75262578-234-BangVo-satras.sgf', 'utf8');

console.log('SGF Content length:', sgfContent.length);
console.log('First 100 chars:', sgfContent.substring(0, 100));

try {
  const parsed = parse(sgfContent);
  console.log('Parsed result type:', typeof parsed);
  console.log('Parsed result:', JSON.stringify(parsed, null, 2));
} catch (error) {
  console.error('Parse error:', error);
}
