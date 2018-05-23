import { apiClient } from '../common';
import ProcessApi from './ProcessApi';

const mockupProcesses = Array(25).fill({
  displayDescription: '',
  deploymentDate: '2018-02-14 12:18:34.254',
  displayName: 'Pool',
  name: 'Pool',
  description: '',
  deployedBy: '4',
  id: '7544905540282516773',
  activationState: 'ENABLED',
  version: '1.0',
  configurationState: 'RESOLVED',
  last_update_date: '2018-02-14 12:18:34.723',
  actorinitiatorid: '1'
});

describe('Process API', () => {
  const spyGet = jest.spyOn(apiClient, 'get');

  beforeEach(() => {
    spyGet.mockReset();
    spyGet.mockRestore();
  });

  it('should fetch a set of processes', () => {
    let set = mockupProcesses.slice(0, 10);

    const spyGet = jest.spyOn(ProcessApi, 'fetchProcesses');
    spyGet.mockImplementation(() => Promise.resolve(set));

    ProcessApi.fetchProcesses({ page: 0, count: 10 }).then(processes =>
      expect(processes).toEqual(set)
    );
  });
});
