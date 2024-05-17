import { ApplicationBuilder, Entity, System } from '../../ecs/types'
import { vec2 } from '../../math'
import { Vec2 } from '../../math/types'
import { Color, TerminalState } from '../../terminal/types'
import { DungeonState, HeroState } from './types'

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
    .addSystem('render', renderHero)

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
    dungeon: { walls, bounds },
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
    }
  }
}
