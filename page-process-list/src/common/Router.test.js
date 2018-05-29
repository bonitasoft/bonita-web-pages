import Router from './Router';

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

  const mockupUrl = (page = 'main') => ({
    queries: {
      tenant: 'France', // What would it look like ?
      locale: 'FR-fr',
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
  });

  const router = new Router(pages, 'main');

  describe('readState', () => {
    it('should compose state from url according to page requirements', () => {
      const urlInstantiation = mockupUrl('instantiation');
      const urlMain = mockupUrl('main');

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
});
