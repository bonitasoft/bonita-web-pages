import cookie from './Cookie';

describe('cookie', () => {
  it('should get a cookie value', () => {
    document.cookie = 'test1=Hello';
    document.cookie = 'test2=World';

    expect(cookie.getValue('test2')).toBe('World');
    expect(cookie.getValue('unknown')).toBe('');
  });
});
