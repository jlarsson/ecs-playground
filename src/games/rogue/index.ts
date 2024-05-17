import { createApplicationBuilder } from '../../ecs'
import { terminalModule } from '../../terminal'
import { dungeonModule } from './dungeon'
import { heroModule } from './hero'

export const createRogueGame = () =>
  createApplicationBuilder()
    .module(terminalModule)
    .module(dungeonModule)
    .module(heroModule)
