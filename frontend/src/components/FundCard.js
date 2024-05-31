import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  color: white;
  position: relative;
  font-family: sans-serif;
  &::before,
  &::after {
    content: "";
    background-color: #fab5704c;
    position: absolute;
  }

  &::before {
    border-radius: 50%;
    width: 6rem;
    height: 6rem;
    top: 30%;
    right: 7%;
  }

  &::after {
    content: "";
    position: absolute;
    height: 3rem;
    top: 8%;
    right: 5%;
    border: 1px solid;
  }
`;

const Box = styled.div`
  width: 15em;
  height: 20em;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.074);
  border: 1px solid rgba(255, 255, 255, 0.222);
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  border-radius: 0.7rem;
  transition: all ease 0.5s;
  margin-right: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover {
    box-shadow: 0px 0px 20px 1px #ffbb763f;
    border: 2px solid rgba(255, 255, 255, 0.454);
  }
  img {
    height: 70%;
    width: 100%;
    padding-bottom: 20px;
  }
`;

const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 100px; /* Margin applied to the div covering all rows */
`;

const Content = styled.div`
  div {
    margin-bottom: 0.5rem;
    font-size: 0.9em;
    font-weight: 300;
    letter-spacing: 0.1em;
  
  }

  span {
    font-size: 0.7rem;
    font-weight: 300;
  }

  span:nth-child(3) {
    font-weight: 500;
    margin-right: 0.2rem;
  }
`;

const FundCard = ({
  _id,
  fundname,
  fundtype,
  fundManager,
  fundInceptionDate,
  fundExpenseRatio,
  fundAssets
}) => {
  return (
    <Main>
      <Link to={`/fund/${_id}`}>
        <Container>
          <Box>
            <img
              src="https://cdn-scripbox-wordpress.scripbox.com/wp-content/uploads/2020/10/bonds-vector.png"
              alt="Fund Details"
              className="w-full h-[158px] object-cover rounded-[15px] p-1"
            />
            <Content>
              <div>
                <strong>{fundname}</strong>
              </div>
              <div>Fund Type: {fundtype}</div>
              <div>Fund Manager: { fundManager}</div>
              <div>Maturity Date: {fundInceptionDate}</div>
              <div>Coupon Rate: { fundExpenseRatio}</div>
              <div>
                <strong>Fund Assets: { fundAssets}</strong>
              </div>
            </Content>
          </Box>
        </Container>
      </Link>
    </Main>
  );
};

export default FundCard;
