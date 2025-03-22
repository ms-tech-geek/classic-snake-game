import { useCallback, useEffect, useRef, useState } from 'react'
import { Snake } from '../game/Snake'
import { Level } from '../game/Level'
import { GameState } from '../types'
import { drawGame } from '../game/renderer'

interface Dimensions {
  width: number
  height: number
}

export function useGame(context: CanvasRenderingContext2D | null, dimensions: Dimensions) {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    gameover: true,
    gameovertime: 1,
    initialized: false,
    preloaded: false,
    touchStartX: 0,
    touchStartY: 0
  })

  const snakeRef = useRef(new Snake())
  const levelRef = useRef(new Level(
    Math.floor(dimensions.width / 20),
    Math.floor(dimensions.height / 20),
    20,
    20
  ))
  const imageRef = useRef<HTMLImageElement>()
  
  useEffect(() => {
    const image = new Image()
    image.src = '/snake-graphics.png'
    image.onload = () => {
      imageRef.current = image
      setGameState(prev => ({ ...prev, preloaded: true, initialized: true }))
    }
  }, [])

  const addApple = useCallback(() => {
    const level = levelRef.current
    const snake = snakeRef.current
    let valid = false
    
    while (!valid) {
      const ax = Math.floor(Math.random() * (level.columns - 1))
      const ay = Math.floor(Math.random() * (level.rows - 1))
      
      let overlap = false
      for (const segment of snake.segments) {
        if (ax === segment.x && ay === segment.y) {
          overlap = true
          break
        }
      }
      
      if (!overlap && level.tiles[ax][ay] === 0) {
        level.tiles[ax][ay] = 2
        valid = true
      }
    }
  }, [])

  const newGame = useCallback(() => {
    const snake = snakeRef.current
    const level = levelRef.current
    
    snake.init(
      Math.floor(level.columns / 2),
      Math.floor(level.rows / 2),
      1,
      5,
      3
    )
    level.generate()
    addApple()
    
    setGameState(prev => ({
      ...prev,
      score: 0,
      gameover: false,
      gameovertime: 1
    }))
  }, [addApple])

  const updateGame = useCallback((dt: number) => {
    const snake = snakeRef.current
    const level = levelRef.current

    if (snake.tryMove(dt)) {
      const nextMove = snake.nextMove()
      const { x: nx, y: ny } = nextMove

      if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
        if (level.tiles[nx][ny] === 1) {
          setGameState(prev => ({ ...prev, gameover: true, gameovertime: 0 }))
          return
        }

        for (const segment of snake.segments) {
          if (nx === segment.x && ny === segment.y) {
            setGameState(prev => ({ ...prev, gameover: true, gameovertime: 0 }))
            return
          }
        }

        snake.move()

        if (level.tiles[nx][ny] === 2) {
          level.tiles[nx][ny] = 0
          addApple()
          snake.grow()
          setGameState(prev => ({ ...prev, score: prev.score + 1 }))
        }
      } else {
        setGameState(prev => ({ ...prev, gameover: true, gameovertime: 0 }))
      }
    }
  }, [addApple])

  useEffect(() => {
    if (!context || !imageRef.current) return

    let animationFrameId: number
    let lastFrame = 0

    const render = (time: number) => {
      const dt = (time - lastFrame) / 1000
      lastFrame = time

      if (!gameState.gameover) {
        updateGame(dt)
      } else {
        setGameState(prev => ({
          ...prev,
          gameovertime: prev.gameovertime + dt
        }))
      }

      drawGame(context, {
        level: levelRef.current,
        snake: snakeRef.current,
        image: imageRef.current!,
        gameState
      })

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animationFrameId)
  }, [context, gameState, updateGame, dimensions])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const snake = snakeRef.current

    if (gameState.gameover) {
      if (gameState.gameovertime > 0.5) {
        newGame()
      }
      return
    }

    if (e.key === 'ArrowLeft' || e.key === 'a') {
      if (snake.direction !== 1) snake.direction = 3
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
      if (snake.direction !== 2) snake.direction = 0
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      if (snake.direction !== 3) snake.direction = 1
    } else if (e.key === 'ArrowDown' || e.key === 's') {
      if (snake.direction !== 0) snake.direction = 2
    }
  }, [gameState.gameover, gameState.gameovertime, newGame])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (gameState.gameover) {
      if (gameState.gameovertime > 0.5) {
        newGame()
      }
      return
    }
    setGameState(prev => ({
      ...prev,
      touchStartX: e.touches[0].clientX,
      touchStartY: e.touches[0].clientY
    }))
  }, [gameState.gameover, gameState.gameovertime, newGame])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (gameState.gameover) return

    e.preventDefault()
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchEndX - gameState.touchStartX
    const deltaY = touchEndY - gameState.touchStartY
    const snake = snakeRef.current
    const minSwipeDistance = 10

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return
    }

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      // Horizontal swipe
      if (deltaX > 0 && snake.direction !== 3) {
        snake.direction = 1 // Right
      } else if (deltaX < 0 && snake.direction !== 1) {
        snake.direction = 3 // Left
      }
    } else if (Math.abs(deltaY) > minSwipeDistance) {
      // Vertical swipe
      if (deltaY > 0 && snake.direction !== 0) {
        snake.direction = 2 // Down
      } else if (deltaY < 0 && snake.direction !== 2) {
        snake.direction = 0 // Up
      }
    }
  }, [gameState.touchStartX, gameState.touchStartY, gameState.gameover])

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchEnd])

  const handleMouseDown = useCallback(() => {
    if (gameState.gameover) {
      if (gameState.gameovertime > 0.5) {
        newGame()
      }
      return
    }
    
    const snake = snakeRef.current
    snake.direction = (snake.direction + 1) % snake.directions.length
  }, [gameState.gameover, gameState.gameovertime, newGame])

  return {
    gameState,
    handleKeyDown,
    handleMouseDown
  }
}