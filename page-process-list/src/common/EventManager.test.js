import { EventManager } from './index';

const events = ['page', 'queries', 'fragments'];
const statesMockup = {
  state: {
    page: 'main',
    queries: {},
    fragments: {}
  },
  nextState: {
    page: 'instantiation',
    queries: { locale: 'FR-fr' },
    fragments: {
      process: {
        name: 'pool',
        version: '1.0',
        id: '123456789'
      }
    }
  }
};

describe('EventManager', () => {
  const eventManager = new EventManager(events);

  const subscriptions = eventManager.events.name.reduce(
    (subscriptions, name) => {
      eventManager.events.moment.forEach(moment => {
        const handler = jest.fn();
        const event = {
          name,
          moment
        };

        const { unsubscribe } = eventManager.subscribe(event, handler);

        subscriptions.push({
          event,
          handler,
          unsubscribe
        });
      });

      return subscriptions;
    },
    []
  );

  it('can be subscribed', () => {
    subscriptions.forEach(({ event }) =>
      expect(eventManager.getCollection(event)).toHaveLength(1)
    );
  });

  it('can be published', () => {
    const { state, nextState } = statesMockup;
    const transition = jest.fn();

    eventManager.publish(state, nextState, transition);

    expect(transition.mock.calls.length).toBe(1);
    subscriptions.forEach(({ handler }) =>
      expect(handler.mock.calls.length).toBe(1)
    );
  });

  it('can be unsubscribed', () => {
    subscriptions.forEach(({ unsubscribe }) => unsubscribe());
    subscriptions.forEach(({ event }) =>
      expect(eventManager.getCollection(event)).toHaveLength(0)
    );

    const { state, nextState } = statesMockup;
    const transition = jest.fn();

    eventManager.publish(state, nextState, transition);

    subscriptions.forEach(({ handler }) =>
      expect(handler.mock.calls.length).toBe(1)
    );
  });
});
