import { SystemMap, createApplication } from './application'
import { ApplicationBuilder, Empty, Entity, Module } from './types'

export const createApplicationBuilder = () =>
  createRuntimeApplicationBuilder<Entity, Empty>(
    {
      prestartup: [],
      startup: [],
      poststartup: [],
      preupdate: [],
      update: [],
      postupdate: [],
      prerender: [],
      render: [],
      postrender: [],
    },
    {}
  )

const createRuntimeApplicationBuilder = <E extends Entity, S>(
  systems: SystemMap<E, S>,
  state: S
): ApplicationBuilder<E, S> => {
  const builder: ApplicationBuilder<E, S> = {
    module: <E2, S2>(m: Module<E, S, E2, S2>) =>
      m(builder) as ApplicationBuilder<E & E2, S & S2>,
    addState: s => createRuntimeApplicationBuilder(systems, { ...state, ...s }),
    addSystem: (scope, system) =>
      createRuntimeApplicationBuilder(
        {
          ...systems,
          [scope]: [...systems[scope], system],
        },
        state
      ),
    create: () => createApplication<E, S>(systems, state),
  }
  return builder
}
