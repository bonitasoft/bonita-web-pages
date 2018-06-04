import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Instantiation.css';

class Instantiation extends Component {

    getInstantiationUrl(){
    const processName = this.props.match.params.processName;
    const processVersion = this.props.match.params.processVersion;

    let url = `/portal/resource/process/${processName}/${processVersion}/content/`;
    return url;
    }

  render() {
        const url = this.getInstantiationUrl();
    return (
      <iframe
        className="Instantiation container border"
        src={url}
        title="Instantiation"
      />
    );
  }
}

export default Instantiation;
