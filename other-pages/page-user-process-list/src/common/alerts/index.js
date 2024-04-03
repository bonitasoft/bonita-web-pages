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
import Alert from './alert';
import service from './alert-service';
import './index.css';

export default class Alerts extends Component {
  constructor() {
    super();
    this.state = {
      alerts: {},
    };

    this.syncAlerts = this.syncAlerts.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
  }

  static error(message, delay) {
    return service.error(message, delay);
  }

  static warning(message, delay) {
    return service.warning(message, delay);
  }

  static success(message, delay) {
    return service.success(message, delay);
  }

  static info(message, delay) {
    return service.info(message, delay);
  }

  static close(uuid) {
    setTimeout(
      () => service.close(uuid),
      500 // waiting for animation to terminate
    );
  }

  syncAlerts() {
    this.setState({ alerts: service.alerts });
  }

  componentDidMount() {
    service.register(this.syncAlerts);
  }

  componentWillUnmount() {
    service.unregister(this.syncAlerts);
  }

  isEmpty() {
    return Object.keys(this.state.alerts).length === 0;
  }
  render() {
    return (
      <div
        className={`${this.props.className} Alerts ${
          this.isEmpty() ? 'is-empty' : ''
        }`}
      >
        {Object.keys(this.state.alerts).map((uuid) => {
          const alert = this.state.alerts[uuid];
          return (
            <Alert
              key={uuid}
              severity={alert.severity}
              message={alert.message}
              onClose={() => Alerts.close(uuid)}
            />
          );
        })}
      </div>
    );
  }
}
