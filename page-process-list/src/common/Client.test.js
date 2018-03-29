import client from './Client';
import 'whatwg-fetch';

describe('Client', () => {
  let expectedResponse;

  beforeEach(() => {
    window.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedResponse)
      );
  });

  afterEach(() => {
    client.interceptors = [];
  });

  const mockResponse = (status, response = '{"some": "json"}') => {
    return new Response(response, {
      status: status,
      headers: {
        'Content-type': 'application/json'
      }
    });
  };

  it('should get data', async () => {
    expectedResponse = mockResponse(200, '{"some": "fetched response"}');

    const response = client.get('/some/url');

    await expect(response.then(response => response.json())).resolves.toEqual({some: 'fetched response'});
    expect(window.fetch).toHaveBeenCalledWith('/some/url', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  });

  it('should reject the promise when http error appear when getting data', async () => {
    expectedResponse = mockResponse(400);

    const response = client.get('/some/url');

    await expect(response).rejects.toMatchObject({
      status: 400
    });
  });

  it('should post data', async () => {
    expectedResponse = mockResponse(200, '{"some": "fetched response"}');

    const response = client.post('/whatever/url', {the: 'body'});

    await expect(response.then(response => response.json())).resolves.toEqual({some: 'fetched response'});
    expect(window.fetch).toHaveBeenCalledWith('/whatever/url', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: '{\"the\":\"body\"}'
    });
  });

  it('should add CSRF token in header when available in cookies while getting data', async () => {
    expectedResponse = mockResponse(200);
    document.cookie = 'X-Bonita-API-Token=6966c161-1363-4526-b0bd-78e02225415b';

    const response = client.get('/some/url');

    await expect(response).resolves.toBeDefined();
    expect(window.fetch.mock.calls[0][1]).toMatchObject({
      headers: {
        'X-Bonita-API-Token': '6966c161-1363-4526-b0bd-78e02225415b'
      }
    });
  });

  it('should add CSRF token in header when available in cookies while posting data', async () => {
    expectedResponse = mockResponse(200);
    document.cookie = 'X-Bonita-API-Token=6966c161-1363-4526-b0bd-78e02225415b';

    const response = client.post('/whatever/url', {the: 'body'});

    await expect(response).resolves.toBeDefined();
    expect(window.fetch.mock.calls[0][1]).toMatchObject({
      headers: {
        'X-Bonita-API-Token': '6966c161-1363-4526-b0bd-78e02225415b'
      }
    });
  });

  it('should reject the promise when http error appear when posting data', async () => {
    expectedResponse = mockResponse(400);

    const response = client.post('/some/url', {the: 'body'});

    await expect(response).rejects.toMatchObject({
      status: 400
    });
  });

  it('should execute responseErrors interceptors when posting data', async () => {
    expectedResponse = mockResponse(400);
    client.register({
      responseError: (response) => {
        return Promise.reject({...response, statusText: response.statusText + ' altered by interceptor'});
      }
    });

    const response = client.post('/whatever/url', {the: 'body'});

    await expect(response).rejects.toMatchObject({
      statusText: 'OK altered by interceptor'
    });
  });

  it('should execute responseError interceptors when getting data', async () => {
    expectedResponse = mockResponse(400);
    client.register({
      responseError: (response) => {
        return Promise.reject({...response, statusText: response.statusText + ' altered by interceptor'});
      }
    });

    const response = client.get('/whatever/url');

    await expect(response).rejects.toMatchObject({
      statusText: 'OK altered by interceptor'
    });
  });
});
