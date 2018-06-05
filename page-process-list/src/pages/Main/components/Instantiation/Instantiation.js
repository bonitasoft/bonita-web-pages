import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Instantiation.css';

class Instantiation extends Component {
  getInstantiationUrl() {
    const processName = this.props.match.params.processName;
    const processVersion = this.props.match.params.processVersion;
    let url = `../../../../process/${processName}/${processVersion}/content/`;
    console.log(url);
    return url;
  }

  getUrlContext() {
    const pathName = this.getWindowLocationHref();
    const portalIndex = pathName.indexOf('/portal');
    return pathName.slice(0, portalIndex);
  }

  getWindowLocationHref() {
    return window.location.href;
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
