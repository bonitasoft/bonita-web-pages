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
