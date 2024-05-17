import { randomInt } from 'crypto'
import { Entity, System, createApplicationBuilder } from '../../ecs'
import { range } from '../../lib'
import { Rect2, Vec2 } from '../../math/types'
import { terminalModule } from '../../terminal'
import { DungeonState, Tile } from './types'
import { rect2, vec2 } from '../../math'
import { Color, TerminalState } from '../../terminal/types'
import { dungeonModule } from './dungeon'
import { heroModule } from './hero'

export const createRogueGame = () =>
  createApplicationBuilder()
    .module(terminalModule)
    .module(dungeonModule)
    .module(heroModule)
