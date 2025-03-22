import React from 'react'
import { forwardRef, MouseEvent } from 'react'

interface GameCanvasProps {
  width: number
  height: number
  onMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void
}

export const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ width, height, onMouseDown }, ref) => {
    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        onClick={onMouseDown}
        style={{ display: 'block' }}
      />
    )
  }
)