import uniqueId from 'lodash.uniqueid';
import isEqual from 'lodash.isequal';
import isMatch from 'lodash.ismatch';
import { Url } from './index';

class Router {
  constructor(pages, defaultPage) {
    this.pages = pages;
    this.defaultPage = defaultPage;
    this.state = this.readStateFromUrl();

    this.changePage(this.getPage(), this.getFragments()); // avoid refresh on /

    // interceptor, pre and post events for each, e.i. 'page.interceptor', 'page.pre', 'page.post'
    this.events = ['page', 'fragments', 'url', 'state'];
    this.handlers = {};
    this.subscriptions = this.events.reduce((subscriptions, name) => {
      subscriptions[name] = { interceptor: [], pre: [], post: [] };

      return subscriptions;
    }, {});

    const _this = this;
    window.onhashchange = () => {
      const _nextState = _this.readStateFromUrl();

      const getState = {
        page: state => state.page.name,
        fragments: state => state.page.fragments,
        url: state => state.url,
        state: state => state
      };

      const contexts = _this.events.map(event => {
        const state = getState[event](_this.state),
          nextState = getState[event](_nextState),
          isChanging =
            typeof state !== 'object' && !Array.isArray(state)
              ? !isEqual(nextState, state)
              : !isMatch(nextState, state);

        return { event, state, nextState, isChanging };
      });


      contexts.forEach(({ event, state, nextState, isChanging }) => {
        if (isChanging) {
          const interceptState = _this.publish(`${event}.interceptor`, [
            state,
            nextState
          ]);
          nextState =
            typeof interceptState === 'undefined'
              ? nextState
              : interceptState || state;
        }
      });

      contexts.forEach(({ event, state, nextState, isChanging }) => {
        if (isChanging) {
          _this.publish(`${event}.pre`, [state, nextState]);
        }
      });

      _this.state = _nextState;
      window.location.href = _nextState.url.get();

      contexts.forEach(({ event, state, nextState, isChanging }) => {
        if (isChanging) {
          _this.publish(`${event}.post`, [nextState]);
        }
      });
    };
  }

  getCollection(event) {
    const [name, moment = 'post'] = event.split('.');

    return this.subscriptions[name][moment];
  }

  getHandlers(collection) {
    return collection.map(id => this.handlers[id]);
  }

  subscribe(event, handler) {
    const buildUnsubscriber = (collection, id) => ({
      unsubscribe: () =>
        collection.splice(
          collection.findIndex(handlerId => handlerId === id),
          1
        )
    });

    const collection = this.getCollection(event);
    const id = uniqueId();

    this.handlers[id] = handler;
    collection.push(id);

    return buildUnsubscriber(collection, id); // e.i. const subscription = router.subscribe(...); subscription.unsubscribe();
  }

  publish(event, params = []) {
    const collection = this.getCollection(event);
    const handlers = this.getHandlers(collection);

    handlers.forEach(handler => handler(...params));
  }

  readStateFromUrl(location = window.location) {
    const reduceTo = (collection, requirements) =>
      requirements.reduce((buffer, key) => {
        if (collection[key]) {
          buffer[key] = collection[key];
        }

        return buffer;
      }, {});

    const url = new Url(location.href);
    const { page = this.defaultPage, ...fragments } = url.fragments;
    const requirements = this.pages[page];

    return {
      page: {
        name: page,
        queries: reduceTo(url.queries, requirements.queries),
        fragments: reduceTo(fragments, requirements.fragments)
      },
      url
    };
  }

  getPage() {
    return this.state.page.name;
  }

  // The state will be updated from the window's onhashchange event (atomicity principle)
  changePage(page, fragments) {
    const nextUrl = new Url(this.state.url, {
      fragments: { page, ...fragments }
    });

    window.location.href = nextUrl.get();
  }

  getQueries() {
    return this.state.page.queries;
  }

  getFragments() {
    return this.state.page.fragments;
  }

  getUrl() {
    return this.state.url;
  }

  getPortalUrl() {
    const path = this.state.url.getPath();
    const index = path.indexOf('/portal');

    return `${index !== -1 ? path.substring(0, index) : path}portal/`;
  }
}

class RouterInterface {
  constructor(pages, defaultPage) {
    const router = new Router(pages, defaultPage);

    [
      'subscribe',
      'getPage',
      'changePage',
      'getUrl',
      'getQueries',
      'getFragments',
      'getPortalUrl'
    ].reduce((_this, key) => {
      _this[key] = router[key].bind(router);

      return _this;
    }, this);
  }
}

export { RouterInterface as default };
export { Router, RouterInterface };
