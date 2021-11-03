import React from 'react';
import { InfoAlert } from './Alert';

class CitySearch extends React.Component {
  state = {
    query: '',
    suggestions: [],
    showSuggestions: false
  }

  // update state of city in text input
  handleInputChanged = (event) => {
    const value = event.target.value;
    const suggestions = this.props.locations.filter((location) => {
      return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
    });
    this.setState({
      query: value
    });
    if (suggestions.length === 0) {
      this.setState({
        query: value,
        infoText: 'We can not find the city you are looking for. Please try again',
      });
    } else {
      this.setState({
        query: value,
        suggestions,
        infoText: '',
      });
    }
  };

  handleItemClicked(suggestion) {
    this.setState({
      query: suggestion,
      showSuggestions: false,
      infoText: '',
    });
    this.props.updateEvents(suggestion, this.props.numberOfEvents);
  }

  render() {
    return (
      <div className="CitySearch">
        <InfoAlert text={this.state.infoText} />
        <input
          type="text"
          className="city"
          value={this.state.query}
          onChange={this.handleInputChanged}
          placeholder="Search for city..."
          onFocus={() => {
            this.setState({ showSuggestions: true });
          }}
          onClick={() => {
            this.setState({ showSuggestions: true });
          }}
        />
        <ul className="suggestions" style={this.state.showSuggestions ? {} : { display: 'none' }}>
          {this.state.suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => this.handleItemClicked(suggestion)}
            >{suggestion}</li>
          ))}
          <li onClick={() => this.handleItemClicked("")}>
            <b>See all cities</b>
          </li>
        </ul>
      </div>
    );
  }
}

export default CitySearch;