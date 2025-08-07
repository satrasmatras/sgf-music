import { 
  start, 
  PolySynth, 
  Synth, 
  MonoSynth, 
  MembraneSynth, 
  Reverb, 
  FeedbackDelay, 
  Transport 
} from 'tone';

export class MusicGenerator {
  constructor() {
    this.synths = {};
    this.isInitialized = false;
    this.currentSequence = null;
    this.musicSettings = {
      tempo: 120,
      volume: -10,
      reverb: 0.3,
      delay: 0.2
    };
  }

  async initialize() {
    if (this.isInitialized) return;
    
    // Start the audio context only when user clicks play
    await start();
    console.log('🔊 Audio context started');
    
    // Create different synths for different purposes
    this.synths.melody = new PolySynth(Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 0.8 }
    }).toDestination();
    
    this.synths.bass = new MonoSynth(Synth, {
      oscillator: { type: 'square' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 1.0 }
    }).toDestination();
    
    this.synths.pads = new PolySynth(Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.5, decay: 0.8, sustain: 0.6, release: 1.5 }
    }).toDestination();
    
    this.synths.percussion = new MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
    }).toDestination();
    
    // Add effects
    const reverb = new Reverb(this.musicSettings.reverb).toDestination();
    const delay = new FeedbackDelay(this.musicSettings.delay, 0.5).toDestination();
    
    this.synths.melody.connect(reverb);
    this.synths.bass.connect(delay);
    this.synths.pads.connect(reverb);
    
    Transport.bpm.value = this.musicSettings.tempo;
    
    // Test tone to verify audio is working
    console.log('🔊 Playing test tone...');
    this.synths.melody.triggerAttackRelease('C4', '8n');
    
    this.isInitialized = true;
    console.log('✅ Audio system initialized');
  }

  async generateMusicFromGame(gameAnalysis) {
    console.log('🎵 Starting music generation...');
    
    // Initialize audio context on first play
    if (!this.isInitialized) {
      console.log('🔧 Initializing audio context...');
      await this.initialize();
      console.log('✅ Audio context initialized');
    }

    const { movePatterns, aggressionLevel, territoryBalance, gamePhase } = gameAnalysis;
    console.log('📊 Game analysis:', { 
      totalMoves: movePatterns.length, 
      aggressionLevel, 
      territoryBalance, 
      gamePhase 
    });
    
    // Stop any existing music
    this.stopMusic();
    
    // Generate music based on game characteristics
    const musicStructure = this.createMusicStructure(gameAnalysis);
    console.log('🎼 Music structure created:', musicStructure);
    
    this.playMusicStructure(musicStructure);
    console.log('🎵 Music playback started');
  }

  createMusicStructure(gameAnalysis) {
    const { movePatterns, aggressionLevel, territoryBalance, gamePhase } = gameAnalysis;
    
    console.log('🎼 Creating music structure with:', {
      movePatterns: movePatterns.length,
      aggressionLevel,
      territoryBalance,
      gamePhase
    });
    
    // Define scales based on game characteristics
    const scale = this.getScaleForGame(gameAnalysis);
    const key = this.getKeyForGame(gameAnalysis);
    
    console.log('🎵 Musical parameters:', { scale, key });
    
    const structure = {
      key,
      scale,
      tempo: this.getTempoForGame(gameAnalysis),
      sections: []
    };
    
    // Create sections based on game phases
    const openingMoves = movePatterns.slice(0, Math.min(20, movePatterns.length));
    const middleMoves = movePatterns.slice(20, Math.min(100, movePatterns.length));
    const endMoves = movePatterns.slice(100);
    
    console.log('📊 Move distribution:', {
      opening: openingMoves.length,
      middle: middleMoves.length,
      end: endMoves.length
    });
    
    if (openingMoves.length > 0) {
      const openingSection = this.createSection('opening', openingMoves, scale, key);
      console.log('🎵 Opening section created:', openingSection);
      structure.sections.push(openingSection);
    }
    
    if (middleMoves.length > 0) {
      const middleSection = this.createSection('middle', middleMoves, scale, key);
      console.log('🎵 Middle section created:', middleSection);
      structure.sections.push(middleSection);
    }
    
    if (endMoves.length > 0) {
      const endSection = this.createSection('ending', endMoves, scale, key);
      console.log('🎵 End section created:', endSection);
      structure.sections.push(endSection);
    }
    
    console.log('🎼 Final structure:', structure);
    
    // Fallback: if no sections were created, create a simple default section
    if (structure.sections.length === 0) {
      console.log('⚠️ No sections created, adding fallback section');
      const fallbackMoves = [
        { color: 'black', position: { x: 3, y: 3 }, aggression: 0.5, territory: 0.3, influence: 0.4 },
        { color: 'white', position: { x: 15, y: 15 }, aggression: 0.4, territory: 0.4, influence: 0.3 },
        { color: 'black', position: { x: 9, y: 9 }, aggression: 0.6, territory: 0.2, influence: 0.8 },
        { color: 'white', position: { x: 12, y: 6 }, aggression: 0.3, territory: 0.5, influence: 0.2 }
      ];
      const fallbackSection = this.createSection('fallback', fallbackMoves, scale, key);
      structure.sections.push(fallbackSection);
    }
    
    return structure;
  }

  getScaleForGame(gameAnalysis) {
    const { aggressionLevel, territoryBalance } = gameAnalysis;
    
    // More aggressive games use minor scales
    if (aggressionLevel > 0.7) {
      return ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb']; // C minor
    } else if (aggressionLevel > 0.4) {
      return ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // C major
    } else {
      return ['C', 'D', 'E', 'F#', 'G', 'A', 'B']; // C lydian (more peaceful)
    }
  }

  getKeyForGame(gameAnalysis) {
    const { territoryBalance } = gameAnalysis;
    
    // Balance affects the key
    if (territoryBalance > 0.5) {
      return 'C'; // Black winning
    } else if (territoryBalance < -0.5) {
      return 'F'; // White winning
    } else {
      return 'G'; // Balanced
    }
  }

  getTempoForGame(gameAnalysis) {
    const { aggressionLevel, totalMoves } = gameAnalysis;
    
    let baseTempo = 120;
    
    // More aggressive games are faster
    if (aggressionLevel > 0.7) {
      baseTempo = 140;
    } else if (aggressionLevel > 0.4) {
      baseTempo = 130;
    } else {
      baseTempo = 110;
    }
    
    // Longer games get slower
    if (totalMoves > 200) {
      baseTempo -= 20;
    }
    
    return baseTempo;
  }

  createSection(type, moves, scale, key) {
    console.log(`🎵 Creating ${type} section with ${moves.length} moves`);
    
    const section = {
      type,
      duration: moves.length * 0.5, // 0.5 seconds per move
      melody: [],
      bass: [],
      pads: [],
      percussion: []
    };
    
    moves.forEach((move, index) => {
      console.log(`🎵 Processing move ${index + 1}:`, move);
      
      const note = this.getNoteForMove(move, scale, key, index);
      const duration = this.getDurationForMove(move);
      const velocity = this.getVelocityForMove(move);
      
      console.log(`🎵 Generated note: ${note}, duration: ${duration}, velocity: ${velocity}`);
      
      section.melody.push({
        note,
        duration,
        velocity,
        time: index * 0.5
      });
      
      // Add bass note (root of the chord)
      section.bass.push({
        note: key,
        duration: duration * 2,
        velocity: velocity * 0.7,
        time: index * 0.5
      });
      
      // Add pad notes for atmosphere
      if (index % 4 === 0) {
        const padNote = this.getPadNote(move, scale, key);
        console.log(`🎵 Adding pad note: ${padNote}`);
        section.pads.push({
          note: padNote,
          duration: 2,
          velocity: 0.3,
          time: index * 0.5
        });
      }
      
      // Add percussion based on move characteristics
      if (move.aggression > 0.6) {
        console.log(`🥁 Adding percussion for aggressive move`);
        section.percussion.push({
          note: 'C2',
          duration: 0.1,
          velocity: move.aggression,
          time: index * 0.5
        });
      }
    });
    
    console.log(`🎵 Section ${type} created:`, {
      melody: section.melody.length,
      bass: section.bass.length,
      pads: section.pads.length,
      percussion: section.percussion.length
    });
    
    return section;
  }

  getNoteForMove(move, scale, key, index) {
    const { color, distanceFromCenter, isCorner, isSide, isCenter } = move;
    
    // Base note from scale
    let scaleIndex = index % scale.length;
    
    // Distance from center affects octave (closer = higher octave)
    let octave = 4;
    if (distanceFromCenter < 5) octave = 5; // Close to center
    else if (distanceFromCenter > 10) octave = 3; // Far from center
    
    // Position affects note choice
    if (isCorner) {
      scaleIndex = (scaleIndex + 2) % scale.length; // Use third
    } else if (isSide) {
      scaleIndex = (scaleIndex + 4) % scale.length; // Use fifth
    }
    // Center moves use the base note
    
    // Color affects note selection
    if (color === 'black') {
      scaleIndex = (scaleIndex + 1) % scale.length;
    }
    
    const note = scale[scaleIndex] + octave;
    console.log(`🎵 Generated note: ${note} from scale[${scaleIndex}]="${scale[scaleIndex]}" + octave ${octave}`);
    
    // Validate note
    if (!note || note.includes('undefined') || note.includes('null')) {
      console.warn('⚠️ Invalid note generated, using fallback C4');
      return 'C4';
    }
    
    return note;
  }

  getDurationForMove(move) {
    const { distanceFromCenter, isCorner, isSide } = move;
    
    let duration = 0.5; // Base duration
    
    // Corner moves are longer (more territorial)
    if (isCorner) {
      duration = 1.0;
    } else if (isSide) {
      duration = 0.75;
    }
    
    // Distance from center affects duration
    if (distanceFromCenter < 5) {
      duration *= 0.8; // Center moves are shorter
    }
    
    return duration;
  }

  getVelocityForMove(move) {
    const { distanceFromCenter, isCenter } = move;
    
    let velocity = 0.6; // Base velocity
    
    // Center moves are louder (more aggressive)
    if (isCenter) {
      velocity += 0.2;
    }
    
    // Distance from center affects velocity
    const maxDistance = Math.sqrt(9 ** 2 + 9 ** 2);
    const distanceFactor = 1 - (distanceFromCenter / maxDistance);
    velocity += distanceFactor * 0.3;

    return 1;
    
    return Math.min(1, Math.max(0.1, velocity));
  }

  getPadNote(move, scale, key) {
    const { color, isCorner, isSide } = move;
    
    let note;
    // Different chord tones based on position
    if (isCorner) {
      note = scale[2] + '4'; // Third
    } else if (isSide) {
      note = scale[4] + '4'; // Fifth
    } else {
      note = scale[1] + '4'; // Second
    }
    
    // Validate note
    if (!note || note.includes('undefined') || note.includes('null')) {
      console.warn('⚠️ Invalid pad note generated, using fallback C4');
      return 'C4';
    }
    
    return note;
  }

  playMusicStructure(structure) {
    console.log('🎼 Playing music structure:', structure);
    Transport.bpm.value = structure.tempo;
    console.log('⏱️ Tempo set to:', structure.tempo, 'BPM');
    
    // Schedule all sections
    let currentTime = 0;
    let totalNotes = 0;
    
    structure.sections.forEach((section, sectionIndex) => {
      console.log(`📝 Section ${sectionIndex + 1} (${section.type}):`, {
        melody: section.melody.length,
        bass: section.bass.length,
        pads: section.pads.length,
        percussion: section.percussion.length
      });
      
      // Schedule melody
      section.melody.forEach(note => {
        if (note.note && note.duration && note.velocity) {
          console.log(`🎵 Scheduling melody: ${note.note} for ${note.duration}s at velocity ${note.velocity}`);
          this.synths.melody.triggerAttackRelease(
            note.note,
            note.duration,
            currentTime + note.time,
            note.velocity
          );
          totalNotes++;
        } else {
          console.warn('⚠️ Skipping invalid melody note:', note);
        }
      });
      
      // Schedule bass
      section.bass.forEach(note => {
        if (note.note && note.duration && note.velocity) {
          console.log(`🎵 Scheduling bass: ${note.note} for ${note.duration}s at velocity ${note.velocity}`);
          this.synths.bass.triggerAttackRelease(
            note.note,
            note.duration,
            currentTime + note.time,
            note.velocity
          );
          totalNotes++;
        } else {
          console.warn('⚠️ Skipping invalid bass note:', note);
        }
      });
      
      // Schedule pads
      section.pads.forEach(note => {
        if (note.note && note.duration && note.velocity) {
          console.log(`🎵 Scheduling pad: ${note.note} for ${note.duration}s at velocity ${note.velocity}`);
          this.synths.pads.triggerAttackRelease(
            note.note,
            note.duration,
            currentTime + note.time,
            note.velocity
          );
          totalNotes++;
        } else {
          console.warn('⚠️ Skipping invalid pad note:', note);
        }
      });
      
      // Schedule percussion
      section.percussion.forEach(note => {
        if (note.note && note.duration && note.velocity) {
          console.log(`🥁 Scheduling percussion: ${note.note} for ${note.duration}s at velocity ${note.velocity}`);
          this.synths.percussion.triggerAttackRelease(
            note.note,
            note.duration,
            currentTime + note.time,
            note.velocity
          );
          totalNotes++;
        } else {
          console.warn('⚠️ Skipping invalid percussion note:', note);
        }
      });
      
      currentTime += section.duration;
    });
    
    console.log(`🎵 Scheduled ${totalNotes} notes, starting playback...`);
    
    // Start playback
    Transport.start();
    console.log('▶️ Transport started');
  }

  stopMusic() {
    if (this.currentSequence) {
      this.currentSequence.dispose();
    }
    Transport.stop();
    Transport.cancel();
  }

  setVolume(volume) {
    this.musicSettings.volume = volume;
    Object.values(this.synths).forEach(synth => {
      synth.volume.value = volume;
    });
  }

  setTempo(tempo) {
    this.musicSettings.tempo = tempo;
    Transport.bpm.value = tempo;
  }

  // Generate a simple preview based on game characteristics
  generatePreview(gameAnalysis) {
    const { aggressionLevel, territoryBalance, gamePhase } = gameAnalysis;
    
    const preview = {
      key: this.getKeyForGame(gameAnalysis),
      scale: this.getScaleForGame(gameAnalysis),
      tempo: this.getTempoForGame(gameAnalysis),
      characteristics: {
        aggression: aggressionLevel,
        balance: territoryBalance,
        phase: gamePhase
      }
    };
    
    return preview;
  }

  // Simple test method to verify audio is working
  async testAudio() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    console.log('🎵 Testing audio with simple melody...');
    
    // Play a simple C major scale
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    let time = 0;
    
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.synths.melody.triggerAttackRelease(note, '8n');
        console.log(`🎵 Playing note: ${note}`);
      }, time);
      time += 500; // 500ms between notes
    });
  }
}
