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
    return this._push(message, 'danger', delayMs);
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
