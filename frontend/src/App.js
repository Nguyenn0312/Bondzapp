import './App.css';
import Navbar from './components/Navbar';
import Sign from './pages/Sign';
import About from './pages/About';
import Home from './pages/Home';
import Verify from './pages/Verify';
import Market from './pages/Market';
import Fundpage from './pages/Fundpage';
import TestUi from './pages/TestUI';
import FAQ from './pages/FAQ';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from './pages/profile';
import { Gradient } from "./lib/gradient";
import { useLayoutEffect, /*useState*/ } from 'react';
import { Loader } from "./components/Loader"; // Import the Loader component

function App() {
  
  useLayoutEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);
  //const [isLoading, setIsLoading] = useState(true);
  return (
    <Router>
    {/*{isLoading ? (*/}
    {/*  <Loader /> */} 
    {/*) : ( */}

      <MainContainer>
        <Navbar />
        <canvas id="gradient-canvas" className="background-canvas" data-transition-in />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market/>} />
          <Route path="/fund" element={<Fundpage/>} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/testui" element={<TestUi />} />
          <Route path="/loader" element={<Loader />} />
        </Routes>
      </MainContainer>
      {/* )}*/}
    </Router>
  );
}

const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
`;

export default App;
