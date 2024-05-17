import { ComponentRepository, Query } from './types'

export const createQuery = <T>(
  components: ComponentRepository<T>
): Query<T> => ({
  iter: s => components.iter(s) as any,
  iter_combinations: s => components.iter_combinations(s) as any,
})
