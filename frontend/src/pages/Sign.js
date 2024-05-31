import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Gradient } from "../lib/gradient";
import config from "../config";
import "../styles.css";
import { Link } from "react-router-dom";
import {Logo} from "../components/Logo";
import { useNavigate } from "react-router-dom";


const userData = {
  name: "",
  email: "",
  address: "",
  password: "",
  Confirmpassword: "",
};

const signin = {
  emailID: "",
  passwordID: "",
};

function SVGTextAnimation() {
	return (
	  <AnimatedTextSVG viewBox="0 20 100 20">
		<defs>
		  <linearGradient id="gradient">
			<stop offset="0%" stop-color="#000" />
			{/*<stop offset="100%" stop-color="#fff" />*/}
		  </linearGradient>
		  <pattern id="wave" x="0" y="-0.5" width="100%" height="100%" patternUnits="userSpaceOnUse">
			<path id="wavePath" d="M-40 9 Q-30 7 -20 9 T0 9 T20 9 T40 9 T60 9 T80 9 T100 9 T120 9 V20 H-40z" mask="url(#mask)"fill="url(#gradient)">
			  <animateTransform
				attributeName="transform"
				begin="0s"
				dur="1.5s"
				type="translate"
				from="0,0"
				to="40,0"
				repeatCount="indefinite"
			  />
			</path>
		  </pattern>
		</defs>
	  <text textAnchor="middle" x="50" y="0" fontSize="20" fill="url(#wave)" fill-opacity="0.3">BONDZAPP</text>
    <text textAnchor="middle" x="50" y="15" fontSize="20" fill="url(#wave)" fill-opacity="0.3">BONDZAPP</text>
	  <text textAnchor="middle" x="50" y="30" fontSize="20" fill="url(#wave)" fill-opacity="0.3">BONDZAPP</text>
	  <text textAnchor="middle" x="50" y="45" fontSize="20" fill="url(#wave)" fill-opacity="0.3">BONDZAPP</text>
    <text textAnchor="middle" x="50" y="60" fontSize="20" fill="url(#wave)" fill-opacity="0.3">BONDZAPP</text>
  
	  

	  </AnimatedTextSVG>
	);
  }

function Overlay() {
  useLayoutEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);

  const [formData, setForm] = useState(userData);
  const [signinData, setSignin] = useState(signin);
  const navigate = useNavigate();
  const [sign, setSign] = useState(true);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, address, password, Confirmpassword } = formData;
    if (password === Confirmpassword && password !== "") {
      if (name && email && address && password && Confirmpassword) {
        axios.post(`${config.backendLocation}/auth/register`, { email, password, phone: address, username: name })
          .then(() => {
            navigate("/verify?username=" + name);
            setForm(userData);
          });
      }
    } else {
      alert("Passwords do not match");
    }
  };

  const handleSignin = (e) => {
    const { name, value } = e.target;
    setSignin(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const signIn = (e) => {
    e.preventDefault();
    const { emailID, passwordID } = signinData;
    if (emailID && passwordID) {
      axios.post(`${config.backendLocation}/auth/login`, { email: emailID, password: passwordID })
        .then((res) => {
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            window.location = "/";
          } else {
            alert("Invalid Credentials");
          }
        });
    }
  };

  return (
    <Main>
      <Container>
        <Left>
        <Link to="/"><Logo /></Link>
		<link href="https://fonts.googleapis.com/css?family=Cabin+Condensed&display=swap" rel="stylesheet"></link>	
		  <SVGTextAnimation />
      {/*    <BgImg>
            <img src="/assets/stocks.png" alt="stock" />
        </BgImg>*/}
        </Left>
        <Right>
          <h2>{sign ? "Sign In" : "Sign Up"}</h2>
          <Form>
            <form onSubmit={sign ? signIn : handleSubmit}>
              {!sign ? (
                <>
                  <InputContainer>
                    <StyledInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder=" "
                      value={formData.name}
                      onChange={handleForm}
                      required
                    />
                    <StyledLabel htmlFor="name">Enter Name</StyledLabel>
                  </InputContainer>
                  <InputContainer>
                    <StyledInput
                      type="text"
                      name="email"
                      id="email"
                      placeholder=" "
                      value={formData.email}
                      onChange={handleForm}
                      required
                    />
                    <StyledLabel htmlFor="email">Enter Email</StyledLabel>
                  </InputContainer>
                  <InputContainer>
                    <StyledInput
                      type="text"
                      name="address"
                      id="address"
                      placeholder=" "
                      value={formData.address}
                      onChange={handleForm}
                      required
                    />
                    <StyledLabel htmlFor="address">Enter Number</StyledLabel>
                  </InputContainer>
                  <InputContainer>
                    <StyledInput
                      type="password"
                      name="password"
                      id="password"
                      placeholder=" "
                      value={formData.password}
                      onChange={handleForm}
                      required
                    />
                    <StyledLabel htmlFor="password">Enter Password</StyledLabel>
                  </InputContainer>
                  <InputContainer>
                    <StyledInput
                      type="password"
                      name="Confirmpassword"
                      id="Confirmpassword"
                      placeholder=" "
                      value={formData.Confirmpassword}
                      onChange={handleForm}
                      required
                    />
                    <StyledLabel htmlFor="Confirmpassword">Confirm Password</StyledLabel>
                  </InputContainer>
                </>
              ) : (
                <>
                  <InputContainer>
                    <StyledInput
                      type="text"
                      name="emailID"
                      id="emailID"
                      placeholder=" "
                      value={signinData.emailID}
                      onChange={handleSignin}
                      required
                    />
                    <StyledLabel htmlFor="emailID">Enter Email</StyledLabel>
                  </InputContainer>
                  <InputContainer>
                    <StyledInput
                      type="password"
                      name="passwordID"
                      id="passwordID"
                      placeholder=" "
                      value={signinData.passwordID}
                      onChange={handleSignin}
                      required
                    />
                    <StyledLabel htmlFor="passwordID">Enter Password</StyledLabel>
                  </InputContainer>
                </>
              )}
              <button type="submit" >
              <span class="button_top">
               {sign ? "Sign In" : "Sign Up"} </span>
              </button>
            </form>           
            <p>
            {sign ? (
								<p>
									Don't have account? {"  "}
									<Btn onClick={() => setSign(!sign)}>
										{" "}
										Sign UP{" "}
									</Btn>{" "}
								</p>
							) : (
								<p>
									Already have account? {"  "}
									<Btn onClick={() => setSign(!sign)}>
										{" "}
										Sign In{" "}
									</Btn>{" "}
								</p>
							)}
						</p>
					</Form>
        </Right>
      </Container>
    </Main>
  );
}

