import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Pusher from 'pusher-js';

Pusher.logToConsole = true;

const pusherKey = process.env.REACT_APP_PUSHER_KEY;

export default function Chat() {
	const sender = localStorage.getItem('user_id');
	// const [sender, setSender] = useState(null);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');

	let { receiver } = useParams();

	const headers = {
		'x-access-token': localStorage.getItem('token')
	};

	// useEffect(() => {
	//   getSender();
	// }, []);

	useEffect(() => {
		setMessages([]);
		getMessages();

		Pusher.logToConsole = true;

		var pusher = new Pusher(pusherKey, {
			cluster: 'ap1',
			forceTLS: true,
			authEndpoint: '/api/chat/pusher/auth',
			auth: {
				headers
			}
		});

		const ids = [+sender, +receiver].sort();

		const channelName = `private-chat-${ids[0]}-${ids[1]}`;

		var channel = pusher.subscribe(channelName);
		channel.bind('message', function (data) {
			// console.log(data);
			setMessages((messages) => [...messages, data]);
		});

		return () => {
			pusher.unsubscribe(channelName);
		};
	}, [receiver, sender]);

	// const getSender = async () => {
	//   try {
	//     const response = await axios(`/api/users/id`, {
	//       headers: {
	//         "x-access-token": localStorage.getItem("token"),
	//       },
	//     });
	//     setSender(response.data);
	//   } catch (err) {
	//     console.log(err);
	//   }
	// };

	const sendMessage = async () => {
		await axios.post(
			`/api/chat/${receiver}`,
			{
				data: { message: input }
			},
			{
				headers
			}
		);

		setInput('');
	};

	const getMessages = async () => {
		let { data } = await axios.get(`/api/chat/${receiver}`, {
			headers
		});

		setMessages((messages) => [...messages, ...data]);
	};

	return (
		<div className='d-flex flex-column h-100 text-align-right'>
			<div className='flex-grow-1 p-3'>
				{messages.map((message, index) => (
					<div key={index} className={message.sender_id === sender ? 'text-right my-2' : 'text-left my-2'}>
						<div className=''>
							<span
								className={`px-2 py-1 rounded text-white ${
									message.sender_id === sender ? 'bg-primary' : 'bg-secondary'
								}`}>
								{message.text}
							</span>
						</div>
					</div>
				))}
			</div>

			<div className='bg-light p-4 border-top'>
				<div className='input-group'>
					<input
						type='text'
						className='form-control'
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === 'Enter') sendMessage();
						}}
					/>
					<div className='input-group-append'>
						<button onClick={sendMessage} className='btn btn-outline-primary'>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
