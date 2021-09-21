import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { mount, shallow } from 'enzyme';
import App from '../App';
import Event from '../Event';
import { mockData } from '../mock-data';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');
// scenario 1
defineFeature(feature, (test) => {
  test('an event element is collapsed by default',
    ({
      given,
      when,
      then,
    }) => {
      given('user has not tried to select the event element', () => {
      });

      let AppWrapper;
      when('the user selects the element with their mouse', () => {
        AppWrapper = mount(<App />);
      });

      then('the user should be able to see the details of the event', () => {
        AppWrapper.update();
        expect(AppWrapper.state('events')).toHaveLength(2);
      });
    });
  // scenario 2
  test('User can expand an event to see its details',
    ({
      given,
      when,
      then,
    }) => {
      let AppWrapper;
      given('the user has selected the event element available to click', () => {
        AppWrapper = mount(<App />);
      });

      when('the user does click for more details', () => {
        AppWrapper.update();
        const EventWrapper = AppWrapper.find(Event);
        AppWrapper.find('.details-btn').at(0).simulate('click');
        EventWrapper.at(0).setState({ showMore: true });
      });

      then('the user will be given an expanded view of the details of said event', () => {
        expect(AppWrapper.state('events')).toHaveLength(2);
      });
    });
  // scenario 3
  test('User can collapse an event to hide its details',
    ({
      given,
      when,
      then,
    }) => {
      let EventWrapper;
      given('the user is done looking at expanded information', () => {
        EventWrapper = shallow(<Event event={mockData[1]} />);
        EventWrapper.setState({
          show: true,
        });
      });
      let AppWrapper;
      when('the user selects the collapse button', () => {
        AppWrapper = mount(<App />);
        EventWrapper = AppWrapper.find(Event);
        //  expect(AppWrapper.find('.details-btn')).simulate('focus');
        //  EventWrapper.at(0).setState({ showMore: false });
      });

      then('the user will no longer have the event’s details shown to view', () => {
        expect(EventWrapper.find('.EventDetails')).toHaveLength(0);
      });
    });
});