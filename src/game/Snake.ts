interface Segment {
  x: number
  y: number
}

export class Snake {
  x: number = 0
  y: number = 0
  direction: number = 1
  speed: number = 1
  movedelay: number = 0
  segments: Segment[] = []
  growsegments: number = 0

  readonly directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]

  init(x: number, y: number, direction: number, speed: number, numsegments: number) {
    this.x = x
    this.y = y
    this.direction = direction
    this.speed = speed
    this.movedelay = 0
    this.segments = []
    this.growsegments = 0

    for (let i = 0; i < numsegments; i++) {
      this.segments.push({
        x: this.x - i * this.directions[direction][0],
        y: this.y - i * this.directions[direction][1]
      })
    }
  }

  grow() {
    this.growsegments++
  }

  tryMove(dt: number) {
    this.movedelay += dt
    const maxmovedelay = 1 / this.speed
    if (this.movedelay > maxmovedelay) {
      this.movedelay = 0
      return true
    }
    return false
  }

  nextMove() {
    const nextx = this.x + this.directions[this.direction][0]
    const nexty = this.y + this.directions[this.direction][1]
    return { x: nextx, y: nexty }
  }

  move() {
    const nextmove = this.nextMove()
    this.x = nextmove.x
    this.y = nextmove.y

    const lastseg = this.segments[this.segments.length - 1]
    const growx = lastseg.x
    const growy = lastseg.y

    for (let i = this.segments.length - 1; i >= 1; i--) {
      this.segments[i].x = this.segments[i - 1].x
      this.segments[i].y = this.segments[i - 1].y
    }

    if (this.growsegments > 0) {
      this.segments.push({ x: growx, y: growy })
      this.growsegments--
    }

    this.segments[0].x = this.x
    this.segments[0].y = this.y
    this.movedelay = 0
  }
}