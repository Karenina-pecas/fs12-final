import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

const errorMessage = 'There was a problem. Please try again later';

export default function UserProfile() {
  const [user, setUser] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios(`api/users/id`, {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      });
      console.log(response.data);
      setUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onFileChange = (event) => {
    // Update the state
    setUser((state) => ({ ...state, profile_photo: event.target.files[0] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('profile_photo', user.profile_photo, user.profile_photo.name);

    try {
      const response = await axios.put('api/users/profile/photo_profile', formData, {
        headers: {
          'x-access-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h3 className='text-center fw-bold mb-4'>User Profile</h3>
      <div className='container emp-profile'>
        <div>
          <div className='row'>
            <div className='col-md-4'>
              <div className='profile-img'>
                <img src={process.env.PUBLIC_URL + `/img/${user.profile_photo}`} alt='' />
                <div className='file btn btn-lg btn-primary'>
                  Change Photo
                  <input type='file' name='profile_photo' accept='image/*' handleChange={onFileChange} />
                </div>
                <button onClick={handleSubmit}>Update Profile Photo</button>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='profile-head'>
                <h5>Hi {user.name}</h5>
                <h6>Welcome to your profile page</h6>
                <p className='proile-rating'></p>
                <ul className='nav nav-tabs' id='myTab' role='tablist'>
                  <li className='nav-user'>
                    <a
                      className='nav-link active'
                      id='home-tab'
                      data-toggle='tab'
                      href='#home'
                      role='tab'
                      aria-controls='home'
                      aria-selected='true'>
                      About Me
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-4'></div>
            <div className='col-md-8'>
              <div className='tab-content profile-tab' id='myTabContent'>
                <div
                  className='tab-pane fade show active'
                  id='home'
                  role='tabpanel'
                  aria-labelledby='home-tab'>
                  <div className='row'>
                    <div className='col-md-3 text-left'>
                      <label>ID</label>
                    </div>
                    <div className='col-md-9 text-left'>
                      <p>{user.id}</p>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-3 text-left'>
                      <label>Name</label>
                    </div>
                    <div className='col-md-9 text-left'>
                      <p>{user.name}</p>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-3 text-left'>
                      <label>Address</label>
                    </div>
                    <div className='col-md-9 text-left'>
                      <p>{user.address}</p>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 text-left'>
                        <label>Email</label>
                      </div>
                      <div className='col-md-9 text-left'>
                        <p> {user.email}</p>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 text-left'>
                        <label>Phone</label>
                      </div>
                      <div className='col-md-9 text-left'>
                        <p> {user.phone}</p>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 text-left'>
                        <label>Trusted Contact Person</label>
                      </div>
                      <div className='col-md-9 text-left'>
                        <p> {user.trusted_name}</p>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 text-left'>
                        <label>Trusted Contact Number</label>
                      </div>
                      <div className='col-md-9 text-left'>
                        <p> {user.trusted_contact}</p>
                      </div>
                    </div>
                    <Link className='btn btn-primary' to='/userEdit'>
                      Update Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
