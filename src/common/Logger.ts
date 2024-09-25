import { isDebugEnable } from './DebugEnable.ts'

function createLogger(level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' = 'info') {
  const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const
  const levelIndex = levels.indexOf(level)

  // eslint-disable-next-line no-unused-vars
  const levelColors: { [key in (typeof levels)[number]]: string } = {
    trace: 'color: gray',
    debug: 'color: blue',
    info: 'color: green',
    warn: 'color: orange',
    error: 'color: red',
    fatal: 'color: magenta'
  }

  const logMethod = (method: (typeof levels)[number], ...args: unknown[]) => {
    if (levels.indexOf(method) >= levelIndex) {
      const color = levelColors[method]
      // eslint-disable-next-line no-console
      console.log(`%c[${method.toUpperCase()}]%c`, color, '', ...args)
    }
  }

  return {
    trace: (...args: unknown[]) => logMethod('trace', ...args),
    debug: (...args: unknown[]) => logMethod('debug', ...args),
    info: (...args: unknown[]) => logMethod('info', ...args),
    warn: (...args: unknown[]) => logMethod('warn', ...args),
    error: (...args: unknown[]) => logMethod('error', ...args),
    fatal: (...args: unknown[]) => logMethod('fatal', ...args)
  }
}

export const log = createLogger(isDebugEnable ? 'debug' : 'info')
