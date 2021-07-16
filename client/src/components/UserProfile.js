import React, { useEffect, useState } from 'react';
import axios from 'axios';
import emoji from '../img/emoji.png';

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
		<div className='container'>
			<h3 className='text-center fw-bold my-4'>User Profile</h3>
			<h6 className='text-center fw-bold my-4'>Welcome to your profile page</h6>
			{/* <div> */}
			{/* <div> */}
			<div className='d-flex'>
				<h5>Hi {user.name}!</h5>
				<img className='emoji ml-3' alt='User profile' src={emoji} />
			</div>

			<div className='row'>
				<div className='col-md-4'>
					<div>
						<img className='profile-img' src={process.env.PUBLIC_URL + `/img/${user.profile_photo}`} alt='' />

						{/* <button onClick={handleSubmit}>Update Profile Photo</button> */}
					</div>
					<div className='my-4'>
						<span className='font-weight-bold'>Change Photo</span>
					</div>
					<div className='file btn btn-primary'>
						<input
							className='profile-choose-file'
							type='file'
							name='profile_photo'
							accept='image/*'
							handleChange={onFileChange}
						/>
					</div>
				</div>

				<div className='col-md-8'>
					{/* <div className=''> */}

					{/* <ul className='nav nav-tabs' id='myTab' role='tablist'>
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
								</ul> */}
					{/* </div>
						</div>
					</div>
					<div className='row'> */}
					<div className='d-flex justify-content-between'>
						<div className=''>
							<div className='row '>
								<div className='col-md-6 text-left'>
									<label>Name</label>
								</div>
								<div className='col-md-6 text-right'>
									<p>{user.name}</p>
								</div>
							</div>
							<div className='row'>
								<div className='col-md-6'>
									<label>Address</label>
								</div>
								<div className='col-md-6 text-right'>
									<p>{user.address}</p>
								</div>
								<div className='row'>
									<div className='col-md-6 text-left'>
										<label>Email</label>
									</div>
									<div className='col-md-6 text-right'>
										<p> {user.email}</p>
									</div>
								</div>
								<div className='row'>
									<div className='col-md-6 text-left'>
										<label>Phone</label>
									</div>
									<div className='col-md-6 text-right'>
										<p> {user.phone}</p>
									</div>
								</div>
								<div className='row'>
									<div className='col-md-6 text-left'>
										<label>Trusted Contact Person</label>
									</div>
									<div className='col-md-6 text-right'>
										<p> {user.trusted_name}</p>
									</div>
								</div>
								<div className='row'>
									<div className='col-md-6 text-left'>
										<label>Trusted Contact Number</label>
									</div>
									<div className='col-md-6 text-right'>
										<p> {user.trusted_contact}</p>
									</div>
								</div>
								<Link className='btn btn-primary' to='/userEdit'>
									Update Profile
								</Link>
							</div>
						</div>
					</div>
					{/* </div> */}
				</div>
			</div>
			{/* </div> */}
			{/* </div> */}
		</div>
		// </div>
	);
}
