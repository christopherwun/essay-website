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
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <p>Hi, {user}!{'  '}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </div>
  );
}
