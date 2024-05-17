import { ScreenBuffer, Terminal } from 'terminal-kit'
import { range } from '../lib'
import { rect2, vec2 } from '../math'
import { Vec2 } from '../math/types'
import { DepthBuffer, TerminalChar, WidthHeight } from './types'

export const createDepthBuffer = (
  { width, height }: WidthHeight,
  offset: Vec2
): DepthBuffer => {
  const buffers: TerminalChar[][][] = []
  const rect = rect2(0, 0, width, height)
  return {
    width,
    height,
    draw: (x, y, zIndex, char) => {
      const p = vec2(x, y).substract(offset).round()
      if (rect.contains(p)) {
        const zl = buffers[zIndex] || (buffers[zIndex] = [])
        const xl = zl[p.x] || (zl[p.x] = [])
        xl[p.y] = char
      }
    },
    writeTo: sb => {
      buffers.forEach(zlist =>
        zlist.forEach((xlist, x) =>
          xlist.forEach(({ charCode, color, bgColor }, y) => {
            sb.put(
              {
                x,
                y,
                wrap: false,
                dx: 0,
                dy: 0,
                attr: {
                  color,
                  bgColor,
                },
              },
              String.fromCharCode(charCode)
            )
          })
        )
      )
    },
  }
}
