import { Level } from './Level'
import { Snake } from './Snake'
import { GameState } from '../types'

interface DrawGameProps {
  level: Level
  snake: Snake
  image: HTMLImageElement
  gameState: GameState
}

export function drawGame(
  context: CanvasRenderingContext2D,
  { level, snake, image, gameState }: DrawGameProps
) {
  const { width, height } = context.canvas

  // Draw background
  context.fillStyle = "#f1f5f9"
  context.fillRect(0, 0, width, height)

  // Draw level
  for (let i = 0; i < level.columns; i++) {
    for (let j = 0; j < level.rows; j++) {
      const tile = level.tiles[i][j]
      const tilex = i * level.tilewidth
      const tiley = j * level.tileheight

      if (tile === 0) {
        context.fillStyle = "#e2e8f0"
        context.fillRect(tilex, tiley, level.tilewidth, level.tileheight)
      } else if (tile === 1) {
        context.fillStyle = "#94a3b8"
        context.fillRect(tilex, tiley, level.tilewidth, level.tileheight)
      } else if (tile === 2) {
        context.fillStyle = "#e2e8f0"
        context.fillRect(tilex, tiley, level.tilewidth, level.tileheight)
        
        const tx = 0
        const ty = 3
        const tilew = 64
        const tileh = 64
        context.drawImage(
          image,
          tx * tilew,
          ty * tileh,
          tilew,
          tileh,
          tilex,
          tiley,
          level.tilewidth,
          level.tileheight
        )
      }
    }
  }

  // Draw snake
  for (let i = 0; i < snake.segments.length; i++) {
    const segment = snake.segments[i]
    const tilex = segment.x * level.tilewidth
    const tiley = segment.y * level.tileheight
    
    let tx = 0
    let ty = 0

    if (i === 0) {
      const nseg = snake.segments[i + 1]
      if (segment.y < nseg.y) {
        tx = 3; ty = 0
      } else if (segment.x > nseg.x) {
        tx = 4; ty = 0
      } else if (segment.y > nseg.y) {
        tx = 4; ty = 1
      } else if (segment.x < nseg.x) {
        tx = 3; ty = 1
      }
    } else if (i === snake.segments.length - 1) {
      const pseg = snake.segments[i - 1]
      if (pseg.y < segment.y) {
        tx = 3; ty = 2
      } else if (pseg.x > segment.x) {
        tx = 4; ty = 2
      } else if (pseg.y > segment.y) {
        tx = 4; ty = 3
      } else if (pseg.x < segment.x) {
        tx = 3; ty = 3
      }
    } else {
      const pseg = snake.segments[i - 1]
      const nseg = snake.segments[i + 1]
      
      if ((pseg.x < segment.x && nseg.x > segment.x) || (nseg.x < segment.x && pseg.x > segment.x)) {
        tx = 1; ty = 0
      } else if ((pseg.x < segment.x && nseg.y > segment.y) || (nseg.x < segment.x && pseg.y > segment.y)) {
        tx = 2; ty = 0
      } else if ((pseg.y < segment.y && nseg.y > segment.y) || (nseg.y < segment.y && pseg.y > segment.y)) {
        tx = 2; ty = 1
      } else if ((pseg.y < segment.y && nseg.x < segment.x) || (nseg.y < segment.y && pseg.x < segment.x)) {
        tx = 2; ty = 2
      } else if ((pseg.x > segment.x && nseg.y < segment.y) || (nseg.x > segment.x && pseg.y < segment.y)) {
        tx = 0; ty = 1
      } else if ((pseg.y > segment.y && nseg.x > segment.x) || (nseg.y > segment.y && pseg.x > segment.x)) {
        tx = 0; ty = 0
      }
    }

    context.drawImage(
      image,
      tx * 64,
      ty * 64,
      64,
      64,
      tilex,
      tiley,
      level.tilewidth,
      level.tileheight
    )
  }

  // Draw game over
  if (gameState.gameover) {
    context.fillStyle = "rgba(0, 0, 0, 0.5)"
    context.fillRect(0, 0, width, height)
  }
}