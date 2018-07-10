import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Instantiation.css';
import { Link } from 'react-router-dom';
import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Alerts } from '../../../../common';

export default class Instantiation extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmited = this.onFormSubmited.bind(this);
    this.getUrlContext = this.getUrlContext.bind(this);
    window.addEventListener('message', this.onFormSubmited, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onFormSubmited);
  }

  getUrlContext() {
    var locationHref = window.location.href;
    var indexOfPortal = locationHref.indexOf('/portal');
    return locationHref.substring(0, indexOfPortal);
  }

  onFormSubmited(message) {
    const messageData = message.data;
    var jsonMessage =
      typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
    if (jsonMessage.action === 'Start process') {
      if (jsonMessage.message === 'success') {
        this.props.history.push('/');
        var caseId = '';
        if (jsonMessage.dataFromSuccess) {
          caseId = jsonMessage.dataFromSuccess.caseId;
        }
        Alerts.success(
          'The case ' + caseId + ' has been started successfully.'
        );
      } else {
        Alerts.error('Error while starting the case.');
      }
    }
  }

  render() {
    const { processName, processVersion } = this.props.match.params;

    return (
      <div className="Instantiation transition-item">
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="cancel-instantiation"> Cancel</Tooltip>}
          delayShow={2000}
        >
          <Link to="/">
            <div className="cancel-bar">
              <div className="cancel-bar-content">
                <Glyphicon glyph="chevron-left" />
              </div>
            </div>
          </Link>
        </OverlayTrigger>

        <iframe
          src={`${this.getUrlContext()}/portal/resource/process/${processName}/${processVersion}/content/${
            this.props.location.search
          }`}
          title="Instantiation"
        />
      </div>
    );
  }
}
