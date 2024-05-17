import { randomInt } from 'crypto'
import { Entity, System, createApplicationBuilder } from '../../ecs'
import { die, range } from '../../lib'
import { Rect2, Vec2 } from '../../math/types'
import { terminalModule } from '../../terminal'
import { DungeonState, Player, Tile } from './types'
import { rect2, vec2 } from '../../math'
import { Color, TerminalState } from '../../terminal/types'
import { randomElement } from '../../lib/randomElement'
import { terminal } from 'terminal-kit'
import { buffer } from 'stream/consumers'
import { groupEmit } from 'terminal-kit/ScreenBufferHD'

const createDungeonState = (width: number, height: number): DungeonState => ({
  dungeon: {
    bounds: rect2(0, 0, width, height),
    walls: dungeonWalls(width, height, rect2(0, 0, 4, 4)),
  },
})

export const createRogueGame = () =>
  createApplicationBuilder()
    .module(terminalModule)
    .addState<DungeonState>(createDungeonState(100, 100))
    .addSystem('startup', generateDungeon)
    .addSystem('startup', spawnPlayer)
    .addSystem('update', movePlayer)
    .addSystem('render', renderDungeon)
    .addSystem('render', renderPlayer)

const spawnPlayer: System<Player> = ({ commands }) => {
  commands.spawn({
    position: vec2(1, 1),
    isPlayer: true,
  })
}
const renderPlayer: System<Player, TerminalState> = ({
  query,
  state: {
    terminal: { buffer },
  },
}) => {
  const [
    {
      position: { x, y },
    },
  ] = query.iter({ isPlayer: true })
  buffer.draw(x, y, 100, {
    color: Color.blue,
    bgColor: Color.black,
    charCode: '@'.charCodeAt(0),
  })
}

const movePlayer: System<Player, DungeonState & TerminalState> = ({
  query,
  state: {
    terminal: { keyboard },
    dungeon: { walls, bounds },
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
    const [player] = query.iter({ position: true, isPlayer: true })
    let newPos = player.position.add(deltaPos)
    if (bounds.contains(newPos) && !walls[newPos.x][newPos.y]) {
      player.position = newPos
    }
  }
}
const generateDungeon: System<Tile, DungeonState> = ({
  commands,
  state: {
    dungeon: { walls },
  },
}) => {
  walls.forEach((col, x) =>
    col.forEach((isWall, y) => {
      commands.spawn({
        position: vec2(x, y),
        tileType: isWall ? 'wall' : 'floor',
      })
    })
  )
}

const renderDungeon: System<Tile, TerminalState> = ({ query, state }) => {
  const {
    terminal: { buffer },
  } = state
  for (let {
    position: { x, y },
    tileType,
  } of query.iter({ position: true, tileType: true })) {
    buffer.draw(x, y, 0, {
      color: tileType === 'floor' ? Color.white : Color.black,
      bgColor: tileType === 'floor' ? Color.white : Color.black,
      charCode: ' '.charCodeAt(0),
    })
  }
}

const dungeonWalls = (
  width: number,
  height: number,
  spawnRoom: Rect2
): boolean[][] => {
  const interior = rect2(1, 1, width - 2, height - 2)
  const generateRooms = (): Rect2[] => {
    let attempts = 500
    // Generate bigger rooms until we fail to add more...
    // we start with the staring room
    const rooms: Rect2[] = [spawnRoom]
    while (attempts > 0) {
      const [l, t, w, h] = [
        randomInt(width),
        randomInt(height),
        5 + randomInt(5),
        5 + randomInt(5),
      ]
      const room = rect2(l, t, l + w, t + h)
      const roomWalls = rect2(l - 1, t - 1, l + w + 1, t + h + 1)
      if (
        interior.covers(room) &&
        !rooms.some(other => other.intersects(roomWalls))
      ) {
        rooms.push(room)
      } else {
        --attempts
      }
    }
    return rooms
  }

  const generateMaze = (walls: boolean[][]) => {
    const wallDeltas = [vec2(-1, 0), vec2(1, 0), vec2(0, -1), vec2(0, 1)]
    const neighborDeltas = [vec2(-2, 0), vec2(2, 0), vec2(0, -2), vec2(0, 2)]

    const wallsOf = (cell: Vec2) =>
      wallDeltas
        .map(delta => cell.add(delta))
        .filter(wall => interior.contains(wall))
    const neighborsOf = (cell: Vec2) =>
      neighborDeltas
        .map(delta => cell.add(delta))
        .filter(wall => interior.contains(wall))

    const queue: Vec2[] = []
    const start = vec2(10, 10)
    walls[start.x][start.y] = false
    queue.push(...wallsOf(start))
    while (queue.length) {
      const [wall] = queue.splice(randomInt(queue.length), 1)
      const visited = wallsOf(wall).filter(({ x, y }) => !walls[x][y])
      if (visited.length === 1) {
        walls[wall.x][wall.y] = false
        queue.push(...wallsOf(wall))
      }
    }
  }

  const walls = range(width).map(() => range(height).map(() => true))
  generateMaze(walls)

  generateRooms().forEach(({ left, right, top, bottom }) => {
    for (let x = left; x <= right; ++x) {
      for (let y = top; y <= bottom; ++y) {
        walls[x][y] = false
      }
    }
  })

  return walls
}
