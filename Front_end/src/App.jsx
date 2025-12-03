// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import MainPage from './pages/MainPage.jsx';
// import Login from './pages/Login.jsx';
// import Signup from './pages/Signup.jsx';
// import ForgotPassWord from './pages/ForgotPassWord.jsx';
// import Payment from './pages/Payment.jsx';   
// import './styles/global.css';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<MainPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPassWord />} />
//           <Route path="/payment" element={<Payment />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



// //new
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Import các trang hiện có
// import MainPage from './pages/MainPage.jsx';
// import Login from './pages/Login.jsx';
// import Signup from './pages/Signup.jsx';
// import ForgotPassWord from './pages/ForgotPassWord.jsx';
// import Payment from './pages/Payment.jsx';

// // 👇 1. IMPORT CÁC TRANG CÒN THIẾU
// import ProfilePage from './pages/ProfilePage.jsx'; 
// import ProductDetailPage from './pages/ProductDetailPage.jsx'; // (Nếu bạn đã tạo trang này)
// import AdminPage from './pages/AdminPage.jsx'; // (Nếu bạn đã tạo trang admin)

// import './styles/global.css';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<MainPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPassWord />} />
//           <Route path="/payment" element={<Payment />} />

//           {/* 👇 2. THÊM CÁC ROUTE NÀY VÀO 👇 */}
          
//           {/* Route cho trang cá nhân (Khách hàng) */}
//           <Route path="/profile" element={<ProfilePage />} />

//           {/* Route cho trang chi tiết sản phẩm (khi click Xem chi tiết) */}
//           <Route path="/product/:id" element={<ProductDetailPage />} />

//           {/* Route cho trang quản trị (Admin) */}
//           <Route path="/admin" element={<AdminPage />} />

//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/global.css';

function App() {
  return (
    <div className="App">
      {/* Navbar luôn hiển thị */}
      <Navbar />
      
      {/* Outlet là nơi MainPage, Login, Profile... sẽ hiển thị */}
      <div style={{ minHeight: '80vh' }}>
        <Outlet />
      </div>

      {/* Footer luôn hiển thị */}
      <Footer />
    </div>
  );
}

export default App;