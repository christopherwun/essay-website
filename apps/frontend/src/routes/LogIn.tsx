import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../app.css';

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  function login() {
    // use fetch to login
    fetch('http://localhost:8000/api/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((res) => {
      if (res.status === 200) {
        navigate('/');
      } else {
        // eslint-disable-next-line no-alert
        alert(`Login failed`);
      }
    });
  }

  return (
    <div>
      <h4>Username</h4>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input"
      />

      <h4>Password</h4>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />

      <button onClick={login}>Login</button>

      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <h4>Don't have an account?</h4>
      <Link to="/signup">Sign up</Link>
    </div>
  );
}
