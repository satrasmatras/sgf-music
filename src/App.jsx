import React, { useState, useEffect } from 'react';
import { Upload, Play, Pause, Volume2, Music, BarChart3, Target, Users } from 'lucide-react';
import { SGFAnalyzer } from './utils/sgfAnalyzer';
import { MusicGenerator } from './utils/musicGenerator';
import GameAnalysis from './components/GameAnalysis.jsx';
import MusicControls from './components/MusicControls.jsx';
import GameBoard from './components/GameBoard.jsx';
import FileUpload from './components/FileUpload.jsx';

function App() {
  const [gameAnalysis, setGameAnalysis] = useState(null);
  const [musicGenerator, setMusicGenerator] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentView, setCurrentView] = useState('upload'); // upload, analysis, music
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeMusicGenerator();
  }, []);

  const initializeMusicGenerator = async () => {
    try {
      const generator = new MusicGenerator();
      console.log('🎵 Music generator initialized');
      setMusicGenerator(generator);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize music generator:', error);
      setError('Failed to initialize audio system');
    }
  };

  const handleFileUpload = async (sgfContent) => {
    setLoading(true);
    setError(null);
    
    try {
      const analyzer = new SGFAnalyzer();
      const analysis = analyzer.parseSGF(sgfContent);
      setGameAnalysis(analysis);
      setCurrentView('analysis');
    } catch (error) {
      setError('Failed to parse SGF file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMusic = async () => {
    if (!musicGenerator || !gameAnalysis) return;
    
    try {
      await musicGenerator.generateMusicFromGame(gameAnalysis);
      setIsPlaying(true);
      setCurrentView('music');
    } catch (error) {
      setError('Failed to generate music: ' + error.message);
    }
  };

  const handleStopMusic = () => {
    if (musicGenerator) {
      musicGenerator.stopMusic();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (volume) => {
    if (musicGenerator) {
      musicGenerator.setVolume(volume);
    }
  };

  const handleTempoChange = (tempo) => {
    if (musicGenerator) {
      musicGenerator.setTempo(tempo);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Music className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SGF Music
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('upload')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'upload' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Upload
              </button>
              {gameAnalysis && (
                <>
                  <button
                    onClick={() => setCurrentView('analysis')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentView === 'analysis' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 inline mr-2" />
                    Analysis
                  </button>
                  <button
                    onClick={() => setCurrentView('music')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentView === 'music' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <Music className="h-4 w-4 inline mr-2" />
                    Music
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        )}

        {!loading && (
          <>
            {currentView === 'upload' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-4">Transform GO Games into Music</h2>
                  <p className="text-xl text-white/80 max-w-2xl mx-auto">
                    Upload an SGF file and watch as we analyze the game's characteristics 
                    to create unique musical compositions based on aggression, territory, and strategy.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                    <Target className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-xl font-semibold mb-2">Game Analysis</h3>
                    <p className="text-white/70">
                      Analyze move patterns, aggression levels, and territory balance
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                    <Music className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-xl font-semibold mb-2">Music Generation</h3>
                    <p className="text-white/70">
                      Create unique compositions based on game characteristics
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-xl font-semibold mb-2">Interactive Experience</h3>
                    <p className="text-white/70">
                      Visualize the game board and control music playback
                    </p>
                  </div>
                </div>

                <FileUpload onFileUpload={handleFileUpload} />
              </div>
            )}

            {currentView === 'analysis' && gameAnalysis && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">Game Analysis</h2>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleGenerateMusic}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      <Play className="h-5 w-5 inline mr-2" />
                      Generate Music
                    </button>
                    <button
                      onClick={() => musicGenerator?.testAudio()}
                      className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                    >
                      🎵 Test Audio
                    </button>
                  </div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <GameAnalysis analysis={gameAnalysis} />
                  <GameBoard analysis={gameAnalysis} />
                </div>
              </div>
            )}

            {currentView === 'music' && gameAnalysis && musicGenerator && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">Music Generation</h2>
                  <div className="flex items-center space-x-4">
                    {isPlaying ? (
                      <button
                        onClick={handleStopMusic}
                        className="bg-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
                      >
                        <Pause className="h-5 w-5 inline mr-2" />
                        Stop Music
                      </button>
                    ) : (
                      <button
                        onClick={handleGenerateMusic}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        <Play className="h-5 w-5 inline mr-2" />
                        Play Music
                      </button>
                    )}
                  </div>
                </div>
                
                <MusicControls
                  gameAnalysis={gameAnalysis}
                  musicGenerator={musicGenerator}
                  isPlaying={isPlaying}
                  onVolumeChange={handleVolumeChange}
                  onTempoChange={handleTempoChange}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
