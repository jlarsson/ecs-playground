import { Vec2 } from './types'
/*
class Vec2Impl extends Vec2 {
    constructor (x: number, y: number) {

    }
    add: (p,q) => new Vec2Impl()
}
*/

const { abs, sqrt, round, floor } = Math
const { EPSILON } = Number

const isZero = (n: number) => abs(n) < EPSILON

export const vec2 = (x = 0, y = 0): Vec2 => ({
  x,
  y,
  lerp: ({ x: p, y: q }, f) => vec2(x + f * (p - x), y + f * (q - y)),
  lerpn: ({ x: p, y: q }, f) =>
    vec2(x + f * (p - x), y + f * (q - y))
      .normalize()
      .multiply(f),
  length: () => sqrt(x * x + y * y),
  add: ({ x: p, y: q }) => vec2(x + p, y + q),
  substract: ({ x: p, y: q }) => vec2(x - p, y - q),
  multiply: (f: number) => vec2(x * f, y * f),
  normalize: () => {
    const l = sqrt(x * x + y * y)
    return isZero(l) ? vec2(x, y) : vec2(x / l, y / l)
  },
  round: () => vec2(round(x), round(y)),
  floor: () => vec2(floor(x), floor(y)),
  inside: ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
    x >= x1 && x <= x2 && y >= y1 && y <= y2,
})
