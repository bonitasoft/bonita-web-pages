/**
 * Copyright (C) 2018 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
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
