import React, { Component } from "react";
import Link from "next/link";
import styles from "./css/userWindow.module.css";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";

class UserWindow extends Component {
  state = {
    latitude: 0,
    longitude: 0,
    address: "",
    isLoading: true,
    showingInfoWindow: false, // Hides or shows the InfoWindow
    activeMarker: {}, // Shows the active marker upon click
    selectedPlace: {},
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&censor=false&key=AIzaSyA50KK3_YkxIwvDfiU58RXo6lVksvQprD8`
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(this);
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: data.results[0].formatted_address,
            isLoading: false,
          });
        })
        .catch((error) => alert(error));
      // console.log(this.state);
    });
  }
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <div class={styles.loader}></div>
        ) : (
          <div className={styles.userLocPage}>
            <div>
              <div className={styles.header}>User's Current Location </div>
              <Map
                google={this.props.google}
                zoom={14}
                style={{ width: "100%", height: "100%" }}
                initialCenter={{
                  lat: this.state.latitude,
                  lng: this.state.longitude,
                }}
              >
                <Marker
                  onClick={this.onMarkerClick}
                  name={"Current Location"}
                />
                <InfoWindow
                  marker={this.state.activeMarker}
                  visible={this.state.showingInfoWindow}
                  onClose={this.onClose}
                >
                  <div className={styles.infoDetails}>
                    <h4>{this.state.address}</h4>
                  </div>
                </InfoWindow>
              </Map>
            </div>
            <button className={styles.parkingButton}>
              <span>
                <Link href={{ pathname: "/showLocations" }}>
                  <a>Show Parking Spots</a>
                </Link>
              </span>
            </button>
          </div>
        )}
      </div>
    );
  }
}
// export default UserWindow;
export default GoogleApiWrapper({
  apiKey: "AIzaSyBUubDA69b60fcLydMGlX67mcSxbZZT1Pg",
})(UserWindow);
