import api from './SystemApi';
import fetchMock from 'fetch-mock';

describe('API', () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('should get session', async () => {
    const expectedSession = {
      user_id: '4',
      session_id: '-3183098326138618519'
    };
    fetchMock.get('../API/system/session/unusedId', {
      body: expectedSession
    });

    const response = await api.fetchSession();

    expect(response).toEqual(expectedSession);
  });
});
