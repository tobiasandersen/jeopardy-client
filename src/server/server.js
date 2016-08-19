import config from './config'
import http from 'http'
import createApp from './app'

const app = createApp()
const server = http.createServer(app)

server.listen(config.http.port)

async function gracefulShutdown () {
  await new Promise(resolve => server.close(resolve))
  process.exit(0)
}

if (config.isProduction) {
  // Listen for TERM signal .e.g. kill
  process.on('SIGTERM', gracefulShutdown)

  // Listen for INT signal e.g. Ctrl-C
  process.on('SIGINT', gracefulShutdown)
}
