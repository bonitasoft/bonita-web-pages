import React, { Component } from 'react';
import './alert.css';

export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: false
    };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ closed: true });
    this.props.onClose && this.props.onClose();
  }

  render() {
    return (
      <div
        className={`Alert is-${this.props.severity} ${
          this.state.closed ? 'is-closed' : ''
        }`}
      >
        <p>{this.props.message}</p>
        <span className="Alert-closeBtn" onClick={this.handleClose}>
          ×
        </span>
      </div>
    );
  }
}
