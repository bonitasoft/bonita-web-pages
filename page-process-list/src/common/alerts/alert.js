import React, { Component } from 'react';
import './alert.css';
import { Glyphicon } from 'react-bootstrap';

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
    let glyph = '';
    switch (this.props.severity) {
      case 'success':
        glyph = 'ok-circle';
        break;
      case 'danger':
        glyph = 'ban-circle';
        break;
      case 'info':
        glyph = 'info-sign';
        break;
      case 'warning':
        glyph = 'exclamation-sign';
        break;
      default:
        glyph = '';
        break;
    }
    return (
      <div
        className={`Alert alert alert-${this.props.severity} ${
          this.state.closed ? 'is-closed' : ''
        }`}
      >
        <span className="Alert-icon">
          <Glyphicon glyph={glyph} />
        </span>
        <p>{this.props.message}</p>
        <span className="Alert-closeBtn" onClick={this.handleClose}>
          ×
        </span>
      </div>
    );
  }
}
