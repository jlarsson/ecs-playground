import { ScreenBuffer, terminal, TextBuffer } from 'terminal-kit'
import { ApplicationBuilder, Entity, System } from '../ecs/types'
import { createDepthBuffer } from './depth-buffer'
import { Color, TerminalState } from './types'
import { vec2 } from '../math'

export const terminalModule = <E, S>(builder: ApplicationBuilder<E, S>) =>
  builder
    .addState<TerminalState>({
      terminal: {
        screenBuffer: new ScreenBuffer({ dst: terminal }),
        screenOffset: vec2(0, 0),
        keyboard: {},
        buffer: createDepthBuffer(terminal, vec2(0, 0)),
      },
    })
    .addSystem('startup', setupTerminal)
    .addSystem('postupdate', ({ state }) => {
      state.terminal.keyboard = {}
    })
    .addSystem('prerender', ({ state }) => {
      state.terminal.buffer = createDepthBuffer(
        terminal,
        state.terminal.screenOffset
      )
    })
    .addSystem('postrender', renderScene)

const setupTerminal: System<Entity, TerminalState> = ({ state }) => {
  terminal.fullscreen(true)
  terminal.grabInput(true)
  terminal.on('key', (key: string) => {
    if (key === 'CTRL_C') {
      process.exit(1)
    }
    state.terminal.keyboard = { [key]: true }
  })
  terminal.on('resize', (width: number, height: number) => {
    state.terminal.screenBuffer = new ScreenBuffer({ dst: terminal })
    state.terminal.buffer = createDepthBuffer(
      { width, height },
      state.terminal.screenOffset
    )
  })
}

const renderScene: System<Entity, TerminalState> = ({ state }) => {
  const {
    terminal: { buffer, screenBuffer },
  } = state
  screenBuffer.clear()
  screenBuffer.fill({
    attr: {
      color: Color.black,
      bgColor: Color.black,
    },
    char: ' ',
  })
  buffer.writeTo(screenBuffer)
  screenBuffer.draw()
}
