// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/global.css'

// Import Layout
import App from './App';

// Import các trang
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassWord from './pages/ForgotPassWord';
import Payment from './pages/Payment';
import ProfilePage from './pages/ProfilePage';
import ProductDetail from './pages/ProductDetail';
import AdminPage from './pages/AdminPage';
import ProductList from './pages/ProductList';
import Introduction from './pages/Introduction';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassWord /> },
      { path: 'payment', element: <Payment /> }, 
      { path: 'profile', element: <ProfilePage /> },
      { path: 'product/:id', element: <ProductDetail /> },
      {path: 'productlist', element: <ProductList/>},
      {path: 'introduction', element: <Introduction/>},
    ],
  },
  {
    path: '/admin',
    element: <AdminPage />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);