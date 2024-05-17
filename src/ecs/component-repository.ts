import { exceptBy } from '../lib/except-by'
import { Component, ComponentRepository, QuerySelection } from './types'

let globalId: number = 1000
const nextId = (): string => (globalId++).toString()

function* iterate<T, S extends QuerySelection<T>>(
  s: S,
  components: Component<T>[]
): Iterable<Component<T>> {
  const filters = Object.entries(s).map(([trait, enabled]) =>
    enabled
      ? (component: Component<T>): boolean =>
          (component as any)[trait] !== undefined
      : (component: Component<T>): boolean =>
          (component as any)[trait] === undefined
  )
  for (let c of components) {
    if (filters.every(f => f(c))) {
      yield c
    }
  }
}

function* iterate_combinations<T, S extends QuerySelection<T>>(
  s: S,
  components: Component<T>[]
): Iterable<[Component<T>, Component<T>]> {
  const l = [...iterate(s, components)]
  for (let i = 0; i < l.length; ++i) {
    for (let j = i + 1; j < l.length; ++j) {
      yield [l[i], l[j]]
    }
  }
}

export const createComponentRepository = <T>(): ComponentRepository<T> => {
  let components: Component<T>[] = []
  const setComponents = (comps: Component<T>[]) => {
    components = comps
  }
  return {
    createNew: entities => ({
      ...entities,
      id: nextId(),
    }),
    add: comps => comps.length > 0 && setComponents([...comps, ...components]),
    remove: comps =>
      comps.length > 0 &&
      setComponents(components.filter(exceptBy(comps, c => c.id))),
    iter: s => iterate(s, components),
    iter_combinations: s => iterate_combinations(s, components),
  }
}
