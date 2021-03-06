import React from 'react';
import Overlay from '../overlay';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Confirm extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    cancel: PropTypes.bool,
    history: PropTypes.bool,
    title: PropTypes.string,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    onConfirm: PropTypes.func,
    onClose: PropTypes.func
  }
  static defaultProps = {
    open: false,
    cancel: true,
    history: true,
    cancelText: '取消',
    confirmText: '确定',
    confirmComponent: 'button',
    confirmProps: {
      type: 'button'
    }
  }
  constructor (props) {
    super(props)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }
  render () {
    let {children, className, title, cancelText, confirmText, confirmComponent, confirmProps, cancel, open} = this.props
    let ConfirmComponent = confirmComponent
    return (
      <div className={classnames(["vx-confirm", className])} style={{display:open ? 'table' : 'none'}}>
        <Overlay />
        <div className="vx-confirm--wrapper">
          <div className="vx-confirm--inner confirm-scale-enter confirm-scale-enter-active" ref="inner">
              {title && <div className="vx-confirm--title">{title}</div>}
              <div className="vx-confirm--body">
                <div className="vx-confirm--table">
                  <div className="vx-confirm--cell">
                    {children}
                  </div>
                </div>
              </div>
              <div className="vx-confirm--footer vx-flexbox">
                {cancel && <button className="vx-flexbox--item"  type="button" onClick={this.handleCancel}>{cancelText}</button>}
                <ConfirmComponent className="vx-flexbox--item" {...confirmProps} onClick={this.handleConfirm}>{confirmText}</ConfirmComponent>
              </div>
            </div>
        </div>
      </div>
    );
  }
  getPushURL () {
    let array = [window.location.href.split('#')[0], window.location.hash]
    array.push(window.location.hash ? (window.location.href.indexOf('?') === -1 ? '?' : '&') : '#')
    array.push('popup=' + Math.random().toString(36).substr(2))
    return array.join('')
  }
  pushState () {
    if (this.props.history) {
      if (window.location.href.indexOf('popup=') > -1) {
        window.history.back()
      }
      setTimeout(() => {
        window.history.pushState({}, '', this.getPushURL())
        let handlePopstate = this.handlePopstate = () => {
          this.props.onClose && this.props.onClose()
          this.popStateBack && this.popStateBack()
          window.removeEventListener('popstate', handlePopstate)
        }
        window.addEventListener('popstate', handlePopstate)
      }, 16)
    }
  }
  goBack () {
    window.removeEventListener('popstate', this.handlePopstate)
    this.props.history && window.location.href.indexOf('popup=') > -1 && window.history.back()
  }
  componentDidUpdate (prevProps) {
    if (prevProps.open !== this.props.open) {
      if (this.props.open) {
        this.pushState()
        setTimeout(() => {
          this.refs.inner.classList.remove(`confirm-scale-enter`)
        }, 16)
      } else {
        this.goBack()
        setTimeout(() => {
          this.refs.inner.classList.add('confirm-scale-enter')
         }, 16)
      }
    }
  }
  handleConfirm (e) {
    if (e.target && e.target.nodeName && e.target.nodeName.toLowerCase() === 'a') {
      setTimeout(() => {
        this.props.onConfirm && this.props.onConfirm()
      }, 400)
    } else {
      this.props.onConfirm && this.props.onConfirm()
    }
  }
  handleCancel () {
    this.props.onClose && this.props.onClose()
  }
}

export default Confirm;
