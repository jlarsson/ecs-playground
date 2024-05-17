import { Func } from './types'

export const uniqBy = <T, K>(key: Func<K, [T]>): Func<boolean, [T]> => {
  return () => false
}
