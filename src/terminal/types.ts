import { ScreenBuffer } from 'terminal-kit'
import { Vec2 } from '../math/types'

export enum Color {
  black = 0,
  red = 1,
  green = 2,
  yellow = 3,
  blue = 4,
  magenta = 5,
  violet = 5,
  cyan = 6,
  white = 7,
  grey = 8,
  gray = 8,
  brightBlack = 8,
  brightRed = 9,
  brightGreen = 10,
  brightYellow = 11,
  brightBlue = 12,
  brightMagenta = 13,
  brightViolet = 13,
  brightCyan = 14,
  brightWhite = 15,
}
export interface TerminalState {
  terminal: {
    screenBuffer: ScreenBuffer
    screenOffset: Vec2
    buffer: DepthBuffer
    keyboard: any
  }
}

export interface TerminalChar {
  color: Color
  bgColor: Color
  charCode: number
}

export interface DepthBuffer {
  width: number
  height: number
  draw: (x: number, y: number, zIndex: number, char: TerminalChar) => void
  writeTo: (sb: ScreenBuffer) => void
}

export interface WidthHeight {
  width: number
  height: number
}
