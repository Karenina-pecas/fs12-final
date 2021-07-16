import React, { Component } from 'react';
import { Map as GoogleMap, Marker, GoogleApiWrapper } from 'google-maps-react';

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

const mapStyles = {
  width: '100%',
  height: '500px',
  position: 'relative'
};

let service = null;

export class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchCriteria: '',
      suggestions: [],
      places: [],
      guestMode: props.guestMode,
      center: {
        lat: 0,
        lng: 0
      }
    };
  }

  savePlace = (place) => {
    this.setState({ places: [...this.state.places, place] });
  };

  handleChange = (e) => {
    this.setState({ searchCriteria: e.target.value });
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.search();
    }
  };

  search = (e = null) => {
    console.warn(e);
    const { searchCriteria } = this.state;
    service.textSearch({ query: searchCriteria }, (suggestions) => {
      this.setState({
        suggestions
      });
    });
  };

  clearSearch = () => {
    this.setState({
      suggestions: [],
      searchCriteria: ''
    });
  };

  onMarkerClick = (props, marker, e) => {
    console.log(props, marker, e);
  };

  initPlaces = (mapProps, map) => {
    const { google } = mapProps;
    service = new google.maps.places.PlacesService(map);
  };

  render() {
    const { places } = this.state;

    var bounds = new this.props.google.maps.LatLngBounds();

    // extend the bounds to include each suggestion
    for (var i = 0; i < places.length; i++) {
      bounds.extend(places[i].geometry.location);
    }
    // extend the bounds to include OUR current location
    bounds.extend(this.props.position);

    return (
      <div className='container'>
        <div className='row'>
          {this.state.guestMode ? null : (
            <div className='col'>
              <h3>Find a safe place nearby</h3>
              <div className='form-inline d-flex justify-content-between mb-4'>
                <input
                  type='text'
                  value={this.state.searchCriteria}
                  onChange={this.handleChange}
                  className='form-control flex-grow-1'
                  placeholder='Search for a Safemme place'
                  onKeyPress={this.handleKeyPress}
                />
                <button onClick={this.search} className='btn btn-primary ml-2'>
                  Search
                </button>
              </div>
              <div>
                <button
                  onClick={this.clearSearch}
                  hidden={!this.state.suggestions.length}
                  className='btn btn-sm btn-danger'>
                  Clear
                </button>
              </div>
              <ul className='list-group'>
                {this.state.suggestions.map((place, i) => (
                  <li key={i} className='list-group-item d-flex justify-content-between align-items-center'>
                    <div>
                      <div>
                        <strong>{place.name}</strong>
                      </div>
                      <span className='text-muted'>{place.formatted_address}</span>
                    </div>
                    <button className='btn btn-outline-primary' onClick={() => this.savePlace(place)}>
                      Show
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div style={mapStyles}>
            <GoogleMap
              google={this.props.google}
              onReady={this.initPlaces}
              zoom={14}
              bounds={bounds}
              initialCenter={this.center}>
              {places.map((marker, i) => (
                <Marker
                  onClick={this.onMarkerClick}
                  name={marker.name}
                  position={marker.geometry.location}
                  key={i}
                />
              ))}

              {/* DISPLAY MY POSITION IN THE MAP */}
              <Marker name='My current location' position={this.props.position} />
            </GoogleMap>
          </div>
          <div className='Card'>
            <div className='Card.Header'>Quote</div>
            <div className='Card.Body'>
              <blockquote className='blockquote mb-0'>
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante. </p>
                <footer className='blockquote-footer'>
                  Someone famous in <cite title='Source Title'>Source Title</cite>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey
})(Map);
