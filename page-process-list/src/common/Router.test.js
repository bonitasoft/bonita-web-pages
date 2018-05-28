import { Router } from './Router';
import Url from './Url';

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
      page: 'instantiation',
      task: {
        name: 'preinstall'
      }
    }
  };

  Url.default = jest.fn();
  Url.default.mockImplementation(() => mockupUrl);

  const router = new Router(pages, 'main');

  describe('events', () => {
    const subscriptions = router.events.reduce((subscriptions, name) => {
      ['interceptor', 'post', 'pre'].forEach(moment => {
        const event = `${name}.${moment}`;
        const handler = jest.fn();

        const { unsubscribe } = router.subscribe(event, handler);

        subscriptions.push({
          event,
          handler,
          unsubscribe
        });
      });

      return subscriptions;
    }, []);

    it('can be subscribed', () => {
      subscriptions.forEach(({ event }) =>
        expect(router.getCollection(event)).toHaveLength(1)
      );
    });

    it('can be published', () => {
      subscriptions.forEach(({ event }) => router.publish(event));
      subscriptions.forEach(({ handler }) =>
        expect(handler.mock.calls.length).toBe(1)
      );
    });

    it('can be unsubscribed', () => {
      subscriptions.forEach(({ unsubscribe }) => unsubscribe());
      subscriptions.forEach(({ event }) =>
        expect(router.getCollection(event)).toHaveLength(0)
      );
      subscriptions.forEach(({ event }) => router.publish(event));
      subscriptions.forEach(({ handler }) =>
        expect(handler.mock.calls.length).toBe(1)
      );
    });

    // TODO: test interceptors : can they modify the next state or prevent to change the current state to the next one
  });

  describe('readStateFromUrl', () => {
    it('should compose state from url', () => {
      // TODO: Url is not mock but should (see ligne 38)
      expect(router.readStateFromUrl({ href: mockupUrl })).toEqual({
        page: {
          name: mockupUrl.fragments.page,
          queries: {
            tenant: mockupUrl.queries.tenant,
            locale: mockupUrl.queries.locale,
            app: mockupUrl.queries.app
          },
          fragments: {
            process: {
              name: mockupUrl.fragments.process.name,
              version: mockupUrl.fragments.process.version,
              id: mockupUrl.fragments.process.id
            }
          }
        },
        url: mockupUrl
      });
    });
  });
});
