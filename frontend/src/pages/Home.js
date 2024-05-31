import React, { useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import { Gradient } from "../lib/gradient";
import '../styles.css';
import { keyframes } from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

function Overlay() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useLayoutEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);

  const handleCreateAccount = () => {
    navigate('/sign');
  };

  return (
    <CanvasContainer> 
      <Homewrap>
        <Main1>
          <Container>
            <p><ColorText2>BondZapp</ColorText2></p>
            <h1>Trade bigger and get paid <ColorText>faster</ColorText>.</h1>
            <h2>A platform for the bond market to connect with the world</h2>
            <ListItem><FontAwesomeIcon icon={faCheck} /> No Time Limits</ListItem>
            <ListItem><FontAwesomeIcon icon={faCheck} /> 100% Profit Split</ListItem>
            <ListItem><FontAwesomeIcon icon={faCheck} /> 7 Day Payouts</ListItem>
            <SignInButton onClick={handleCreateAccount}> {/* Call the handleCreateAccount function */}
              Create Account
            </SignInButton>
          </Container>
          <RightBg>
            <img src="/assets/Picture1.png" alt="" />
          </RightBg>
        </Main1>
        <Main3>
          <AdditionalText>
            <AdditionalItem>
              <h3>Multi-account</h3>
              <p>Manage and provide your customers with multiple accounts for streamlined trading process</p>
            </AdditionalItem>
            <AdditionalItem>
              <h3>Multi-currency</h3>
              <p>Set different default currencies on account level to keep your exchange fees low</p>
            </AdditionalItem>
            <AdditionalItem>
              <h3>Multi-asset</h3>
              <p>Access 700,000+ OTC and exchange traded financial instruments from a single platform</p>
            </AdditionalItem>
            <AdditionalItem>
              <h3>Undisclosed model</h3>
              <p>Keep your customer data safely with you with our undisclosed customer model</p>
            </AdditionalItem>
          </AdditionalText>
        </Main3>
        <Main2>
          <h1>BondZapp</h1>
          <RightBg>
            <img src="/assets/home.png" alt="" />
          </RightBg>
        </Main2>
      </Homewrap>
      <Footer />
    </CanvasContainer>
  );
}

const rotate = keyframes`
  0% {
    transform: translateY(-20px);
  }
  50% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(-20px);
  }
`;

const RightBg = styled.div`
  width: 50%;
  height: 100%;
  padding-left: 5%;
  animation: ${rotate} 2s linear infinite;
  transition: animation 0.5s ease;
  z-index: 1;
  img {
    width: 80%;
    height: 80%;
    display: block;
    object-fit: cover;
  }
`;

const Container = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  h1 {
    font-size: 4em;
    margin-bottom: 20px;
  }
  h2 {
    font-size: 1.7em;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 20px;
    margin-top: 20px;
    font-weight: bold;
  }
`;

const Homewrap = styled.main`
  position: relative;
  overflow-y: hidden;
  padding-left: 5%;
  padding-right: 5%;
  flex: 1; /* Take up remaining space */
  display: flex;
  flex-direction: column;
`;

const CanvasContainer = styled.div`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  min-height: 100%;
  height: 100%;
`;
 // #gradient-canvas {
 //  height: 150%; /* Adjust the height of the canvas here */
 // }
const Main1 = styled.main`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 150px;
  justify-content: space-between;
`;

const SignInButton = styled.button`
  font-size: 1.2em;
  padding: 10px 20px;
  background-color: #B90E50;
  color: white;
  margin-top: 10%;
  border: none;
  width: calc(35% - 40px); /* 40px is the total padding (20px on each side) */
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #8c0a3b;
  }
`;

const Main2 = styled.main`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 200px;
  justify-content: space-between;
`;

const Main3 = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 50px;
  display: flex;
  flex-direction: row;
`;

const AdditionalText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 50px;
  }

  h3 {
    font-size: 2em;
    color: #B90E50;
    margin-top: 20%;
    margin-bottom: 20%;
  }

  p {
    font-size: 1.2em;
  }
`;

const AdditionalItem = styled.div`
  flex: 1;
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const ColorText = styled.span`
  color:  #B90E50;
  text-decoration: underline;
`;

const ColorText2 = styled.span`
  color:  #B90E50;
  font-size: 2em;
`;

const ListItem = styled.li`
  font-size: 1.5em;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default Overlay;
