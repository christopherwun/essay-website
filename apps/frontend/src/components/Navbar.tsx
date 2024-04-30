import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';

export default function Navbar({
  user,
  logout,
  //   toLogin,
}: {
  user: string | null;
  logout: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <h1 className="title">Personal Essay Tutor</h1>
      {user ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'space-between',
            flexDirection: 'row',
          }}
        >
          {/* Include a space after Hi user */}
          <p style={{alignSelf: 'center'}}>Hi {user}! </p>
          <button onClick={logout} className="answer-button">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </div>
  );
}
