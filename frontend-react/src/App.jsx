import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassWord from './pages/ForgotPassWord.jsx';
import Payment from './pages/Payment.jsx';  
import ProductList from './pages/ProductList.jsx';
import Introduction from './pages/Introduction.jsx';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassWord />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/introduction" element={<Introduction />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;