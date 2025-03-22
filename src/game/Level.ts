export class Level {
  tiles: number[][]

  constructor(
    public columns: number,
    public rows: number,
    public tilewidth: number,
    public tileheight: number
  ) {
    this.tiles = Array(columns).fill(0).map(() => Array(rows).fill(0))
  }

  generate() {
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (i === 0 || i === this.columns - 1 || j === 0 || j === this.rows - 1) {
          this.tiles[i][j] = 1
        } else {
          this.tiles[i][j] = 0
        }
      }
    }
  }
}