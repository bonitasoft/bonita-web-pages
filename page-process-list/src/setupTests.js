import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

jest.mock('i18next', () => ({
  t: key => {
    return key;
  }
}));

configure({ adapter: new Adapter() });
