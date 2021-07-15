import './App.css';
import Dashboard from './components/Dashboard';
import React, { useEffect, useState } from 'react';
import UserRegistration from './components/UserRegistration';
import UserLogin from './components/UserLogin';
import UserProfile from './components/UserProfile';
import Chat from './components/Chat';
import UserEdit from './components/UserEdit';
import ChatPage from './components/ChatPage';
import ChatFriendList from './components/ChatFriendList';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom';
import GuestView from './components/GuestView';
import logo from './img/logoyellow.png';

function App() {
	const avatarStyles = {
		height: '50px',
		width: '50px',
		borderRadius: '50%',
		marginLeft: '10px'
	};
	const logOut = (e) => {
		localStorage.clear();
		window.location.href = '/userLogin';
	};
	const [user, setUser] = useState([]);

	useEffect(() => {
		if (localStorage.getItem('token')) getUsers();
	}, [localStorage.getItem('token')]);

	const getUsers = async () => {
		try {
			const response = await axios(`/api/users/id`, {
				headers: {
					'x-access-token': localStorage.getItem('token')
				}
			});
			setUser(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className='App'>
			<Router>
				<nav className='navbar navbar-expand-lg navbar-dark custom-navbar '>
					{localStorage.getItem('token') ? (
						<div className='container'>
							<NavLink to='/'>
								<img width='60' height='60' src={logo} alt='' />
							</NavLink>
							<button
								class='navbar-toggler'
								type='button'
								data-toggle='collapse'
								data-target='#navbarText'
								aria-controls='navbarText'
								aria-expanded='false'
								aria-label='Toggle navigation'>
								<span class='navbar-toggler-icon'></span>
							</button>
							<div class='collapse navbar-collapse' id='navbarText'>
								<ul className='navbar-nav mr-auto'>
									<li className='nav-item'>
										<NavLink className='nav-link' to='/'>
											<span className='toggle'>Dashboard</span>
											<span class='sr-only'>(current)</span>
										</NavLink>
									</li>
									<li className='nav-item'>
										<NavLink className='nav-link' to='/chatPage'>
											<span className='toggle'>Chat</span>
										</NavLink>
									</li>
									<li className='nav-item'>
										<NavLink className='nav-link' to='/userProfile'>
											<span className='toggle'>Profile</span>
										</NavLink>
									</li>
									<li className='nav-item'>
										<NavLink className='nav-link' to='/userEdit'>
											<span className='toggle'>Edit Profile</span>
										</NavLink>
									</li>
								</ul>
								<button
									className='btn btn-outline-success w-20  nav-item pl-0 
              '
									type='submit'
									onClick={logOut}>
									<span className='pl-2'>Log-out</span>
								</button>

								<div className='mx-2 '>
									<span className='navbar-name pl-4 pr-2'>{user.name}</span>
									{user && user.profile_photo && (
										<img
											style={avatarStyles}
											className='d-sm-inline-block'
											alt='User profile'
											src={'/img/' + user.profile_photo}
										/>
									)}
								</div>
							</div>
						</div>
					) : (
						<div className='navbar gap-3 navbar-expand navbar-dark opacity-40'>
							<div className='container-fluid'>
								<a className='mr-2' href='#'>
									<img width='100' height='100' src={logo} />
								</a>
								<NavLink active className='nav-item text-decoration-none orange px-4' to='/userRegistration'>
									<span className='fs-1'>Register</span>
								</NavLink>
								<NavLink active className='nav-item text-decoration-none orange' to='/userLogin'>
									<span className='fs-1 mr-5'>Login</span>
								</NavLink>
							</div>
						</div>
					)}
				</nav>

				<Switch>
					<Route path='/userLogin'>
						<UserLogin />
					</Route>
					<Route path='/userRegistration'>
						<UserRegistration />
					</Route>
					<Route path='/guestview/:id'>
						<GuestView />
					</Route>

					{localStorage.getItem('token') && (
						<div>
							<Route path='/' exact>
								<Dashboard />
							</Route>
							<Route path='/userProfile'>
								<UserProfile />
							</Route>
							<Route path='/chatPage'>
								<ChatPage />
							</Route>
							<Route path='/userEdit'>
								<UserEdit />
							</Route>
						</div>
					)}
				</Switch>
			</Router>
		</div>
	);
}

export default App;
