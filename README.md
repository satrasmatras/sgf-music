# SGF Music - GO Game Music Generator

<img width="949" height="700" alt="image" src="https://github.com/user-attachments/assets/6e85ea1c-bf4d-46c3-a5fc-c660a3751eaa" />
<img width="934" height="686" alt="image" src="https://github.com/user-attachments/assets/2efc442c-e634-4791-9360-eb475b92fde1" />


A React web application that analyzes SGF (Smart Game Format) GO game files and generates unique musical compositions based on game characteristics such as aggression, territory balance, and move patterns.

## 🎵 Features

### Game Analysis
- **SGF File Parsing**: Upload and parse standard SGF files
- **Move Pattern Analysis**: Analyze each move for aggression, territory impact, and influence
- **Game Phase Detection**: Identify opening, middlegame, and endgame phases
- **Territory Balance**: Calculate territory balance between black and white
- **Aggression Level**: Measure overall game aggression based on move characteristics

### Music Generation
- **Dynamic Composition**: Generate music based on game characteristics
- **Scale Selection**: Choose musical scales based on aggression level
  - High aggression → Minor scales
  - Medium aggression → Major scales  
  - Low aggression → Lydian scales
- **Tempo Variation**: Adjust tempo based on game aggression and length
- **Key Selection**: Choose musical key based on territory balance
- **Multi-layered Audio**: Melody, bass, pads, and percussion tracks

### Interactive Features
- **Visual GO Board**: Interactive game board with move progression
- **Real-time Analysis**: Live statistics and charts
- **Music Controls**: Volume, tempo, and playback controls
- **Influence Visualization**: Show territory influence on the board
- **Move History**: Browse through individual moves with analysis

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sgf-music
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── components/
│   ├── FileUpload.js      # SGF file upload component
│   ├── GameAnalysis.js    # Game statistics and charts
│   ├── GameBoard.js       # Interactive GO board
│   └── MusicControls.js   # Music playback controls
├── utils/
│   ├── sgfAnalyzer.js     # SGF parsing and analysis
│   └── musicGenerator.js  # Music generation engine
├── App.js                 # Main application component
└── index.js              # React entry point
```

## 🎮 How It Works

### Game Analysis Process

1. **SGF Parsing**: The application parses SGF files using the `@sabaki/sgf` library
2. **Move Extraction**: Extracts all moves, setup stones, and game metadata
3. **Characteristic Analysis**: For each move, calculates:
   - **Aggression**: Based on distance from center, proximity to opponent stones
   - **Territory Impact**: Based on board position (corner, side, center)
   - **Influence**: Calculates influence on surrounding areas
4. **Game-wide Analysis**: Determines overall game characteristics

### Music Generation Process

1. **Scale Selection**: 
   - High aggression (70%+) → C minor scale
   - Medium aggression (40-70%) → C major scale
   - Low aggression (<40%) → C lydian scale

2. **Key Selection**:
   - Black dominant → C major
   - White dominant → F major
   - Balanced → G major

3. **Tempo Calculation**:
   - Base tempo: 120 BPM
   - High aggression: +20 BPM
   - Long games: -20 BPM

4. **Note Generation**: Each move generates a note based on:
   - Position in scale (determined by move number)
   - Octave (based on aggression level)
   - Duration (based on territory impact)
   - Velocity (based on aggression and influence)

## 🎵 Music Characteristics

### Instrumentation
- **Melody**: Sine wave synthesizer for clear melodic lines
- **Bass**: Square wave synthesizer for rhythmic foundation
- **Pads**: Triangle wave synthesizer for atmospheric texture
- **Percussion**: Membrane synthesizer for rhythmic accents

### Effects
- **Reverb**: Adds spatial depth to the composition
- **Delay**: Creates rhythmic echoes and texture

### Musical Structure
- **Opening**: First 20 moves create the musical introduction
- **Middlegame**: Moves 21-100 form the main musical development
- **Endgame**: Remaining moves create the musical conclusion

## 📊 Analysis Metrics

### Aggression Level
- **Calculation**: Based on move distance from center, proximity to opponent stones
- **Range**: 0-100%
- **Impact**: Affects musical scale, tempo, and note selection

### Territory Balance
- **Calculation**: Difference between black and white territorial moves
- **Range**: -1 to +1 (negative favors white, positive favors black)
- **Impact**: Determines musical key and harmonic structure

### Game Phase
- **Opening**: Moves 1-50
- **Middlegame**: Moves 51-150
- **Endgame**: Moves 151+

## 🎯 Usage

1. **Upload SGF File**: Drag and drop or browse for an SGF file
2. **View Analysis**: Explore game statistics, move patterns, and characteristics
3. **Generate Music**: Click "Generate Music" to create a composition
4. **Control Playback**: Use volume and tempo controls to customize the experience
5. **Explore Board**: Navigate through moves on the interactive GO board

## 🔧 Technical Details

### Dependencies
- **React**: Frontend framework
- **Tone.js**: Web audio framework for music generation
- **@sabaki/sgf**: SGF file parsing library
- **Lucide React**: Icon library
- **Tailwind CSS**: Styling framework

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Audio Requirements
- Web Audio API support
- User interaction required for audio initialization (browser security)

## 🎨 Customization

### Adding New Analysis Metrics
1. Extend the `SGFAnalyzer` class in `src/utils/sgfAnalyzer.js`
2. Add new calculation methods
3. Update the analysis object structure

### Modifying Music Generation
1. Edit the `MusicGenerator` class in `src/utils/musicGenerator.js`
2. Adjust scale selection logic
3. Modify instrument parameters
4. Add new effects or instruments

### Styling Changes
- Modify `tailwind.config.js` for theme changes
- Update component styles in individual files
- Customize CSS in `src/index.css`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **@sabaki/sgf**: For SGF parsing capabilities
- **Tone.js**: For web audio functionality
- **Lucide**: For beautiful icons
- **Tailwind CSS**: For modern styling

## 🐛 Known Issues

- Audio initialization requires user interaction (browser security)
- Large SGF files may take time to process
- Some browsers may have audio latency

## 🔮 Future Enhancements

- **Export Options**: Save generated music as audio files
- **Advanced Analysis**: AI-powered move evaluation
- **Multiple Instruments**: More diverse sound palettes
- **Real-time Generation**: Live music during game replay
- **Collaborative Features**: Share compositions with other users
