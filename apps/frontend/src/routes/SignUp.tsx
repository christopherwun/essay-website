import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import '../app.css';

type FormData = {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
};

export default function SignUp() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // use fetch to signup
    fetch('http://localhost:8000/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        admin: false,
      }),
    }).then((res) => {
      if (res.status === 201) {
        navigate('/login');
      } else {
        // eslint-disable-next-line no-alert
        alert(`Signup failed`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h1>Sign Up</h1>
      <div className="form-inputs">
        <label className="form-label">
          First Name
          <input {...register('firstName')} className="form-input" />
        </label>
        <label className="form-label">
          Last Name
          <input {...register('lastName')} className="form-input" />
        </label>
        <label className="form-label">
          Email
          <input {...register('email')} className="form-input" />
        </label>
        <label className="form-label">
          Username
          <input {...register('username')} className="form-input" />
        </label>
        <label className="form-label">
          Password
          <input {...register('password')} className="form-input" />
        </label>
        <button type="submit" className="form-button">
          Submit
        </button>
        <h4>
          Already have an account?{'  '}
          <Link to="/login">Log in</Link>
        </h4>
      </div>
    </form>
  );
}
