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
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import { t } from 'i18next';

export default class ConfirmModal extends Component {
  render() {
    const header = this.props.title ? (
      <Modal.Header closeButton>
        <Modal.Title>{this.props.title}</Modal.Title>
      </Modal.Header>
    ) : (
      ''
    );
    const body = this.props.message ? (
      <Modal.Body>{this.props.message}</Modal.Body>
    ) : (
      ''
    );
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        {header}
        {body}
        <Modal.Footer>
          <Button className="btn-start" onClick={this.props.onConfirm}>
            {t('Start')}
          </Button>
          <Button className="btn-cancel" onClick={this.props.handleClose}>
            {t('Cancel')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
