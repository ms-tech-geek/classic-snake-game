import { useEffect, useRef, useState, useCallback } from 'react'
import { useGame } from './hooks/useGame'
import { GameCanvas } from './components/GameCanvas'
import './App.css'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const { gameState, handleKeyDown, handleMouseDown } = useGame(context, dimensions)

  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

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

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return (
    <div className="game-container">
      <GameCanvas 
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
      />
      {gameState.gameover && (
        <div className="game-over">
          <p>Press Any Key to Start</p>
        </div>
      )}
      <div className="score">SCORE: {gameState.score}</div>
    </div>
  )
}

export default App