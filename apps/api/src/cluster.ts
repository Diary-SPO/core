import { spawn } from 'bun'

const cpus = navigator.hardwareConcurrency
const buns = new Array(cpus)

for (let i = 0; i < cpus; i++) {
  buns[i] = spawn({
    cmd: ['bun', './src/main.ts'],
    stdout: 'inherit',
    stderr: 'inherit',
    stdin: 'inherit'
  })
}

function kill() {
  for (const bun of buns) {
    bun.kill()
  }
}

process.on('SIGINT', kill)
process.on('exit', kill)
