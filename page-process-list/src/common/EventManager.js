import uniqueId from 'lodash.uniqueid';
import isEqual from 'lodash.isequal';

class EventManager {
  constructor(events) {
    this.events = {
      name: events,
      moment: ['pre', 'post']
    };
    this.handlers = {};
    this.subscriptions = this.buildEmptySubscriptions(this.events);
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

  publish(state, nextState, publishTransition) {
    const publishMoment = this.publishMoment(state, nextState);

    publishMoment('pre');
    publishTransition();
    publishMoment('post');
  }

  publishMoment(state, nextState) {
    const subscriptions = this.events.name
      .map(name => ({
        getHandlers: moment =>
          this.getCollection({ name, moment }).map(id => this.handlers[id]),
        value: state[name],
        nextValue: nextState[name]
      }))
      .filter(({ value, nextValue }) => !isEqual(nextValue, value));

    return moment =>
      subscriptions.forEach(({ getHandlers, value, nextValue }) => {
        const args = {
          pre: [value, nextValue],
          post: [nextValue, value]
        }[moment];

        getHandlers(moment).forEach(handler => handler(...args));
      });
  }

  getCollection(event) {
    const cb = (name, moment = 'post') => this.subscriptions[name][moment];

    return {
      string: () => cb(...event.split('.')),
      object: () => cb(event.name, event.moment)
    }[typeof event](cb);
  }

  buildEmptySubscriptions(events) {
    return events.name.reduce((subscriptions, name) => {
      subscriptions[name] = events.moment.reduce((collections, moment) => {
        collections[moment] = [];

        return collections;
      }, {});

      return subscriptions;
    }, {});
  }
}

export default EventManager;
