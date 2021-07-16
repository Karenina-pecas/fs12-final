import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useRouteMatch, useParams } from 'react-router-dom';

export default function ChatFriendList() {
  const [item, setItem] = useState([]);
  const [user, setUser] = useState([]);

  let { id } = useParams();

  useEffect(() => {
    getUsers();
  }, [id]);

  const getUsers = async () => {
    try {
      const response = await axios(`/api/users`, {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      });

      setItem(response.data);
      getUserId();
    } catch (err) {
      console.log(err);
    }
  };
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
    <div className='list-group users-list'>
      <div>
        <div>
          <h3 className='text-center mt-3'>Please, select a friend to chat with!</h3>
        </div>
      </div>
      <div>
        {item
          .filter((e) => e.id !== user.id)
          .map((list, index) => (
            <NavLink
              className='text-decoration-none d-flex justify-content-evenly my-2'
              to={`/chatPage/chat/${list.id}`}
              key={index}>
              <img className='imgfriend' src={process.env.PUBLIC_URL + `/img/${list.profile_photo}`} alt='' />
              <h4 className='my-3'>{list.name}</h4>
            </NavLink>
          ))}
      </div>
    </div>
  );
}
