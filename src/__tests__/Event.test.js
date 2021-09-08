import React from 'react';
import { shallow } from 'enzyme';
import Event from '../Event';
import EventList from '../EventList';
import { mockData } from '../mock-data';

describe('<EventList /> component', () => {
  let createdEvent;
  beforeAll(() => {
    createdEvent = shallow(<Event event={mockData[0]} />);
  });

  test('render event list', () => {
    const EventListWrapper = shallow(<EventList events={mockData} />);
    expect(EventListWrapper.find(Event)).toHaveLength(mockData.length);
  });

  test('render the event details-btn', () => {
    expect(createdEvent.find('.details-btn')).toHaveLength(1);
  });

  test('if showMore is false, simulates a click showing more details', () => {
    const changeState = createdEvent.state({ showMore: true });
    createdEvent.find('.details-btn').simulate('click', changeState);
    expect(createdEvent.state('showMore')).toBe(true);
  });

  test('if showMore is true, simulate a click', () => {
    const changeState = createdEvent.state({ showMore: false });
    createdEvent.find('.details-btn').simulate('click', changeState);
    expect(createdEvent.state('showMore')).toBe(false);
  });
});