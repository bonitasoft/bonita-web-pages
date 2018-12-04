/**
 * Copyright (C) 2018 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import client from './Client';
import 'whatwg-fetch';

describe('Client', () => {
  let expectedResponse;

  beforeEach(() => {
    window.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedResponse));
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

    await expect(response.then(response => response.json())).resolves.toEqual({
      some: 'fetched response'
    });
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

    const response = client.post('/whatever/url', { the: 'body' });

    await expect(response.then(response => response.json())).resolves.toEqual({
      some: 'fetched response'
    });
    expect(window.fetch).toHaveBeenCalledWith('/whatever/url', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: '{"the":"body"}'
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

    const response = client.post('/whatever/url', { the: 'body' });

    await expect(response).resolves.toBeDefined();
    expect(window.fetch.mock.calls[0][1]).toMatchObject({
      headers: {
        'X-Bonita-API-Token': '6966c161-1363-4526-b0bd-78e02225415b'
      }
    });
  });

  it('should reject the promise when http error appear when posting data', async () => {
    expectedResponse = mockResponse(400);

    const response = client.post('/some/url', { the: 'body' });

    await expect(response).rejects.toMatchObject({
      status: 400
    });
  });

  it('should execute responseErrors interceptors when posting data', async () => {
    expectedResponse = mockResponse(400);
    client.register({
      responseError: response => {
        return Promise.reject({
          ...response,
          statusText: response.statusText + ' altered by interceptor'
        });
      }
    });

    const response = client.post('/whatever/url', { the: 'body' });

    await expect(response).rejects.toMatchObject({
      statusText: 'OK altered by interceptor'
    });
  });

  it('should execute responseError interceptors when getting data', async () => {
    expectedResponse = mockResponse(400);
    client.register({
      responseError: response => {
        return Promise.reject({
          ...response,
          statusText: response.statusText + ' altered by interceptor'
        });
      }
    });

    const response = client.get('/whatever/url');

    await expect(response).rejects.toMatchObject({
      statusText: 'OK altered by interceptor'
    });
  });
});
