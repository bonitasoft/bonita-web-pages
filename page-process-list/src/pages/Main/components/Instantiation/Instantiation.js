import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Instantiation.css';
import { Link } from 'react-router-dom';
import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class Instantiation extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmited = this.onFormSubmited.bind(this);
    window.addEventListener('message', this.onFormSubmited, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onFormSubmited);
  }

  onFormSubmited(message) {
    const messageData = message.data;
    var jsonMessage =
      typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
    if (
      jsonMessage.action === 'Start process' &&
      jsonMessage.message === 'success'
    ) {
      this.props.history.push('/');
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
          src={`../../../../process/${processName}/${processVersion}/content/${
            this.props.location.search
          }`}
          title="Instantiation"
        />
      </div>
    );
  }
}
