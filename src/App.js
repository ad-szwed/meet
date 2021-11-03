import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import { getEvents, extractLocations, checkToken, getAccessToken } from './api';
import NumberOfEvents from './NumberOfEvents';
import './nprogress.css';
import { InfoAlert } from './Alert';
import WelcomeScreen from './WelcomeScreen';

class App extends Component {
  state = {
    events: [],
    locations: [],
    numberOfEvents: 32,
    // part of google's verificaiton
    showWelcomeScreen: undefined
  }

  async componentDidMount() {
    this.mounted = true;
    const accessToken = localStorage.getItem('access_token');
    const isTokenValid = (await checkToken(accessToken)).error
      ? false
      : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    this.setState({ showWelcomeScreen: !(code || isTokenValid) });
    if ((code || isTokenValid) && this.mounted) {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({ events, locations: extractLocations(events) });
        }
      });
    }
    // load events from the storage
    if (!navigator.onLine) {
      this.setState({
        infoText:
          'Your offline, data may not be up to date',
      });
    } else {
      this.setState({
        infoText: '',
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

  updateEvents = (location, eventCount) => {
    console.log(location, "!! location in app.js")
    getEvents().then((events) => {
      const locationEvents = location === 'all'
        ? events.slice(0, eventCount)
        : events.filter((event) => event.location === location);
      console.log(locationEvents, "locationEvents in app.js")
      console.log("here")
      this.setState({
        events: locationEvents,
      });
    });
  }

  render() {

    // part of google's verification
    if (this.state.showWelcomeScreen === undefined) return <div
      className="App" />
    console.log(this.state.events, "events render")
    return (
      <div className="App">
        <InfoAlert text={this.state.infoText} />
        <h1 className='eventTitle'>Meet</h1>
        <CitySearch
          locations={this.state.locations} updateEvents={this.updateEvents} />
        <EventList
          events={this.state.events} />
        <NumberOfEvents
          numberOfEvents={this.state.numberOfEvents}
          updateEvents={this.updateEvents} />

        {/* part of google's verification */}
        <WelcomeScreen showWelcomeScreen={this.state.showWelcomeScreen}
          getAccessToken={() => { getAccessToken() }} />
      </div>
    );
  }
}

export default App;
