import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Instantiation.css';

export default class Instantiation extends Component {

  constructor(props) {
      super(props);
      this.onFormSubmited = this.onFormSubmited.bind(this);
      window.addEventListener("message", this.onFormSubmited, false);
  }

  onFormSubmited(message) {
      const messageData =  message.data;
      var jsonMessage = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
        if (jsonMessage.action === 'Start process') {
            if (jsonMessage.message === 'error') {
                console.log('[Error] Process instantiation failure.');
            } else if (jsonMessage.message === 'success') {
                this.props.history.push('/');
                console.log('[SUCCESS] Process instantiation success.');
            }
        }
    };

  render() {
    const { processName, processVersion } = this.props.match.params;

    return (
      <iframe
        className="Instantiation container border"
        src={`../../../../process/${processName}/${processVersion}/content/${this.props.location.search}`}
        title="Instantiation"
      />
    );
  }
}
