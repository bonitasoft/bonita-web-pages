import Router from './Router';
import { Url } from './index';

describe('Router', () => {
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

  const mockupUrl = {
    string: (page = 'main') =>
      `http://localhost:3000/?tenant=France&locale=fr&app=bonita&s=pool#process:{name:Pool,version:1.0,id:7544905540282516773},page:${page},task:{name:preinstall}`,
    object: (page = 'main') => ({
      protocol: 'http:',
      hostname: 'localhost',
      port: '3000',
      pathname: '/',
      queries: {
        tenant: 'France', // What would it look like ?
        locale: 'fr',
        app: 'bonita',
        s: 'pool'
      },
      fragments: {
        process: {
          name: 'Pool',
          version: '1.0',
          id: '7544905540282516773'
        },
        page,
        task: {
          name: 'preinstall'
        }
      }
    })
  };

  describe('window.onhashchange', () => {
    it('should publish events through event manager and update state & url', () => {
      const router = new Router(pages, 'main');

      router.url = mockupUrl.object('main');
      router.state = router.readState(router.url);

      const state = router.state;

      const nextUrl = mockupUrl.object('instantiation');
      const nextState = router.readState(nextUrl);

      router.readUrl = jest.fn(() => nextUrl);

      router.eventManager.publish = jest.fn(
        (_state, _nextState, publishTransition) => {
          expect(_state).toEqual(state);
          expect(_nextState).toEqual(nextState);

          publishTransition();

          expect(router.url).toEqual(nextUrl);
          expect(router.state).toEqual(nextState);
        }
      );
      window.onhashchange();

      expect(router.eventManager.publish).toHaveBeenCalled();
    });
  });

  describe('readUrl', () => {
    const router = new Router(pages, 'main');

    it('should return an Url instance based on window.location.href', () => {
      const url = router.readUrl(mockupUrl.string());

      expect(url).toEqual(mockupUrl.object());
    });
  });

  describe('readState', () => {
    const router = new Router(pages, 'main');

    it('should compose state from url according to page requirements', () => {
      const urlInstantiation = mockupUrl.object('instantiation');
      const urlMain = mockupUrl.object('main');

      expect(router.readState(urlInstantiation)).toEqual({
        page: urlInstantiation.fragments.page,
        queries: {
          tenant: urlInstantiation.queries.tenant,
          locale: urlInstantiation.queries.locale,
          app: urlInstantiation.queries.app
        },
        fragments: {
          process: {
            name: urlInstantiation.fragments.process.name,
            version: urlInstantiation.fragments.process.version,
            id: urlInstantiation.fragments.process.id
          }
        }
      });

      expect(router.readState(urlMain)).toEqual({
        page: urlMain.fragments.page,
        queries: {
          tenant: urlMain.queries.tenant,
          locale: urlMain.queries.locale,
          app: urlMain.queries.app
        },
        fragments: {}
      });
    });
  });

  describe('changePage', () => {
    const router = new Router(pages, 'main');

    it('should add page (if not default) to fragments', () => {
      const get = jest.spyOn(Url, 'get', 'get');
      router.changePage('main', {});

      expect(get).toHaveReturnedWith('http:localhost:3000...') //TODO
    });



  });
});
