import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import { getEvents, extractLocations, checkToken, getAccessToken } from './api';
import NumberOfEvents from './NumberOfEvents';
import './nprogress.css';
import { InfoAlert } from './Alert';
import WelcomeScreen from './WelcomeScreen';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import EventGenre from './EventGenre';

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
      this.setState({
        events: locationEvents,
      });
    });
  }

  // getting the data for the chart from mock-data.js   
  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter((event) => event.location === location).length
      const city = location.split(', ').shift()
      return { city, number };
    })
    return data;
  };

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
        <EventGenre events={this.state.events} />
        <ResponsiveContainer height={400} >
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="category" dataKey="city" name="city" />
            <YAxis
              allowDecimals={false}
              type="number"
              dataKey="number"
              name="number of events"
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={this.getData()} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
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
