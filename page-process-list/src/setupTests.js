import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
//import 'isomorphic-fetch'; // don't specify `as` or `from` as this polyfills into global namespace anyway
global.fetch = require('jest-fetch-mock');

configure({ adapter: new Adapter() });