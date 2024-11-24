import './App.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Turtle from './components/Turtle';
import Learning from './components/Learning';
import Bookshelf from './components/Bookshelf';
import Home from './components/Home';
import Village from './components/Village';
import DeepSea from './components/TurtleVillage/DeepSea';
import Space from './components/TurtleVillage/Space';
import Sky from './components/TurtleVillage/Sky';
import Forest from './components/TurtleVillage/Forest';
import Recommend from './components/Recommend';
import Login from './components/login';
import ProtectedRoute from './components/auth/privateroute';
import AuthProvider from './components/auth/authprovider';
import { AuthContext } from './components/auth/authprovider';


function List(props) {
  return (
    <li className={props.thing}>
      <Link to={props.route}>{props.name}</Link>
    </li>
  );
}

function Logo() {
  return (
    <li>
      <Link to='/Home'><img className='logo' src='/CIAE_logo.png' alt='logo' /></Link>
    </li> 
  );
}

function App() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  const hideBackgroundPaths = [];
  const hideNavPaths = ['/Learning', '/Recommend', '/login'];
  const showNav = user && !hideNavPaths.includes(location.pathname);
  const showBackground = !hideBackgroundPaths.includes(location.pathname);

  return (
    <div>
      {showBackground && (
        <div className='Main'>
          <img src='/MainBackground.png' className='MainBackground' alt='MainBackground' />
          {showNav && (
            <>
              <audio autoPlay loop>
                <source src="/The Center Isn't Holding - National Sweetheart.mp3" type="audio/mpeg" />
              </audio>
              <nav>
                <ul className='navAll'>
                  <Logo />
                  <List route='/Bookshelf' name='내 서재' thing='bookshelf' />
                  <List route='/Turtle' name='거북이 미니게임' thing='turtle' />
                  <List route='/Village' name='거북이 마을' thing='village' />
                  <List route='/Recommend' name='독서 시작하기' thing='learning' />
                </ul>
              </nav>
            </>
          )}
        </div>
      )}

      {/* 페이지별 라우팅 설정 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={
          user ? <Navigate to="/Home" /> : <Login />
        } />
        <Route path="/Home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/Bookshelf" element={
          <ProtectedRoute>
            <Bookshelf />
          </ProtectedRoute>
        } />
        <Route path="/Turtle" element={
          <ProtectedRoute>
            <Turtle />
          </ProtectedRoute>
        } />
        <Route path="/Village" element={
          <ProtectedRoute>
            <Village />
          </ProtectedRoute>
        } />
        <Route path="/Learning" element={
          <ProtectedRoute>
            <Learning />
          </ProtectedRoute>
        } />
        <Route path="/DeepSea" element={
          <ProtectedRoute>
            <DeepSea />
          </ProtectedRoute>
        } />
        <Route path="/Space" element={
          <ProtectedRoute>
            <Space />
          </ProtectedRoute>
        } />
        <Route path="/Sky" element={
          <ProtectedRoute>
            <Sky />
          </ProtectedRoute>
        } />
        <Route path="/Forest" element={
          <ProtectedRoute>
            <Forest />
          </ProtectedRoute>
        } />
        <Route path="/Recommend" element={
          <ProtectedRoute>
            <Recommend />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}


export default function AppWrapper() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}
