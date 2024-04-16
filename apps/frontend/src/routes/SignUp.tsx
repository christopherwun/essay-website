import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../app.css';

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  function signup() {
    // use fetch to login
    fetch('http://localhost:8000/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((res) => {
      if (res.status === 201) {
        navigate('/login');
      } else {
        // eslint-disable-next-line no-alert
        alert(`Signup failed`);
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

      <button onClick={signup} className="button">
        Sign Up
      </button>

      <h4>Already have an account?</h4>
      <Link to="/login">Log in</Link>
    </div>
  );
}
