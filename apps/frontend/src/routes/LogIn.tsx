import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form"
import '../app.css';

type FormData = {
  username: string;
  password: string;
};

export default function LogIn() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<FormData> = data => {
    // use fetch to login
    fetch('http://localhost:8000/api/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: data.username,
        password: data.password,
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
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h1>Log In</h1>
      <div className="form-inputs">
        <label className="form-label">
          Username
          <input {...register("username")} className='form-input'/>
        </label>
        <label className="form-label">
          Password
          <input {...register("password")} className='form-input'/>
        </label>
      <button type="submit" className="form-button">
        Log In
      </button>
      <h4>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Don't have an account?{' '}
          <Link to="/signup">Sign Up</Link>
        </h4>
        </div>

    </form>
  );
}
