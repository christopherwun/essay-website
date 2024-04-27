import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter,
  RouterProvider,
  RouteObject,
  Navigate,
} from 'react-router-dom';

import axios from 'axios';

import Login from './routes/LogIn';
import Signup from './routes/SignUp';
import Homepage from './routes/Homepage';

// Define routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
];

// Create router
const router = createHashRouter(routes);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/account/user', {
          withCredentials: true,
        });
        setIsLoggedIn(response.status === 200);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <RouterProvider router={router}>
      {isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />}
    </RouterProvider>
  );
};

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
