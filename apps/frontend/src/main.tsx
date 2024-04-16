import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter,
  RouterProvider,
  RouteObject,
} from 'react-router-dom';

import Login from './routes/LogIn';
import Signup from './routes/SignUp';
import Homepage from './routes/Homepage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Homepage />,
  },
  {
    // This is the starting page
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
];

const router = createHashRouter(routes);

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
