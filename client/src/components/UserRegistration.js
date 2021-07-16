import React, { useState } from 'react';
import axios from 'axios';

export default function UserRegistration() {
  const [msg, setMsg] = useState('');
  const [input, setInput] = useState([
    {
      name: '',
      address: '',
      phone: '',
      profile_photo: '',
      email: '',
      password: '',
      trusted_name: '',
      trusted_contact: '',
      latitude: '0',
      longitude: '0',
      location_token: '0'
    }
  ]);
  const [error] = useState('');
  const [message] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((state) => ({ ...state, [name]: value }));
  };

  const onFileChange = (event) => {
    // Update the state
    setInput((state) => ({ ...state, profile_photo: event.target.files[0] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log("submit button clicked");

    const formData = new FormData();

    formData.append('name', input.name);
    formData.append('address', input.address);
    formData.append('phone', input.phone);
    formData.append('profile_photo', input.profile_photo, input.profile_photo.name);
    formData.append('email', input.email);
    formData.append('password', input.password);
    formData.append('trusted_name', input.trusted_name);
    formData.append('trusted_contact', input.trusted_contact);
    formData.append('latitude', input.latitude);
    formData.append('longitude', input.longitude);
    formData.append('location_token', input.location_token);

    try {
      const response = await axios.post('/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      //   console.log(response.data.message);
      console.log(response);
      if (response.ok) {
        throw { message: response.data.message };
      }
      setMsg(response.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container-fluid w-75'>
      <h3 className='text-center mt-5 fw-bold mb-4 w-80'>Create Your Safemme Account</h3>
      <form className='row g-3'>
        <div className='col-12'>
          <label className='form-label'>Name</label>
          <input
            type='text'
            className='form-control'
            name='name'
            value={input.name}
            onChange={handleChange}
          />
        </div>
        <div className='col-12'>
          <label className='form-label'>Address</label>
          <input
            type='text'
            className='form-control'
            name='address'
            value={input.address}
            onChange={handleChange}
          />
        </div>
        <div className='col-md-12'>
          <label className='form-label '>Contact Number</label>
          <input
            placeholder='+34 123 456 789'
            type='text'
            className='form-control font-italic '
            name='phone'
            value={input.phone}
            onChange={handleChange}
          />
        </div>
        <div className='col-md-12'>
          <label htmlFor='formFile' className='form-label'>
            Profile Photo
          </label>

          <input
            placeholder='Choose your best photo'
            className='form-control'
            type='file'
            name='profile_photo'
            accept='image/*'
            onChange={onFileChange}
          />
        </div>

        <div className='col-md-6'>
          <label className='form-label'>Email</label>
          <input
            placeholder='name@example.com'
            type='email'
            className='form-control font-italic'
            name='email'
            value={input.email}
            onChange={handleChange}
          />
        </div>

        <div className='col-md-6'>
          <label className='form-label'>Password</label>
          <input
            type='password'
            className='form-control'
            name='password'
            value={input.password}
            onChange={handleChange}
          />
        </div>
        <div className='col-md-6'>
          <label className='form-label'>Trusted Person Name</label>
          <input
            type='trusted_name'
            className='form-control'
            name='trusted_name'
            value={input.trusted_name}
            onChange={handleChange}
          />
        </div>
        <div className='col-md-6'>
          <label className='form-label'>Trusted Contact Email</label>
          <input
            placeholder='name@example.com'
            type='trusted_contact'
            className='form-control font-italic'
            name='trusted_contact'
            value={input.trusted_contact}
            onChange={handleChange}
          />
        </div>
        <div className='col-12'>
          <div className='form-check'>
            <input className='form-check-input' type='checkbox' id='gridCheck' />
            <label className='form-check-label' required>
              Agree to Terms and Conditions
            </label>
          </div>
        </div>
        <div className='d-grid gap-2 d-md-flex justify-content-md-center'>
          <button type='button' className='btn btn-primary' onClick={(event) => handleSubmit(event)}>
            Submit
          </button>
        </div>
        <div className='col-12'>
          {message && <div className='alert alert-success'>{message}</div>}
          {error && <div className='alert alert-danger'>{error}</div>}
        </div>
        <div>{msg}</div>
      </form>
      <footer className='footer'>
        <div className='row align-items-center justify-content-xl-between'>
          <div className='col-xl-6 m-auto text-center'>
            <div className='copyright'>
              <p>
                {' '}
                <i className='mr-1 fw-bold'>Safemme</i>
                by Karenina, Kelly, Melani, Paulina, Yusmi
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
