import { randomInt } from 'crypto'
import { ApplicationBuilder, Entity, System } from '../../ecs/types'
import { rect2, vec2 } from '../../math'
import { Rect2, Vec2 } from '../../math/types'
import { DungeonState } from './types'
import { range } from '../../lib'
import { Color, TerminalState } from '../../terminal/types'

export const dungeonModule = (
  builder: ApplicationBuilder<Entity, TerminalState>
) =>
  builder
    .addState<DungeonState>(createDungeonState(200, 200))
    .addSystem('render', renderDungeon)

const createDungeonState = (width: number, height: number): DungeonState => {
  const walls = dungeonWalls(width, height, rect2(0, 0, 4, 4))
  const visibleCells = walls.map(l => l.map(() => true))
  return {
    dungeon: {
      bounds: rect2(0, 0, width, height),
      walls,
      visibleCells,
    },
  }
}

const renderDungeon: System<Entity, TerminalState & DungeonState> = ({
  state: {
    terminal: { buffer },
    dungeon: { walls, visibleCells },
  },
}) => {
  walls.forEach((xl, x) =>
    xl.forEach((isWall, y) => {
      visibleCells[x][y] &&
        buffer.draw(x, y, 0, {
          color: isWall ? Color.blue : Color.white,
          bgColor: isWall ? Color.blue : Color.white,
          charCode: ' '.charCodeAt(0),
        })
    })
  )
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
