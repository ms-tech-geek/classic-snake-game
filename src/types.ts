export interface GameState {
  score: number
  gameover: boolean
  gameovertime: number
  initialized: boolean
  preloaded: boolean
  touchStartX: number
  touchStartY: number
}