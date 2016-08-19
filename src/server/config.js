import nconf from 'nconf'

export default nconf
  .argv()
  .env('__')
  .defaults({
    isProduction: process.env.NODE_ENV === 'production',
    cors: {
      origin: process.env.NODE_ENV !== 'production'
    },
    http: {
      port: 8000
    },
    deepstream: {
      host: '0.0.0.0',
      port: 6021,
      credentials: null,
      maxReconnectAttempts: Infinity,
      maxReconnectInterval: 10000
    }
  })
  .get()
