import React, { Component } from 'react';

import router from './routerInstance';
import pages from './pages';

class RouterComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: router.getPage()
    };

    router.subscribe('page', page => this.setState({ page }));
  }

  render() {
    const Page = pages[this.state.page];

    return <Page />;
  }
}

export default RouterComponent;
