import { Vec2 } from '../../math/types'
import { TerminalChar } from '../../terminal/types'

export interface Drawable {
  position: Vec2
  zIndex: number
  sprite: TerminalChar
}

export interface Player {
  player: true
}

export interface Monster {
  monster: {
    speed: number
  }
}

export interface Position {
  position: Vec2
}
