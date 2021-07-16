import React, { useState } from 'react';
import axios from 'axios';

function UserLogin(props) {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setUser((state) => ({
      ...state,
      [name]: value
    }));
  };

  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/users/login', user);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.user_id);
      window.location.href = '/';
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container w-75'>
      <h3 className='text-center fw-bold mb-4 fs-1 mt-5'>Sign in</h3>
      <form onSubmit={login}>
        <div className='mb-3'>
          <label className='form-label'>Email</label>
          <input
            type='text'
            className='form-control'
            name='email'
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Password</label>
          <input
            type='password'
            className='form-control'
            name='password'
            value={user.password}
            onChange={handleChange}
          />
        </div>
        {/*  */}
        {/*  */}
        <button type='submit' className='btn btn-primary btn-block mb-3 hover'>
          Log in
        </button>
      </form>
      <footer className='footer'>
        <div className='row align-items-center justify-content-xl-between'>
          <div className='col-xl-6 m-auto text-center'>
            <div className='copyright'>
              <p>
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

export default UserLogin;
