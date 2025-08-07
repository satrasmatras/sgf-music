import sgf from '@sabaki/sgf';
import { readFileSync } from 'fs';

const { parse } = sgf;

// Read the SGF file
const sgfContent = readFileSync('./public/75262578-234-BangVo-satras.sgf', 'utf8');

try {
  const parsed = parse(sgfContent);
  console.log('Parsed result type:', typeof parsed);
  console.log('Is array?', Array.isArray(parsed));
  console.log('Length:', parsed.length);
  
  if (parsed && parsed.length > 0) {
    const firstNode = parsed[0];
    console.log('First node type:', typeof firstNode);
    console.log('First node keys:', Object.keys(firstNode));
    
    if (firstNode.properties) {
      console.log('Properties keys:', Object.keys(firstNode.properties));
      console.log('Sample properties:', {
        FF: firstNode.properties.FF,
        GM: firstNode.properties.GM,
        SZ: firstNode.properties.SZ,
        B: firstNode.properties.B,
        W: firstNode.properties.W
      });
    }
    
    if (firstNode.children) {
      console.log('Children count:', firstNode.children.length);
      if (firstNode.children.length > 0) {
        console.log('First child properties:', Object.keys(firstNode.children[0].properties || {}));
      }
    }
  }
} catch (error) {
  console.error('Parse error:', error);
}
