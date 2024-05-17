export interface Empty {}
export interface Entity {
  id: string
}
export type QuerySelection<T> = { [Property in keyof T]?: boolean }
export interface Query<T> {
  iter: <S extends QuerySelection<T>>(
    s: S
  ) => Iterable<{
    [K in keyof T]-?: S[K] extends true ? T[K] : never
  }>
  iter_combinations: <S extends QuerySelection<T>>(
    s: S
  ) => Iterable<
    [
      {
        [K in keyof T]-?: S[K] extends true ? T[K] : never
      },
    ]
  >
}
export interface Commands<T> {
  spawn: (entity: Partial<T>) => Component<T>
}
export interface SystemContext<TEntity, TState> {
  state: TState
  query: Query<TEntity>
  commands: Commands<TEntity>
  time: GameTime
}
export type System<TEntity, TState = Empty> = (
  context: SystemContext<Partial<TEntity>, TState>
) => any

export type SystemScope =
  | 'prestartup'
  | 'startup'
  | 'poststartup'
  | 'preupdate'
  | 'update'
  | 'postupdate'
  | 'prerender'
  | 'render'
  | 'postrender'

export type Module<E, S, E2, S2> = (
  builder: ApplicationBuilder<E, S>
) => ApplicationBuilder<E2, S2>
export interface ApplicationBuilder<E, S = Empty> {
  module: <E2, S2>(
    module: Module<E, S, E2, S2>
  ) => ApplicationBuilder<E & E2, S & S2>
  addState: <S2>(state: S2) => ApplicationBuilder<E, S & S2>
  addSystem: <E2>(
    scope: SystemScope,
    system: System<E2, S>
  ) => ApplicationBuilder<E & E2, S>
  create: () => Application<E, S>
}

export interface Application<TEntity, TState> {
  start: () => any
}

export type Component<T> = Partial<T> & Entity

export interface ComponentRepository<T> {
  createNew: (entities: Partial<T>) => Component<T>
  add: (components: Component<T>[]) => any
  remove: (components: Component<T>[]) => any
  iter: <S extends QuerySelection<T>>(s: S) => Iterable<Component<T>>
  iter_combinations: <S extends QuerySelection<T>>(
    s: S
  ) => Iterable<[Component<T>, Component<T>]>
}

export interface GameTime {
  elapsed: number
}
