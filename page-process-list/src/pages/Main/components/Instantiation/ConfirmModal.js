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
