import { createDeferredCommands } from './commands'
import { createComponentRepository } from './component-repository'
import { createQuery } from './query'
import { Application, GameTime, System, SystemScope } from './types'

export type SystemMap<E, S> = Record<SystemScope, System<E, S>[]>

export const createApplication = <E, S>(
  systems: SystemMap<E, S>,
  state: S
): Application<E, S> => {
  const components = createComponentRepository<E>()

  const runSystems = (systems: System<E, S>[], elapsed: number) => {
    const commands = createDeferredCommands<E>(components)
    const query = createQuery(components)
    const now = Date.now()
    const time: GameTime = {
      elapsed,
    }
    systems.forEach(system =>
      system({
        query,
        commands,
        time,
        state,
      })
    )
    commands.execute()
  }

  let updateLoop: NodeJS.Timeout | null = null
  let renderLoop: NodeJS.Timeout | null = null

  const app: Application<E, S> = {
    start: () => {
      runSystems(systems.prestartup, 0)
      runSystems(systems.startup, 0)
      runSystems(systems.poststartup, 0)

      let lastTime = Date.now()
      updateLoop = setInterval(() => {
        const now = Date.now()
        const elapsed = now - lastTime
        lastTime = now
        runSystems(systems.preupdate, elapsed)
        runSystems(systems.update, elapsed)
        runSystems(systems.postupdate, elapsed)
      }, 50)

      renderLoop = setInterval(() => {
        const now = Date.now()
        const elapsed = now - lastTime
        lastTime = now
        runSystems(systems.prerender, elapsed)
        runSystems(systems.render, elapsed)
        runSystems(systems.postrender, elapsed)
      }, 200)

      return app
    },
  }
  return app
}
