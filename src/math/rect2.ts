import { Rect2 } from './types'
import { vec2 } from './vector2'
const { round } = Math
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
  round: () => rect2(round(left), round(top), round(right), round(bottom)),
  contains: ({ x, y }) => x >= left && x <= right && y >= top && y <= bottom,
  dimensions: () => vec2(right - left, bottom - top),
  covers: ({ left: l, top: t, right: r, bottom: b }) =>
    left <= l && top <= t && right >= r && bottom >= b,
  intersects: ({ left: l, top: t, right: r, bottom: b }) =>
    !(left > r || right < l || top > b || bottom < t),
})
