import compression from 'compression'
import config from './config'
import cors from 'cors'
import cuid from 'cuid'
import express from 'express'
import helmet from 'helmet'
import path from 'path'
import httpProxyMiddleware from 'http-proxy-middleware'
import historyApiFallback from 'connect-history-api-fallback'
import createHTTPError from 'http-errors'

export default function () {
  const app = express()

  Object
    .keys(config.http.proxy || {})
    .forEach(key => app.use(key, httpProxyMiddleware(config.http.proxy[key])))

  app.use(historyApiFallback())

  if (process.env.NODE_ENV !== 'production') {
    const webpackConfig = require('../../webpack.config')
    const webpackCompiler = require('webpack')(webpackConfig)
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    app.use(webpackDevMiddleware(webpackCompiler, {
      stats: {
        colors: true
      }
    }))
    app.use(webpackHotMiddleware(webpackCompiler, {
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000
    }))
  }

  app.use(helmet())

  app.use(cors(config.cors))

  app.use(compression())

  app.get('/healthcheck', (req, res, next) => res.sendStatus(200))

  app.use((req, res, next) => {
    const id = cuid()

    res.set('X-Request-Id', id)

    if (process.env.NODE_ENV === 'production') {
      req.log.info({ req }, 'start request')

      const time = process.hrtime()
      res.on('finish', () => {
        const diff = process.hrtime(time)
        req.log.info({
          req,
          res,
          duration: diff[0] * 1e3 + diff[1] * 1e-6
        }, 'end request')
      })
    }
    next()
  })

  app.use(express.static(path.resolve(__dirname, '../../public')))

  app.use((req, res, next) => next(createHTTPError(404, 'File Not Found')))

  app.use((err, req, res, next) => {
    req.log.error({ err })

    if (res.headersSent) {
      return res.socket.destroy()
    }

    const httpError = createHTTPError(err)

    res.status(httpError.status)

    res.send(
      httpError.expose || !config.isProduction
        ? httpError.message
        : '500 Internal Server Error'
      )
  })

  return app
}