const Sign = () => {
  return <Overlay />;
};

const Main = styled.main`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`;

const Container = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
  display: flex;
  width: 100%;
  height: 100%;
  //max-height: 900px; 
  max-width: 1100px;
  height: 600px;
  margin: 0 auto;
  margin-top: 80px;
`;
const AnimatedTextSVG = styled.svg`
  font-weight: bold;
  max-width: 600px;
  height: 100%;
  font-family: 'Cabin Condensed', sans-serif;
`;
const Left = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  padding: 20px;
`;

const Right = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  padding: 20px;
  font-family: 'Georgia', serif;

  h2 {
    text-align: center;
  }


`;

const Form = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  margin-top: 20px;
  p {
    text-align: center;
    margin: 10px 0;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 10px;
    button {
      --button_radius: 0.75em;
      --button_color: #B90E50;
      --button_outline_color: #000000;
      font-size: 17px;
      font-weight: bold;
      font-family: 'Georgia', serif;
      border: none;
      border-radius: var(--button_radius);
      background: var(--button_outline_color);
  
      .button_top {
        display: block;
        box-sizing: border-box;
        border: 2px solid var(--button_outline_color);
        border-radius: var(--button_radius);
        padding: 0.8em 1.7em;
        background: var(--button_color);
        color: var(--button_outline_color);
        transform: translateY(-0.2em);
        transition: transform 0.1s ease;
      }
  
      &:hover  .button_top {
        /* Pull the button upwards when hovered */
        transform: translateY(-0.35em);
      }
      &:active .button_top {
        /* Pull the button upwards when hovered */
        transform: translateY(0);
      }
    }
  }
`;

const BgImg = styled.div`
  width: 450px;
  height: 450px;
  margin: 0 auto;
  margin-top: 20px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: inline-block;
  }
`;

const Btn = styled.button`
	background-color: #fff;
	border: none;
	outline: none;
	padding: 0 3px;
	text-decoration: underline;
	background-color: transparent;
	color: #fff;
	font-size: 15px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  color: white;
  margin: 5px;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 45px;
  border: none;
  outline: none;
  padding: 0px 7px;
  border-radius: 6px;
  color: #fff;
  font-size: 15px;
  background-color: transparent;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 1),
              -1px -1px 6px rgba(255, 255, 255, 0.4);
  &:focus, &:valid {
    border: 2px solid transparent;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 1),
                -1px -1px 6px rgba(255, 255, 255, 0.4),
                inset 3px 3px 10px rgba(0, 0, 0, 1),
                inset -1px -1px 6px rgba(255, 255, 255, 0.4);
  }
`;

const StyledLabel = styled.label`
  font-size: 15px;
  padding-left: 10px;
  position: absolute;
  top: 13px;
  transition: 0.3s;
  pointer-events: none;

  ${StyledInput}:focus ~ &,
  ${StyledInput}:valid ~ & {
    padding-left: 2px;
    transform: translateY(-35px);
  }
`;
 

export default Sign;
