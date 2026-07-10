import { execSync } from 'node:child_process'

const requestedPort = process.argv[2]
const port = Number(requestedPort)

if (!requestedPort || Number.isNaN(port)) {
  console.error('Usage: node scripts/free-port.mjs <port>')
  process.exit(1)
}

function run(command) {
  return execSync(command, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function parsePids(netstatOutput) {
  return [...new Set(netstatOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.includes(`:${port}`) && line.includes('LISTENING'))
    .map((line) => Number(line.split(/\s+/).at(-1)))
    .filter((pid) => !Number.isNaN(pid)))]
}

let pids = []

try {
  pids = parsePids(run(`netstat -ano | findstr :${port}`))
} catch {
  process.exit(0)
}

for (const pid of pids) {
  try {
    const commandLine = run(`powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId = ${pid}').CommandLine"`).trim()
    const isViteProcess = /vite(?:\.js)?/i.test(commandLine)

    if (!isViteProcess) {
      console.error(`Port ${port} is in use by a non-Vite process (${pid}). Stop that process manually before starting the frontend.`)
      process.exit(1)
    }

    run(`taskkill /PID ${pid} /F`)
    console.log(`Stopped stale Vite process on port ${port} (PID ${pid}).`)
  } catch (error) {
    console.error(`Failed to inspect or stop process ${pid} on port ${port}.`)
    if (error instanceof Error && error.message) {
      console.error(error.message)
    }
    process.exit(1)
  }
}