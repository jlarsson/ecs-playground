import { ScreenBuffer, Terminal } from 'terminal-kit'
import { range } from '../lib'
import { rect2 } from '../math'
import { Vec2 } from '../math/types'
import { DepthBuffer, TerminalChar, WidthHeight } from './types'

export const createDepthBuffer = ({
  width,
  height,
}: WidthHeight): DepthBuffer => {
  const buffers: TerminalChar[][][] = []
  const rect = rect2(0, 0, width, height)
  return {
    width,
    height,
    draw: (x, y, zIndex, char) => {
      if (rect.contains({ x, y })) {
        const zl = buffers[zIndex] || (buffers[zIndex] = [])
        const xl = zl[x] || (zl[x] = [])
        xl[y] = char
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
    /*
    writeTo: tb => {
      const { x: width, y: height } = rect.dimensions().round()
      const grid = range(height).map(() => range(width).map(() => ' '))
      buffers.forEach(zlist =>
        zlist.forEach((xlist, x) =>
          xlist.forEach((sprite, y) => {
            grid[y][x] = sprite
          })
        )
      )
      tb.setText(grid.map(row => row.join('')).join('\n'))
    },
    */
  }
}
