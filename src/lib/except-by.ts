import { Func } from './types'

export const exceptBy = <T, K>(
  items: T[],
  key: Func<K, [T]>
): Func<boolean, [T]> => {
  const except = new Set(items.map(key))
  return item => !except.has(key(item))
}
