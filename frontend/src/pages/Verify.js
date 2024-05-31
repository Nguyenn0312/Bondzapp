import React, { useState, useLayoutEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Gradient } from "../lib/gradient";
import "../styles.css";
import config from "../config";

const userData = {
    name: "",
    panNumber: "",
    panImg: null,
};

const Overlay = () => {
    useLayoutEffect(() => {
        const gradient = new Gradient();
        gradient.initGradient("#gradient-canvas");
    }, []);

    const [formData, setForm] = useState(userData);
    const navigate = useNavigate();

    const handlerForm = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlerImg = (e) => {
        setForm(prev => ({...prev, panImg: e.target.files[0]}));
    };

    const handlerSubmit = async (e) => {
    e.preventDefault();
    const username = window.location.href.split("?username=")[1];
    const { name, panNumber, panImg } = formData;

    let formDataToSend = new FormData();
    formDataToSend.append('username', username);
    formDataToSend.append('name', name);
    formDataToSend.append('pan', panNumber);
    formDataToSend.append('file', panImg);

    try {
        const response = await axios.post(`${config.backendLocation}/auth/verify`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response);
		console.log(formDataToSend);
        if (response.status === 200) {
            navigate('/sign');
        }
    } catch (error) {
        console.error("Error during upload: ", error);
        alert("Failed to verify KYC details");
    }
};

    return (
        <Main>
            <canvas id="gradient-canvas" data-transition-in />
            <Container>
                <Left>
                    <BgImg>
                        <img src="/assets/stocks.png" alt="stock" />
                    </BgImg>
                </Left>
                <Right>
                    <h2>PAN CARD DETAILS</h2>
                    <Form onSubmit={handlerSubmit}>
                        <div>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter name..."
                                value={formData.name}
                                onChange={handlerForm}
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="panNumber">Pan Number</label>
                            <input
                                type="text"
                                name="panNumber"
                                id="panNumber"
                                placeholder="Enter pan number..."
                                value={formData.panNumber}
                                onChange={handlerForm}
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="panImg">Upload Your Identity Card</label>
                            <input
                                type="file"
                                name="panImg"
                                id="panImg"
                                onChange={handlerImg}
                                required
                            />
                        </div>
                        {formData.panImg && (
                            <BackG>
                                <img
                                    src={URL.createObjectURL(formData.panImg)}
                                    alt="Pan Image Preview"
                                />
                            </BackG>
                        )}
                        <button type="submit" onClick={handlerSubmit}>
								SUBMIT
							</button>

                    </Form>
                </Right>
            </Container>
        </Main>
    );
};

const Verify = () => {
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
	max-width: 1128px;
	height: 600px;
	margin: 0 auto;
	margin-top: 80px;
	flex-direction: row-reverse;
`;

const Left = styled.div`
	position: relative;
	width: 50%;
	height: 100%;
	padding: 20px;

	h1 {
		text-align: center;
		font-size: 40px;
	}
`;
const Right = styled.div`
	position: relative;
	width: 50%;
	height: 100%;
	padding: 20px;

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
			padding: 15px 0;
			color: #fff;
			border: none;
			outline: none;
			border-radius: 5px;
			background: rgb(25, 118, 210);
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
			transition: all 0.3s ease-in;
			background: rgb(25, 118, 210);
			&:hover {
				background-color: #045eb8;
			}
		}
	}

	div {
		/* padding: 5px 0; */
		margin-bottom: 2px;
		position: relative;
	}

	input {
		padding: 12px;
		outline: none;
		border: none;
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: 3px;
		width: 100%;
		background: transparent;
		border: 1px solid #fff;
		border-radius: 5px;
		color: #fff;

		&::placeholder {
			color: #fff;
			background-color: transparent;
		}
	}

	label {
		color: rgba(0, 0, 0, 0.5);
		color: #fffbf5;
		font-size: 13px;
		margin-bottom: 3px;
		
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

const BackG = styled.div`
	width: 200px;
	height: 150px;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: inline-block;
	}
`;

export default Verify;