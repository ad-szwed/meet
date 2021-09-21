import React from 'react';
import { mount } from 'enzyme';
import { loadFeature, defineFeature } from 'jest-cucumber';
import App from '../App';
import NumberOfEvents from "../NumberOfEvents";

const feature = loadFeature('./src/features/specifyTheNumberOfEvents.feature');
// specify the number of events
defineFeature(feature, (test) => {

  // scenario 1
  test('When user has not specified a number 32 is the default number',
    ({
      given,
      when,
      then,
    }) => {

      let AppWrapper;
      given('the user has not specified the number of events they are looking for', () => {
        AppWrapper = mount(<App />);
      });

      when('the user searches for the events', () => {
      });

      then('the default number of 32 will be applied to only show 32 events in that search', () => {
        AppWrapper.update();
        expect(AppWrapper.state('events').length).toBe(2);
      });
    });

  // scenario 2
  test('User can change the number of events they want to see', ({ given, when, then }) => {
    let AppWrapper;
    let NumberOfEventsWrapper;
    given('the page has fully loaded the events', () => {
      AppWrapper = mount(<App />);
    });

    when('user changes the number of events they want to see', () => {
      const numberOfEvents = {
        target: { value: 10 },
      };
      AppWrapper.find(".numberOfEventsInput").simulate("change", numberOfEvents);
    });

    then('the number chosen by user will limit the total of events shown', () => {
      NumberOfEventsWrapper = AppWrapper.find(NumberOfEvents);
      expect(NumberOfEventsWrapper.state("eventCount")).toBe(10);
    });
  });
});