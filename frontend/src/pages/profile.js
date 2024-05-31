import React, { useLayoutEffect, useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios"; 
import { AllStocks } from "../components/MyStocks";
import { PieChart } from "@rsuite/charts";
import { Gradient } from "../../src/lib/gradient";
import { Loader } from "../components/Loader";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ProfileContent from "../components/ProfileContent";
import ProfileInfo  from "../components/ProfileInfo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChartBar, faListAlt, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { MyWish } from "../components/Wishlist";

import "./../styles.css";

export default function Profile() {
	return <ProfilePage />;
}

const tabs = [
	{ icon: faUser, label: 'Profile', content: <ProfileInfo/>},
	{ icon: faChartBar, label: 'Analysis', content: <ProfileContent /> },
	{ icon: faListAlt, label: 'Orders', content: <AllStocks /> },
	{ icon: faListAlt, label: 'Wish List', content: <MyWish /> },
	{ icon: faCog, label: 'Settings', content: <div>Settings</div> },
	{ icon: faSignOutAlt, label: 'Logout', onClick: handleLogout },
];

function handleLogout() {
	localStorage.clear();
	window.location = "/";
}

export function ProfilePage() {
	const [activeTab, setActiveTab] = useState(tabs[0]);
  {/*const [user, setUser] = useState(null);
	useEffect(() => {
		const fetchUser = async () => {
		  try {
			const response = await axios.get("/api/users/self"); 
			setUser(response.data); 
		  } catch (error) {
			console.error("Error fetching user data:", error);
		  }
		};
		fetchUser(); 
	  }, []);
	*/}

	useLayoutEffect(() => {
		const gradient = new Gradient();
		gradient.initGradient("#gradient-canvas");
	}, []);

	return (
		<Main>
			<GradientCanvas id="gradient-canvas" /> {/* Include the gradient canvas */}
			<Profil>
				<ProfileNav>
					{tabs.map((tab, index) => (
						<Tab key={index} onClick={() => tab.onClick ? tab.onClick() : setActiveTab(tab)}>
							<FontAwesomeIcon icon={tab.icon} style={{ marginRight: '10px' }} />
							{tab.label}
						</Tab>
					))}
				</ProfileNav>
			</Profil>
			<Content>
			  {activeTab.content}
			</Content>
		</Main>
	);
}

const Main = styled.main`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  @media only screen and (max-width: 1200px) {
    
  }
`;

const GradientCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  
`;

const Profil = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15%;
  max-height: 90%;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  
`;

const ProfileNav = styled.div`
  margin-top: 100px;
`;

const Tab = styled.div`
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 20px;
  width: 150px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const Content = styled.div`
	width: 85%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 40px;
	
`;

const Pic = styled.div`
	display: flex;
	justify-content: center;
	margin: 1em auto;
	width: 14em;
	height: 10em;
	margin-bottom: 20%;
	img {
		width: 80%;
		height: auto;
	}
`;
