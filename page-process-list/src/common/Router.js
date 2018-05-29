import { Url, EventManager } from './index';

// will generate 'page.pre', 'page.post', ...
const events = ['page', 'queries', 'fragments'];

class Router {
  constructor(pages, defaultPage) {
    this.pages = pages;
    this.defaultPage = defaultPage;
    this.url = this.readUrl();
    this.state = this.readState(this.url);

    this.eventManager = new EventManager(events);
    this.subscribe = (...params) => this.eventManager.subscribe(...params);

    window.onhashchange = () => {
      const nextUrl = this.readUrl();
      const nextState = this.readState(nextUrl);

      this.eventManager.publish(this.state, nextState, () => {
        this.url = nextUrl;
        this.state = nextState;
      });
    };
  }

  readUrl() {
    return new Url(window.location.href);
  }

  readState(url) {
    const reduceTo = (collection, requirements) =>
      requirements.reduce((buffer, key) => {
        if (collection[key]) {
          buffer[key] = collection[key];
        }
        return buffer;
      }, {});

    const { page = this.defaultPage, ...fragments } = url.fragments;
    const requirements = this.pages[page];

    return {
      page,
      queries: reduceTo(url.queries, requirements.queries),
      fragments: reduceTo(fragments, requirements.fragments)
    };
  }

  changePage(page, fragments) {
    if (page !== this.defaultPage) {
      fragments.page = page;
    }

    const nextUrl = new Url(this.getUrl(), { fragments });

    window.location.href = nextUrl.get();
  }

  getPage() {
    return this.state.page;
  }

  getQueries() {
    return this.state.queries;
  }

  getFragments() {
    return this.state.fragments;
  }

  getUrl() {
    return this.url;
  }

  getPortalUrl() {
    const path = this.url.getPath();
    const index = path.indexOf('/portal');

    return `${index !== -1 ? path.substring(0, index) : path}portal/`;
  }
}

export default Router;
