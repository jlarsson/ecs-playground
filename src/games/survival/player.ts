import { ApplicationBuilder, Entity, System } from '../../ecs/types'
import { vec2 } from '../../math'
import { Color, TerminalState } from '../../terminal/types'
import { Drawable, Player, Position } from './types'

export const playerModule = (
  builder: ApplicationBuilder<Entity, TerminalState>
) => builder.addSystem('startup', createPlayer).addSystem('update', movePlayer)

const createPlayer: System<Player & Drawable> = ({ commands }) => {
  commands.spawn({
    sprite: {
      charCode: 'X'.charCodeAt(0),
      color: Color.red,
      bgColor: Color.green,
    },
    position: vec2(10, 5),
    player: true,
    zIndex: 100,
  })
}

const movePlayer: System<Player & Position, TerminalState> = ({
  query,
  state,
}) => {
  const { keyboard } = state.terminal
  for (const player of query.iter({ position: true, player: true })) {
    if (keyboard.UP) {
      player.position = player.position.add(vec2(0, -1))
    }
    if (keyboard.DOWN) {
      player.position = player.position.add(vec2(0, 1))
    }
    if (keyboard.LEFT) {
      player.position = player.position.add(vec2(-1, 0))
    }
    if (keyboard.RIGHT) {
      player.position = player.position.add(vec2(1, 0))
    }
  }
}
