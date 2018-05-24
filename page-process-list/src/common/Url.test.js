import Url from './Url';

describe('Url', () => {
  let equivalence = {};

  equivalence.queries = {
    string: '?a=a&array=a&array=2',
    object: { a: 'a', array: ['a', '2'] }
  };
  equivalence.fragments = {
    string: '#array:[a,2,3],a:a,object:{a:a,b:2,c:3,d:[a,2,3],e:{a:a,b:2,c:3}}',
    object: {
      array: ['a', '2', '3'],
      a: 'a',
      object: {
        a: 'a',
        b: '2',
        c: '3',
        d: ['a', '2', '3'],
        e: { a: 'a', b: '2', c: '3' }
      }
    }
  };
  equivalence.url = {
    string: `http://localhost:3000/bonita/portal/${equivalence.queries.string}${
      equivalence.fragments.string
    }`,
    object: {
      protocol: 'http:',
      hostname: 'localhost',
      port: '3000',
      pathname: '/bonita/portal/',
      queries: equivalence.queries.object,
      fragments: equivalence.fragments.object
    }
  };

  describe('constructor', () => {
    it('should decompose url with params', () => {
      const url = new Url(equivalence.url.string);
      expect(url).toEqual(equivalence.url.object);
    });

    it('should decompose url without params', () => {
      const url = new Url('http://dev.localhost:3000/bonita/portal');
      expect(url).toEqual({
        protocol: 'http:',
        hostname: 'dev.localhost',
        port: '3000',
        pathname: '/bonita/portal',
        queries: {},
        fragments: {}
      });
    });

    it('should clone Url instance', () => {
      const url = new Url(equivalence.url.object);
      expect(url).toEqual(equivalence.url.object);
    });

    it('should override with second argument', () => {
      const url1 = new Url(equivalence.url.string, {});
      expect(url1).toEqual(equivalence.url.object);

      const url2 = new Url(equivalence.url.string, {
        protocol: 'https:',
        hostname: 'bonita',
        port: '1337',
        queries: {},
        fragments: {}
      });
      expect(url2).toEqual({
        protocol: 'https:',
        hostname: 'bonita',
        port: '1337',
        pathname: equivalence.url.object.pathname,
        queries: {},
        fragments: {}
      });
    });
  });

  describe('getPath', () => {
    it('should recompose path', () => {
      const url = new Url(equivalence.url.string);
      expect(url.getPath()).toEqual('http://localhost:3000/bonita/portal/');
    });
  });

  describe('get', () => {
    it('should recompose url', () => {
      const url = new Url(equivalence.url.string);
      expect(url.get()).toEqual(equivalence.url.string);
    });
  });

  describe('set', () => {
    it('should update url', () => {
      const url = new Url(equivalence.url.string);
      url.set({
        protocol: 'https:',
        hostname: 'bonita',
        port: '1337',
        queries: {},
        fragments: {}
      });
      expect(url).toEqual({
        protocol: 'https:',
        hostname: 'bonita',
        port: '1337',
        pathname: equivalence.url.object.pathname,
        queries: {},
        fragments: {}
      });
    });
  });

  describe('parse & stringify', () => {
    it('should parse queries', () => {
      expect(equivalence.queries.object).toEqual(
        Url.parseQueries(equivalence.queries.string)
      );
      expect({}).toEqual(Url.parseQueries(''));
      expect({}).toEqual(Url.parseQueries('?'));
    });

    it('should stringify queries', () => {
      expect(equivalence.queries.string).toEqual(
        Url.stringifyQueries(equivalence.queries.object)
      );
      expect(null).toEqual(Url.stringifyQueries({}));
    });

    it('should parse fragments', () => {
      expect(Url.parseFragments(equivalence.fragments.string)).toEqual(
        equivalence.fragments.object
      );
      expect({}).toEqual(Url.parseFragments(''));
      expect({}).toEqual(Url.parseFragments('#'));
    });

    it('should stringify fragments', () => {
      expect(Url.stringifyFragments(equivalence.fragments.object)).toEqual(
        equivalence.fragments.string
      );
      expect(null).toEqual(Url.stringifyFragments({}));
    });
  });
});
