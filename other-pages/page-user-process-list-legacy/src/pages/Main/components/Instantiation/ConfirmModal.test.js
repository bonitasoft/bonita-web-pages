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
import React from 'react';

import { shallow } from 'enzyme';
import ConfirmModal from './ConfirmModal';

describe('Confirm modal component', () => {
  it('should display message section when message property is defined', () => {
    const wrapper = shallow(<ConfirmModal message={'myMessage'} />);
    expect(wrapper.find('ModalBody')).toHaveLength(1);
  });

  it('should not display message section when message property is undefined', () => {
    const wrapper = shallow(<ConfirmModal />);
    expect(wrapper.find('ModalBody')).toHaveLength(0);
  });
  it('should display modal title when title property is defined', () => {
    const wrapper = shallow(<ConfirmModal title={'myTitle'} />);
    expect(wrapper.find('ModalTitle')).toHaveLength(1);
  });

  it('should not display modal title when title property is undefined', () => {
    const wrapper = shallow(<ConfirmModal />);
    expect(wrapper.find('ModalTitle')).toHaveLength(0);
  });

  it('should call onConfirm handler when user click on start button', () => {
    const onConfirm = jest.fn();
    const wrapper = shallow(<ConfirmModal onConfirm={onConfirm} />);
    wrapper.find('.btn-start').simulate('click');

    expect(onConfirm).toHaveBeenCalled();
  });

  it('should call close handler when user click on cancel button', () => {
    const handleClose = jest.fn();
    const wrapper = shallow(<ConfirmModal handleClose={handleClose} />);
    wrapper.find('.btn-cancel').simulate('click');

    expect(handleClose).toHaveBeenCalled();
  });
});
