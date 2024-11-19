import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
      <Link to='/Home'><img className='logo' src='/CIAE로고 2.png' alt='logo' /></Link>
    </li> 
  );
}

function App() {
  const location = useLocation();
  
  const hideBackgroundPaths = [];
  const hideNavPaths = ['/Learning', '/Recommend'];
  const showNav = !hideNavPaths.includes(location.pathname);
  const showBackground = !hideBackgroundPaths.includes(location.pathname);
  return (
    <div>
      {showBackground && (
        <div className='Main'>
          <img src='/MainBackground.png' className='MainBackground' alt='MainBackground'/>
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
        <Route path="/Home" element={<Home />} />
        <Route path="/Bookshelf" element={<Bookshelf />} />
        <Route path="/Turtle" element={<Turtle />} />
        <Route path="/Village" element={<Village />} />
        <Route path="/Learning" element={<Learning />} />
        <Route path="/DeepSea" element={<DeepSea />} />
        <Route path="/Space" element={<Space />} />
        <Route path="/Sky" element={<Sky />} />
        <Route path="/Forest" element={<Forest />} />
        <Route path="/Recommend" element={<Recommend />} />
      </Routes>
    </div>
);
}

export default function AppWrapper() {
return (
  <Router>
    <App />
  </Router>
);
}