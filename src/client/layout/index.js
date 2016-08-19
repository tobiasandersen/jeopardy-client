import React, { Component } from 'react'
import classNames from 'classnames/bind'
import styles from './index.css'

const cn = classNames.bind(styles)

export default class Layout extends Component {
  render () {
    return (
      <div className={cn('container')}>
        {this.props.children}
      </div>
    )
  }
}
