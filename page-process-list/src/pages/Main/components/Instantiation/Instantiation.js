import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Instantiation.css';

export default class Instantiation extends Component {
  render() {
    const { processName, processVersion } = this.props.match.params;

    return (
      <iframe
        className="Instantiation container border"
        src={`../../../../process/${processName}/${processVersion}/content/`}
        title="Instantiation"
      />
    );
  }
}
