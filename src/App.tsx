import React from 'react';
import { Play } from 'lucide-react';
import { useGameLoop } from './hooks/useGameLoop';
import { Controls } from './components/Controls';

function App() {
  const { gameState, startGame, changeDirection, GRID_SIZE } = useGameLoop();

  return (
    <div className="h-full bg-gray-900 flex flex-col overflow-hidden">
      {/* Header Section */}
      <header className="bg-gray-800/50 backdrop-blur-sm py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Snake Game</h1>
          <p className="text-xl text-indigo-400 font-semibold">Score: {gameState.score}</p>
        </div>
      </header>

      {/* Game Area */}
      <main className="flex-1 flex items-center justify-center p-2">
        <div className="aspect-square w-full h-[calc(100vh-4rem)] bg-gray-800 relative"
          style={{
            padding: 'min(1vh, 1vw)',
          }}>
          <div
            className="w-full h-full"
            style={{
              display: 'grid',
              gridTemplate: `repeat(${GRID_SIZE}, 1fr) / repeat(${GRID_SIZE}, 1fr)`,
              gap: '1px',
              background: '#1f2937',
            }}
          >
            {gameState.snake.map((segment, index) => (
              // Snake segments with head and body styling
              <div
                key={`${segment.x}-${segment.y}`}
                className={`
                  ${index === 0 
                    ? 'bg-indigo-400 rounded-lg shadow-glow' 
                    : 'bg-indigo-500 rounded-md'
                  }
                  transition-all duration-200
                  ${gameState.justAte && index === 0 ? 'scale-125' : 'scale-100'}
                `}
                style={{
                  gridColumn: segment.x + 1,
                  gridRow: segment.y + 1,
                  width: '100%',
                  height: '100%',
                  transform: `scale(${0.85 + (gameState.snake.length - index) * 0.01})`,
                }}
              />
            ))}
            {/* Food with pulsing animation */}
            <div
              className="bg-red-500 rounded-full animate-pulse shadow-glow-food"
              style={{
                gridColumn: gameState.food.x + 1,
                gridRow: gameState.food.y + 1,
                width: '100%',
                height: '100%',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          </div>
        </div>
      </main>

      {/* Welcome Screen */}
      {!gameState.hasStarted && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full mx-4">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome to Snake!</h2>
            <div className="space-y-4 text-gray-300 mb-8">
              <p className="text-lg">🎮 <span className="font-semibold">Controls:</span></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">↑</kbd> <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">↓</kbd> <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">←</kbd> <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">→</kbd> or touch controls to move</li>
                <li>Press <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">Space</kbd> or <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">Enter</kbd> to start/restart</li>
              </ul>
              <p className="text-lg mt-6">🎯 <span className="font-semibold">Objective:</span></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Collect red food to grow longer</li>
                <li>Avoid hitting walls and yourself</li>
                <li>Speed increases with your score</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors font-semibold"
            >
              <Play className="w-5 h-5" />
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState.isGameOver && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
            <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over!</h2>
            <p className="text-2xl text-white mb-6">Score: {gameState.score}</p>
            <p className="text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-700 rounded">Space</kbd> or <kbd className="px-2 py-1 bg-gray-700 rounded">Enter</kbd> to play again
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      {/* Removed on-screen controls in favor of swipe gestures */}
    </div>
  );
}

export default App;
