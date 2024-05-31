import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import config from "../config";

export const MyWish = () => {
  const [bonds, setBonds] = useState([]);

  useEffect(() => {
    fetchUserOwnedBonds();
  }, []);

  const fetchUserOwnedBonds = async () => {
    try {
      // Make API call to fetch bonds owned by the user
      const response = await axios.get(`${config.backendLocation}/bond`, {
        headers: { token: localStorage.token }, // Assuming you have a token for authentication
      });
      setBonds(response.data); // Set the fetched bonds to state
    } catch (error) {
      console.error('Error fetching user-owned bonds:', error);
    }
  };

  return (
    <Container>
      <h2>My Wishlist</h2>
      <BondList>
        {bonds.map((bond, index) => (
          <BondItem key={index}>
            <BondDetails>
              <h3>{bond.SYMBOL}</h3>
              <p>Series: {bond.SERIES}</p>
              <p>Bond Type: {bond.BONDTYPE}</p>
              <p>Coupon Rate: {bond.COUPONRATE}</p>
              {/* Add more bond details as needed */}
            </BondDetails>
            {/* Add additional actions for each bond, like trading, viewing details, etc. */}
          </BondItem>
        ))}
      </BondList>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const BondList = styled.ul`
  list-style: none;
  padding: 0;
`;

const BondItem = styled.li`
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
`;

const BondDetails = styled.div`
  h3 {
    margin-bottom: 5px;
  }
`;
