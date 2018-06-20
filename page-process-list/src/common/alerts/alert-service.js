import uuidv1 from 'uuid/v1';

/**
 * Alerts service used to push alerts to Alerts component
 * Each created alert is associated with a uuid so it is more convenient to be displayed/closed
 */
class AlertService {
  constructor() {
    this.alerts = {};
    this.listeners = [];
  }

  register(component) {
    this.listeners.push(component);
  }

  unregister(component) {
    const idx = this.listeners.indexOf(component);
    if (idx > -1) {
      this.listeners.splice(idx, 1);
    }
  }

  _executeListeners() {
    this.listeners.forEach(l => l());
  }

  _push(message, severity, delayMs) {
    const uuid = uuidv1();
    this.alerts[uuid] = { message, severity };
    this._executeListeners();
    if (delayMs !== Infinity) {
      setTimeout(() => this.close(uuid), delayMs);
    }
    return uuid;
  }

  warning(message, delayMs = 5000) {
    return this._push(message, 'warning', delayMs);
  }

  success(message, delayMs = 3000) {
    return this._push(message, 'success', delayMs);
  }

  error(message, delayMs = 5000) {
    return this._push(message, 'error', delayMs);
  }

  info(message, delayMs = 3000) {
    return this._push(message, 'info', delayMs);
  }

  close(uuid) {
    delete this.alerts[uuid];
    this._executeListeners();
  }
}

export default new AlertService();
