import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ViewBond = ({ bond }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (bond) {
      console.log('bond in ViewBond:', bond);
    }
  }, [bond]);

  return (
    <Wrapper>
      <Card
        className="card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardTitle className="card__title">
          <TitleRow>
            <TitleLabel_symbol>{bond?.symbol}</TitleLabel_symbol>
            <TitleValue></TitleValue>
          </TitleRow>
          <TitleRow>
            <TitleLabel>Maturity Date:</TitleLabel>
            <TitleValue>{bond?.maturityDate}</TitleValue>
          </TitleRow>
          <TitleRow>
            <TitleLabel>Bond Type:</TitleLabel>
            <TitleValue>{bond?.bondtype}</TitleValue>
          </TitleRow>
          <TitleRow>
            <TitleLabel>Coupon Rate:</TitleLabel>
            <TitleValue>{bond?.couponrate}%</TitleValue>
          </TitleRow>
          <TitleRow>
            <TitleLabel>Face Value:</TitleLabel>
            <TitleValue>{bond?.facevalue}</TitleValue>
          </TitleRow>
          <TitleRow>
            <TitleLabel>Last Trade Price:</TitleLabel>
            <TitleValue>{bond?.ltp}</TitleValue>
          </TitleRow>
          <TitleRow>
            <TitleLabel>Price:</TitleLabel>
            <TitleValue>{bond?.price}</TitleValue>
          </TitleRow>
        </CardTitle>
        <CardContent className="card__content">
          {isHovered ? (
            <CardDescription className="card__description">
              <TitleText>{bond?.symbol}</TitleText>
              <p>
                Note: Bonds are investment products with risk and returns that
                are not guaranteed, suitable for customers with a certain risk
                appetite. This is not a savings deposit product at a bank. You
                need to carefully refer to the documents and bond information
                above before deciding to invest.
              </p>
              <br />
              {bond?.desc}
            </CardDescription>
          ) : (
            <>
              Bond Type: {bond?.bondtype}
              <br />
              Coupon Rate: {bond?.couponrate}%
              <br />
              Face Value: {bond?.facevalue}
              <br />
              LTP: {bond?.ltp}
              <br />
              Maturity Date: {bond?.maturityDate}
            </>
          )}
        </CardContent>
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

const Card = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    #b90e50,
    #032e46,
    #151525,
    #0f3b5e
  );
  border-radius: 10px;
  display: flex;
  margin-right: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  box-shadow: 0 0 0 5px #ffffff80;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);

    .card__content {
      transform: rotateX(0deg);
    }
    background: linear-gradient(
      135deg,
      #b90e50,
      #032e46,
      #151525,
      #0f3b5e
    );
  }
`;

const CardContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  transform: rotateX(-90deg);
  transform-origin: bottom;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    135deg,
    #b90e50,
    #032e46,
    #151525,
    #0f3b5e
  );
`;

const CardTitle = styled.div`
  margin: 0;
  font-size: 20px;
  color: #ffffff;
  font-weight: 700;
  font-family: 'Garamond', serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;
const TitleLabel_symbol = styled.span`
  font-size: 5vh;
  font-weight: bold;
  padding-right: 20%;
  font-family: "Georgia, serif";
`;
const TitleLabel = styled.span`
  font-weight: bold;
  padding-right: 20%;
  font-family: "Georgia, serif";
`;

const TitleValue = styled.span`
  flex-grow: 1;
  text-align: right;
  font-family: "Georgia, serif";
`;

const CardDescription = styled.div`
  margin: 10px 0 0;
  font-size: 14px;
  color: #ffffff;
  line-height: 1.4;
  font-size: 11px;
  text-decoration-color: #e2dfd2;
`;

const TitleText = styled.h3`
  font-size: 16px;
  font-family: 'Georgia', serif;
  margin: 0 0 10px;
`;

export default ViewBond;