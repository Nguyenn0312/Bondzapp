import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import axios from "axios";
import config from "../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import Plot from "react-plotly.js";
import Mastercard from '../components/Mastercard';
import WalletBalanceCard from '../components/WalletBalanceCard';

function ProfileInfo() {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    fetchUser();
  }, []);

const fetchUser = async () => {
    try {
        const response = await axios.get(`${config.backendLocation}/user/self`, {
            headers: { token: localStorage.token },
        });
        const userProfilePic = response.data.profilePic ? `${config.backendLocation}/${response.data.profilePic}` : './profile.png';
       
        setUserData({ ...response.data, profilePic: userProfilePic });
    } catch (error) {
        console.error("Error fetching user data:", error.response ? error.response.data : error);
        setUserData({ ...userData, profilePic: './profile.png' });
    }
    
};

const handleAvatarUpload = async (event) => {
  try {
      const file = event.target.files[0];
      console.log("Uploading file:", file.name);
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${config.backendLocation}/user/upload-avatar`, formData, {
          headers: {
              token: localStorage.token,
              'Content-Type': 'multipart/form-data'
          },
      });
      const newProfilePic = response.data.profilePic ? `${config.backendLocation}/${response.data.profilePic}` : './profile.png';
      setUserData(prevUserData => ({ ...prevUserData, profilePic: newProfilePic }));
  } catch (error) {
      console.error("Failed to upload avatar:", error.response ? error.response.data : error);
  }
};
  return (
    <Container>
      {userData && (
        <>
          <UserInfo>
          <Pic>
              <img className="profilePic" src={userData.profilePic || './profile.png'} alt="Profile" />
              <CameraIcon icon={faCamera} />
              <input type="file" onChange={handleAvatarUpload} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%' }} />
         </Pic>
            <h2> Welcome </h2>
            <UserInfoItem>
              <strong>Username:</strong> {userData.username}
            </UserInfoItem>
            <UserInfoItem>
              <strong>Email:</strong> {userData.email}
            </UserInfoItem>
            <UserInfoItem>
              <strong>Role:</strong> {userData.role}
            </UserInfoItem>
            <UserInfoItem>
              <strong>Phone:</strong> {userData.phone}
            </UserInfoItem>
            <UserInfoItem>
              <strong>PAN:</strong> {userData.pan}
            </UserInfoItem>
            </UserInfo>
            <RightSection>
            <BalanceContainer>
            <Accountbalance>
            <BalanceSection>
            <WalletBalanceCard balance={userData.balance} />  
            </BalanceSection>
            <BalanceSection>
            <p>Your current deposit method</p>
            <Mastercard />
            </BalanceSection>
            </Accountbalance>
            <BalanceSectionPie>
            <PieChart balance={userData.balance} />
            </BalanceSectionPie>
            </BalanceContainer>
            <SecuritySection>
              <h2>Security Settings</h2>
              {userData.panImg && (
                <ImageContainer>
               <Image src={`${config.backendLocation}/${userData.panImg}`} alt="PAN Card" />
               </ImageContainer>
              )}
            </SecuritySection>
          </RightSection>
        </>
      )}
    </Container>
  );
}

const PieChart = ({ balance }) => {
  const data = [
    {
      values: [balance, balance*47/100 , balance*22/100, 0.0],
      labels: ["Balance", "Bond", "Fund", "In Debt"],
      type: "pie",
      hole: .6,
      hoverinfo: 'label+percent+name',
      textposition: 'inside',
      domain: { x: [4, 9], y: [4, 9] },
      marker: {
        colors: [ '#b90e50','#871885', '#435D8A', '#BA1A0F'], // Colors for the pie slices
        line: {
          color: '#000000',
          width: 1
        }
      },
    },
  ];

  const layout = {
    annotations: [
      {
        font: {
          size: 16,
          color: 'rgba(255,255,255,255)'
        },
        showarrow: false,
        text: 'Total Assets',
        x: 0.5,
        y: 0.5
      }
    ],
    margin: {
      t: 10,
      b: 10,
      l: 10,
      r: 10,
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    height: 250,
    width: 350,
    showlegend: true,
    legend: {
      font: {
        size: 15,
        color: 'white',
      },
      x: 1, y: 0.5
    }
  };

  return <Plot data={data} layout={layout} />;
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  margin-top: 2.5em;
  font-family: "Georgia, serif";
`;
const Pic = styled.div`
  display: flex;
  justify-content: center;
  margin: 1em auto;
  width: 14em;
  height: 14em;
  margin-bottom: 10%;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
  }
`;
const UserInfo = styled.div`
  width: 30%;
  height: 98%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  margin: 10px;
  text-align: center;
  h2{
    font-size: 20px;
    padding-bottom: 15px;
    font-family: "Georgia, serif";
    justify-content: center;
  }
`;

const UserInfoItem = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  display: flex;
  font-family: 'Trebuchet MS', sans-serif;
  justify-content: space-between;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin-right: 15px;
  margin-top:10px
`;

const BalanceContainer = styled.div`
  height: 30%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const BalanceSection = styled.div`
  height: 30%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  justify-content: space-between;
  #pieChart {
    width: 100%;
    height: 100%;
  }
`;
const BalanceSectionPie = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  padding: 10px;
  margin-left: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding-bottom: 25px; 
`;
const Accountbalance = styled.div`
  height: 30%;
  width: 45%;
  display: flex;
  justify-content: start;
  flex-direction: column;
  p{
    font-size: 15px;
    padding: 5px;
   }
}
`;

const SecuritySection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 250px;
  width: 100%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 10px;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Image = styled.img`
  max-height: 250px;
  max-width: calc((100% - 100px) / 2);
`;


const CameraIcon = styled(FontAwesomeIcon)`
  width: 12%;
  height: 12%;
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: transparent;
  border-radius: 50%;
  padding-right: 15%;
  cursor: pointer;
`;

const Balance = styled.div`
  font-size: 24px;
`;

export default ProfileInfo;
