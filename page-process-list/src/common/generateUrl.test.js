import generateUrl from './generateUrl';

describe('generateUrl', () => {

  it('should return url when params is undefined', () => {
    const url = generateUrl('localhost', undefined);
    expect(url).toEqual('localhost');
  });

  it('should return url when params is an empty object', () => {
    const url = generateUrl('localhost', {});
    expect(url).toEqual('localhost');
  });

  it('should return url with parsed params when params is an non-empty object', () => {
    const url = generateUrl('localhost', {
      'p': 0,
      'c': 10
    });
    expect(url).toEqual('localhost?p=0&c=10');
  });

  it('should return url with parsed params when params is an object with an object inside', () => {
    const url = generateUrl('localhost', {
      'f': {
        'activationState': 'ENABLED'
      }
    });
    expect(url).toEqual('localhost?f=activationState=ENABLED');
  });

  it('should return url with parsed params when params is an object with an array inside', () => {
    const url = generateUrl('localhost', {
      'items': [ 'a', 'b' ]
    });
    expect(url).toEqual('localhost?items=a&items=b');
  });

});
