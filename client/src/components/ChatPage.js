import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Chat from './Chat';
import ChatFriendList from './ChatFriendList';
import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatPage() {
	const [user, setUser] = useState([]);

	useEffect(() => {
		getUserId();
	}, []);

	const getUserId = async () => {
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
		<div>
			<div className='chat-header'>
				<h1 className='text-center fs-bold mb-5 pt-3'>Welcome, {user.name}. Let's chat!</h1>
			</div>
			<div className='App d-flex'>
				<ChatFriendList />
				<Switch>
					<div className='col-8 '>
						<Route path='/chatPage/chat/:receiver'>
							<Chat />
						</Route>
					</div>
				</Switch>
			</div>
		</div>
	);
}

export default ChatPage;
