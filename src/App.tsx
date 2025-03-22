import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useGame } from './hooks/useGame'
import { GameCanvas } from './components/GameCanvas'
import './App.css'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const { gameState, handleKeyDown, handleMouseDown } = useGame(context)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      setContext(ctx)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="game-container">
      <GameCanvas 
        ref={canvasRef}
        width={640}
        height={480}
        onMouseDown={handleMouseDown}
      />
      {gameState.gameover && (
        <div className="game-over">
          <p>Press any key to start!</p>
        </div>
      )}
      <div className="score">Score: {gameState.score}</div>
    </div>
  )
}

export default App