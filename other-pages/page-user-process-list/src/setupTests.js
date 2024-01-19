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
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => (Component) => {
    Component.defaultProps = { ...Component.defaultProps, t: (key) => key };
    return Component;
  },
}));

configure({ adapter: new Adapter() });

// https://medium.com/walmartglobaltech/jest-v18-to-v23-migration-notes-b726cf6aafcf
const oldLocation = global.window.location;
delete global.window.location;
global.window.location = { ...oldLocation };

const oldSessionStorage = global.window.sessionStorage;
delete global.window.sessionStorage;
global.window.sessionStorage = { ...oldSessionStorage };
