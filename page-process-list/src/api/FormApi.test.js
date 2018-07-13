import api from './FormApi';
import fetchMock from 'fetch-mock';

describe('Form API', () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('should get mapping', async () => {
    const expectedResponse = [
      {
        id: '1114',
        processDefinitionId: '7979502914734350750',
        type: 'PROCESS_START',
        target: 'NONE',
        task: null,
        pageId: null,
        pageMappingKey: 'process/Pool1/1.0',
        lastUpdatedBy: '0',
        lastUpdateDate: null,
        formRequired: false,
        url: null
      }
    ];
    fetchMock.get(
      '../API/form/mapping?c=10&p=0&f=processDefinitionId%3D1114&f=type%3DPROCESS_START',
      {
        body: expectedResponse
      }
    );

    const response = await api.fetchStartFormMapping(1114);

    expect(response).toEqual(expectedResponse);
  });
});
