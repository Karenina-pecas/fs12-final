import React, { useState, useEffect } from 'react';
import Map from './Map';
import axios from 'axios';

export default function Dashboard() {
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0
  });
  const [status, setStatus] = useState(null);
  const [sharingStatus, setSharingStatus] = useState(false);

  useEffect(() => {
    getLocation();
    setInterval(getLocation, 10000);
  }, []);
  useEffect(() => {
    if (sharingStatus) updateMyLocation();
  }, [position]);

  //ask the user for their current location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setStatus('Unable to retrieve your location');
        }
      );
    }
  };

  const sendMyCurrentLocation = () => {
    try {
      axios.post(
        '/api/location/liveLocation',
        { latitude: position.lat, longitude: position.lng },
        {
          headers: {
            'x-access-token': localStorage.getItem('token')
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const updateMyLocation = () => {
    try {
      axios.put(
        '/api/location/liveLocation',
        { latitude: position.lat, longitude: position.lng },
        {
          headers: {
            'x-access-token': localStorage.getItem('token')
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const shareMyLocation = () => {
    sendMyCurrentLocation();
    setSharingStatus(true);
  };

  const stopSharingMyLocation = () => {
    setSharingStatus(false);
  };

  return (
    <div className='container'>
      <div className='my-4 d-flex justify-content-center'>
        <button className=' btn btn-sos shadow-lg' onClick={sendMyCurrentLocation} disabled={!position}>
          SOS
        </button>
      </div>
      <div className='row'>
        <div className=' g-0 gap-1 mb-3  d-flex justify-content-center'>
          {/* <button className='btn btn-primary w-50' onClick={sendMyCurrentLocation} disabled={!position}>
            Send my current location
          </button> */}
          <button className='btn btn-primary w-50 shadow' hidden={sharingStatus} onClick={shareMyLocation}>
            Share my location
          </button>
          <button className='btn btn-warning w-50' hidden={!sharingStatus} onClick={stopSharingMyLocation}>
            Stop sharing my location
          </button>
        </div>
        <Map position={position}></Map>
      </div>
    </div>
  );
}
