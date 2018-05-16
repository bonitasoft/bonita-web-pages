import Pagination from './Pagination';

describe('pagination', () => {
  it('should parse content-range', () => {
    const pagination = Pagination.from('12-25/1234');

    expect(pagination).toEqual({
      page: 12,
      size: 25,
      total: 1234
    });
  });

  it('should return an empty object when parsing fail', () => {
    expect(Pagination.from('fail')).toEqual({});
    expect(Pagination.from('1-2')).toEqual({});
    expect(Pagination.from('')).toEqual({});
    expect(Pagination.from(undefined)).toEqual({});
  });
});
