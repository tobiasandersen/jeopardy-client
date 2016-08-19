import React, { Component, PropTypes } from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import Layout from 'layout'
import Dashboard from './dashboard'

export default class Routes extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  indexRedirect = (nextState, replace, next) => {
    replace('/dashboard')
    next()
  }

  render () {
    const { history } = this.props

    return (
      <Router history={history}>
        <Route path='/' component={Layout}>
          <IndexRoute onEnter={this.indexRedirect} />
          <Route path='dashboard' component={Dashboard} />
        </Route>
      </Router>
    )
  }
}
