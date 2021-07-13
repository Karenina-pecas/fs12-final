import './App.css'
import Dashboard from './components/Dashboard'
import React, { useEffect, useState } from 'react'
import UserRegistration from './components/UserRegistration'
import UserLogin from './components/UserLogin'
import UserProfile from './components/UserProfile'
import Chat from './components/Chat'
import UserEdit from './components/UserEdit'
import axios from 'axios'

import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom'
import GuestView from './components/GuestView'

function App() {
  const avatarStyles = {
    height: '36px',
    width: '36px',
    borderRadius: '50%',
    marginLeft: '10px'
  }
  const logOut = (e) => {
    localStorage.clear()
    window.location.href = '/userLogin'
  }
  const [user, setUser] = useState([])

  useEffect(() => {
    getUsers()
  }, [localStorage.getItem('token')])

  const getUsers = async () => {
    let token = localStorage.getItem('token')
    if (token)
      try {
        const response = await axios(`/api/users/id`, {
          headers: {
            'x-access-token': token
          }
        })
        setUser(response.data)
      } catch (err) {
        console.log(err)
      }
  }

  return (
    <div className='App'>
      <Router>
        <nav>
          {localStorage.getItem('token') ? (
            <div className='navbar gap-3 navbar-expand'>
              <div className='mr-auto'>
                {user.name}
                {user && user.profile_photo && (
                  <img style={avatarStyles} alt='User profile' src={'/img/' + user.profile_photo} />
                )}
              </div>
              <NavLink className='nav-item' to='/'>
                Dashboard
              </NavLink>
              <NavLink className='nav-item' to='/chat'>
                Chat
              </NavLink>
              <NavLink className='nav-item' to='/userProfile'>
                Profile
              </NavLink>
              <NavLink className='nav-item' to='/userEdit'>
                Edit Profile
              </NavLink>
              <button className='btn btn-link pl-0 nav-item' onClick={logOut}>
                Log-out
              </button>
            </div>
          ) : (
            <div className='navbar gap-3 navbar-expand'>
              <NavLink className='nav-item' to='/userRegistration'>
                Register
              </NavLink>
              <NavLink className='nav-item' to='/userLogin'>
                Login
              </NavLink>
            </div>
          )}
        </nav>

        <Switch>
          {localStorage.getItem('token') ? (
            <div>
              <Route path='/' exact>
                <Dashboard />
              </Route>
              <Route path='/userProfile'>
                <UserProfile />
              </Route>
              <Route path='/chat'>
                <Chat />
              </Route>
              <Route path='/userEdit'>
                <UserEdit />
              </Route>
            </div>
          ) : (
            <div>
              {!window.location.pathname.includes('guestview') ? (
                <Redirect
                  to={{
                    pathname: '/userLogin'
                  }}
                />
              ) : null}
              <Route path='/userLogin'>
                <UserLogin />
              </Route>
              <Route path='/userRegistration'>
                <UserRegistration />
              </Route>
              <Route path='/guestview/:id'>
                <GuestView />
              </Route>
              )
            </div>
          )}
        </Switch>
      </Router>
    </div>
  )
}

export default App
