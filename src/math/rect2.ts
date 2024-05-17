import { Rect2 } from './types'
import { vec2 } from './vector2'

export const rect2 = (
  left: number,
  top: number,
  right: number,
  bottom: number
): Rect2 => ({
  left,
  top,
  right,
  bottom,
  contains: ({ x, y }) => x >= left && x <= right && y >= top && y <= bottom,
  dimensions: () => vec2(right - left, bottom - top),
})
