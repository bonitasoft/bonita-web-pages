import React, { Component } from 'react';
import router from '../../routerInstance';
import { Url } from '../../common';
import './index.css';

class Instantiation extends Component {
  constructor(props) {
    super(props);

    this.getInstantiationUrl = this.getInstantiationUrl.bind(this);
  }

  getInstantiationUrl() {
    // keep '/' in path
    const encodeParam = str =>
      encodeURIComponent(str).replace(new RegExp('%2F', 'g'), '/');

    const portalUrl = router.getPortalUrl(),
      { queries, fragments } = router.getUrl(),
      { name, version, id } = fragments.process;

    const instantiationUrl = new Url(
      `${portalUrl}resource/process/${encodeParam(name)}/${encodeParam(
        version
      )}/content/`,
      {
        queries: { ...queries, id }
      }
    );

    return instantiationUrl.get();
  }

  render() {
    const instantiationUrl = this.getInstantiationUrl();

    return (
      <iframe
        className="Instantiation"
        src={instantiationUrl}
        title="Instantiation"
      />
    );
  }
}

export default Instantiation;
