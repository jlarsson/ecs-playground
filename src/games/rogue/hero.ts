import { ApplicationBuilder, Entity, System } from '../../ecs/types'
import { vec2 } from '../../math'
import { Rect2, Vec2 } from '../../math/types'
import { Color, TerminalState } from '../../terminal/types'
import { DungeonState, HeroState } from './types'

const { max, min } = Math

export const heroModule = (
  builder: ApplicationBuilder<Entity, TerminalState & DungeonState>
) =>
  builder
    .addState<HeroState>({
      hero: {
        position: vec2(0, 0),
      },
    })
    .addSystem('update', moveHero)
    .addSystem('update', setViewPort)
    .addSystem('render', renderHero)
    .addSystem('poststartup', initVisibility)

const renderHero: System<Entity, TerminalState & HeroState> = ({
  state: {
    terminal: { buffer },
    hero: {
      position: { x, y },
    },
  },
}) => {
  buffer.draw(x, y, 100, {
    color: Color.blue,
    bgColor: Color.black,
    charCode: '@'.charCodeAt(0),
  })
}

const moveHero: System<Entity, TerminalState & DungeonState & HeroState> = ({
  state: {
    terminal: { keyboard },
    dungeon: { walls, bounds, visibleCells },
    hero,
  },
}) => {
  const { UP, DOWN, LEFT, RIGHT } = keyboard
  const deltaPos: Vec2 | null = UP
    ? vec2(0, -1)
    : DOWN
      ? vec2(0, 1)
      : LEFT
        ? vec2(-1, 0)
        : RIGHT
          ? vec2(1, 0)
          : null
  if (deltaPos) {
    let newPos = hero.position.add(deltaPos)
    if (bounds.contains(newPos) && !walls[newPos.x][newPos.y]) {
      hero.position = newPos

      updateVisibility(hero.position, bounds, visibleCells)
    }
  }
}

const setViewPort: System<Entity, TerminalState & HeroState & DungeonState> = ({
  state: {
    hero: { position },
    terminal,
    dungeon: { bounds },
  },
}) => {
  const { width, height } = terminal.buffer

  const ox = max(0, min(max(0, position.x - width / 2), bounds.left - width))
  const oy = max(
    0,
    min(max(0, position.y - height / 2), bounds.bottom - height)
  )

  terminal.screenOffset = vec2(ox, oy)
}

const initVisibility: System<Entity, DungeonState & HeroState> = ({
  state: { dungeon, hero },
}) => {
  // turn on total darkness
  dungeon.visibleCells = dungeon.visibleCells.map(l => l.map(() => false))
  updateVisibility(hero.position, dungeon.bounds, dungeon.visibleCells)
}

const updateVisibility = (
  { x, y }: Vec2,
  bounds: Rect2,
  visibleCells: boolean[][]
) => {
  const radius = 10
  const radius2 = radius * radius
  const { top, left, right, bottom } = bounds
  const width = right - left,
    height = bottom - top
  for (let vx = x - radius; vx <= x + radius; ++vx) {
    for (let vy = y - radius; vy <= y + radius; vy++) {
      const l2 = (x - vx) * (x - vx) + (y - vy) * (y - vy)
      if (vx >= 0 && vx < width && vy >= 0 && vy < height && l2 < radius2) {
        visibleCells[vx][vy] = true
      }
    }
  }
}
