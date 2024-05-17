import { Commands, Component, ComponentRepository } from './types'

export const createDeferredCommands = <T>(
  components: ComponentRepository<T>
): Commands<T> & { execute: () => any } => {
  const added: Component<T>[] = []
  const removed: Component<T>[] = []
  return {
    spawn: entity => {
      const component = components.createNew(entity)
      added.push(component)
      return component
    },
    execute: () => {
      components.add(added)
      components.remove(removed)
    },
  }
}
