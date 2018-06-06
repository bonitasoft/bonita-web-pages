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

  readUrl(url = this.getWindowLocationHref()) {
    return new Url(url);
  }

  getWindowLocationHref() {
    return window.location.href;
  }

  setWindowLocationHref(href) {
    window.location.href = href;
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

  changePage(page = 'main', fragments = {}) {
    if (page !== this.defaultPage) {
      fragments = { page, ...fragments };
    }

    const nextUrl = new Url(this.getUrl(), { fragments });
    this.setWindowLocationHref(nextUrl.get());
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

  getUrlContext() {
    const index = this.url.pathname.indexOf('/portal');
    const urlContextPath = this.url.pathname.slice(0, index);

    return this.url.getPath.apply(
      new Url(this.url, { pathname: urlContextPath })
    );
  }
}

export default Router;
