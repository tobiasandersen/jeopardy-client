import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import Routes from 'routes/index'
import { browserHistory } from 'react-router'

window.React = React

ReactDOM.render(
  <AppContainer>
    <Routes history={browserHistory} />
  </AppContainer>,
  document.getElementById('root')
)

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./routes', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextRoutes = require('./routes').default
    ReactDOM.render(
      <AppContainer>
        <NextRoutes history={history} />
      </AppContainer>,
      document.getElementById('root')
    )
  })
}
