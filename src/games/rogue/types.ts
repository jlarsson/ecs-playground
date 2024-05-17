import { Rect2, Vec2 } from '../../math/types'
import { TerminalChar } from '../../terminal/types'

export type TileType = 'floor' | 'wall'

export interface Drawable {
  position: Vec2
  sprite: TerminalChar
}

export interface Tile extends Drawable {
  tileType: TileType
}

export interface HeroState {
  hero: {
    position: Vec2
  }
}
export interface DungeonState {
  dungeon: {
    bounds: Rect2
    walls: boolean[][]
  }
}
