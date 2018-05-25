import { Router } from './common';

// pages with their requirements
const pages = {
  main: {
    queries: ['tenant', 'locale', 'app'],
    fragments: []
  },
  instantiation: {
    queries: ['tenant', 'locale', 'app'],
    fragments: ['process']
  }
};

export default new Router(pages, 'main');
