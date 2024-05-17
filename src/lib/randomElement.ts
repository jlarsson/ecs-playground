import { randomInt } from 'crypto'

export const randomElement = <T>(list: T[]): T | undefined =>
  list.length > 0 ? list[randomInt(list.length)] : undefined
