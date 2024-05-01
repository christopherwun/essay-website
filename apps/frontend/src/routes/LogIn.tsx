import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import '../app.css';

type FormData = {
  username: string;
  password: string;
};

export default function LogIn() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    // check if logged in aleready
    fetch('/api/account/user', {
      method: 'GET',
      credentials: 'include',
    }).then((res) => {
      if (res.status === 200) {
        navigate('/');
      }
    });
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    // use fetch to login
    fetch('/api/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Connection': 'close'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    }).then((res) => {
      console.log(res); // Log the entire response object
      console.log(res.status); // Log the status code

      if (res.status === 200) {
        console.log('Login successful!');
        navigate('/');
      } else {
        console.log(res.status);
        console.log(res.statusText);
        const alert_str = `Login failed: ${res.status}: ${res.statusText}`;

        // eslint-disable-next-line no-alert
        alert(alert_str);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h1>Log In</h1>
      <div className="form-inputs">
        <label className="form-label">
          Username
          <input {...register('username')} className="form-input" />
        </label>
        <label className="form-label">
          Password
          <input
            {...register('password')}
            type="password"
            className="form-input"
          />
        </label>
        <button type="submit" className="form-button">
          Log In
        </button>
        <h4>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </h4>
      </div>
    </form>
  );
}
