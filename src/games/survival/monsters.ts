import { ApplicationBuilder, Empty, Entity, System } from '../../ecs/types'
import { vec2 } from '../../math'
import { Color } from '../../terminal/types'
import { Drawable, Monster, Player } from './types'

export const monsterModule = (builder: ApplicationBuilder<Entity>) =>
  builder.addSystem('startup', createMonsters).addSystem('update', moveMonsters)

const createMonsters: System<Monster & Drawable> = ({ commands }) => {
  for (let i = 0; i < 200; ++i) {
    commands.spawn({
      sprite: {
        charCode: '☹︎'.charCodeAt(0),
        color: Color.red,
        bgColor: Color.yellow,
      },
      position: vec2(i, i),
      zIndex: 1,
      monster: { speed: 0.1 + 0.5 * Math.random() },
    })
  }
}

const moveMonsters: System<Monster & Player & Drawable> = ({ query }) => {
  const [player] = query.iter({ position: true, player: true })
  for (const monster of query.iter({ position: true, monster: true })) {
    const delta = player.position
      .substract(monster.position)
      .normalize()
      .multiply(monster.monster.speed)
    monster.position = monster.position.add(delta)
  }
}
