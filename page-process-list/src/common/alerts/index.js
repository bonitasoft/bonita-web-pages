import React, { Component } from 'react';
import Alert from './alert';
import service from './alert-service';
import './index.css';

export default class Alerts extends Component {
  constructor() {
    super();
    this.state = {
      alerts: {}
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
        {Object.keys(this.state.alerts).map(uuid => {
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
