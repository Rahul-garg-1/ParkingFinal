import React, { Component } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import sha256 from "sha256";
import web3 from "../../ethereum/web3";
import GoogleMap from "../GoogleMap";
import Parking from "../../ethereum/Parking.js";
import axios from "axios";
import { withRouter } from "next/router";
// import styles from "./css/login.module.css";
import styles from "./login.module.css";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useState } from "react";
import { useParams } from "react-router";
var uid = 1;

var current_latitude, current_longitude;

const SignUp = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    userAddress: "",
    rate: 0,
    locAddress: "",
    availableSpots: 0,
    password: "",
    carNo: "",
    mobileNumber: "",
    locations: [],
    isloading: false,
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      current_latitude = position.coords.latitude.toString();
      current_longitude = position.coords.longitude.toString();
    });
  });

  const handleAutoCompleteChange = (address) => {
    setUserInfo((prevState) => ({
      ...prevState,
      locAddress: address,
    }));
  };

  const handleSelect = (address) => {
    setUserInfo((prevState) => ({
      ...prevState,
      locAddress: address,
    }));
    console.log(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setUserInfo((prevState) => ({
          ...prevState,
          latitude: latLng.lat.toString(),
          longitude: latLng.lng.toString(),
        }));
      })
      .catch((error) => console.error("Error", error));
  };

  // const handleChange = (event) => {
  //   setUserInfo((prevState) => ({
  //     ...prevState,
  //     [event.target.name]: event.target.value,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(userInfo);

    // intial fetch
    setUserInfo({ ...userInfo, locations: [] });

    var len = await Parking.methods.getParkingSpotsCount().call({
      gas: 10000000,
    });

    for (var i = 0; i < len; i++) {
      var loc = await Parking.methods.getLocations(i).call({
        gas: 10000000,
      });
      setUserInfo({
        ...userInfo,
        locations: userInfo.locations.push(loc),
      });
    }

    const account = await web3.eth.getAccounts();
    console.log(account[0]);
    if (params.person === "user") {
      const tem = await Parking.methods.checkAlreadyRegisteredUser().call({
        from: account[0],
      });
      if (tem) {
        alert("User already registered!!");
        navigate("/userWindow");
        return;
      }
      userInfo.latitude = current_latitude;
      userInfo.longitude = current_longitude;
      console.log(userInfo.locations);
      await Parking.methods
        .registerNewUser(
          userInfo.carNo,
          userInfo.mobileNumber,
          userInfo.latitude,
          userInfo.longitude,
          userInfo.password
        )
        .send({
          from: account[0],
          gas: 10000000,
        });
      alert("Registered Successfully");
      navigate("/userWindow");
    } else if (params.person === "spotOwner") {
      const already_registered = await Parking.methods
        .checkAlreadyRegisteredParkingSpot()
        .call({
          from: account[0],
        });
      if (already_registered) {
        alert("A parking spot is already registered with your account!!");
        navigate("/ownerDetails");
        return;
      }
      const hash = sha256(account[0] + userInfo.password);
      console.log(hash);
      await Parking.methods
        .registerNewParkingSpot(
          userInfo.rate,
          userInfo.latitude,
          userInfo.longitude,
          userInfo.locAddress,
          userInfo.availableSpots,
          hash,
          userInfo.password
        )
        .send({
          from: account[0],
          gas: 10000000,
        });

      //final fetch
      var len = await Parking.methods.getParkingSpotsCount().call({
        gas: 10000000,
      });

      var loc = await Parking.methods.getLocations(len - 1).call({
        gas: 10000000,
      });
      userInfo.locations.push(loc);
      // console.log(this.state.locations);
      alert("Registered Spot Successfully");
      navigate("/ownerDetails");
    }
  };
  return (
    <div className={styles.outer}>
      {params.person === "spotOwner" ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div className={styles.input}>
            <div className={styles.inputBox}>
              <label for="userAddress">User Address</label>
              <input
                type="text"
                name="userAddress"
                value={userInfo.userAddress}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    userAddress: e.target.value,
                  })
                }
              ></input>
            </div>
            <div className={styles.inputBox}>
              <label for="rate">Rate</label>
              <input
                type="number"
                name="rate"
                value={userInfo.rate}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    rate: e.target.value,
                  })
                }
              ></input>
            </div>
            {/* <PlacesAutocomplete
              value="jbkj{state.address}"
              onChange={handleAutoCompleteChange}
              onSelect={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div className={styles.inputBox}>
                  <label for="locAddress">Location Address</label>
                  <input
                    type="text"
                    name="locAddress"
                    value={userInfo.locAddress}
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        locAddress: e.target.value,
                      })
                    }
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? {
                            backgroundColor: "#fafafa",
                            cursor: "pointer",
                          }
                        : {
                            backgroundColor: "#ffffff",
                            cursor: "pointer",
                          };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}

> Rahul garg:
>
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete> */}
            <PlacesAutocomplete
              value={userInfo.locAddress}
              onChange={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div className={styles.inputBox}>
                  <label for="locAddress">Location Address</label>
                  <input
                    {...getInputProps({
                      placeholder: "Search Places ...",
                      className: "location-search-input",
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            <div className={styles.inputBox}>
              <label for="availableSpots">Available Spots</label>
              <input
                type="number"
                name="availableSpots"
                value={userInfo.availableSpots}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    availableSpots: e.target.value,
                  })
                }
              ></input>
            </div>
            <div className={styles.inputBox}>
              <label for="password">Password</label>
              <input
                type="password"
                name="password"
                value={userInfo.password}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    password: e.target.value,
                  })
                }
              ></input>
            </div>
            <div className={styles.inputBox}>
              <input type="submit" name="submit" value="Sign Up"></input>
            </div>
          </div>
        </form>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div className={styles.input}>
            <div className={styles.inputBox}>
              <label for="userAddress">User Address</label>
              <input
                type="text"
                name="userAddress"
                value={userInfo.userAddress}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    userAddress: e.target.value,
                  })
                }
              ></input>
            </div>

            <div className={styles.inputBox}>
              <label for="carNo">Car Number</label>
              <input
                type="text"
                name="carNo"
                value={userInfo.carNo}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    carNo: e.target.value,
                  })
                }
              ></input>
            </div>
            <div className={styles.inputBox}>
              <label for="mobileNo"> Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={userInfo.mobileNumber}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    mobileNumber: e.target.value,
                  })
                }
              ></input>
            </div>
            <div className={styles.inputBox}>
              <label for="password">Password</label>
              <input
                type="password"
                name="password"
                value={userInfo.password}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    password: e.target.value,
                  })
                }
              ></input>
            </div>

            <div className={styles.inputBox}>
              <input type="submit" name="submit"></input>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default withRouter(
  GoogleApiWrapper({
    apiKey: "AIzaSyCRuuxo5Ay2Prx0W6SlQJ9eOKs9hRHeqm0",
  })(SignUp)
);