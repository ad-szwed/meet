import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import { getEvents, extractLocations } from './api';
import NumberOfEvents from './NumberOfEvents';
import './nprogress.css';
import { ErrorAlert } from './Alert';

class App extends Component {
  state = {
    events: [],
    locations: [],
    numberOfEvents: 32
  }

  componentDidMount() {
    this.mounted = true;
    // load events from the storage
    if (!navigator.onLine) {
      this.setState({
        ErrorAlert:
          'You are OFFLINE - data may not be up to date',
      });
    } else {
      this.setState({
        ErrorAlert: '',
      });
    }

    getEvents().then((events) => {
      if (this.mounted) {
        this.setState({ events, locations: extractLocations(events) });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateEvents(location, eventCount) {
    getEvents().then((events) => {
      const locationEvents = location === 'all'
        ? events.slice(0, eventCount)
        : events.filter((event) => event.location === location);
      if (this.mounted) {
        this.setState({
          events: locationEvents,
        });
      }
    });
  }


  render() {
    return (
      <div className="App">
        {/* <ErrorAlert text={this.state.errorText} /> */}
        <CitySearch
          locations={this.state.locations} updateEvents={this.updateEvents} />
        <EventList
          events={this.state.events} />
        <NumberOfEvents
          numberOfEvents={this.state.numberOfEvents}
          updateEvents={this.updateEvents} />
      </div>
    );
  }
}

export default App;
