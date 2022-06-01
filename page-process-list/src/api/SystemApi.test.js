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
