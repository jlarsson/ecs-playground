export interface Vec2Like {
  x: number
  y: number
}
export interface Rect2Like {
  top: number
  left: number
  bottom: number
  right: number
}
export interface Vec2 {
  x: number
  y: number
  lerp: (other: Vec2Like, factor: number) => Vec2
  lerpn: (other: Vec2Like, factor: number) => Vec2
  length: () => number
  add: (other: Vec2Like) => Vec2
  substract: (other: Vec2Like) => Vec2
  multiply: (f: number) => Vec2
  normalize: () => Vec2
  round: () => Vec2
  floor: () => Vec2
  inside: (topLeft: Vec2Like, bottomRight: Vec2Like) => boolean
}

export interface Rect2 {
  top: number
  left: number
  bottom: number
  right: number
  round(): Rect2
  contains: (point: Vec2Like) => boolean
  dimensions: () => Vec2
  covers(outer: Rect2Like): boolean
  intersects(r: Rect2Like): boolean
}
