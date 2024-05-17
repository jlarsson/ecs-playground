import { System, createApplicationBuilder } from '../../ecs'
import { terminalModule } from '../../terminal'
import { TerminalState } from '../../terminal/types'
import { monsterModule } from './monsters'
import { playerModule } from './player'
import { Drawable } from './types'

export const createSurvivalGameApp = () =>
  createApplicationBuilder()
    .module(terminalModule)
    .module(playerModule)
    .module(monsterModule)
    .addSystem('render', renderScene)

const renderScene: System<Drawable, TerminalState> = ({ query, state }) => {
  const {
    terminal: { buffer },
  } = state
  for (const { position, zIndex, sprite } of query.iter({
    position: true,
    zIndex: true,
    sprite: true,
  })) {
    const { x, y } = position.round()
    buffer.draw(x, y, zIndex, sprite)
  }
}
