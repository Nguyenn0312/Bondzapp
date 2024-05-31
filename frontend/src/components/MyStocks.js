import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ViewTrade from "./ViewTrade";
import config from "../config";
import axios from "axios";
const pusharray = [
	{
		SYMBOL: "NHAI",
		SERIES: "N6",
		BONDTYPE: "Regular",
		COUPONRATE: 8.75,
		FACEVALUE: "1,000.00",
		LTP: "1,242.00",
		OWNEDQUANTITY: "CRISIL AAA STABLE / CARE AAA / BWR AAA STABLE ",
		CREDITRATING: "05-Feb-2029",
		MATURITYDATE: "",
	},
	{
		SYMBOL: "NHAI",
		SERIES: "N2",
		BONDTYPE: "Regular",
		COUPONRATE: 8.3,
		FACEVALUE: "1,000.00",
		LTP: "1,136.00",
		OWNEDQUANTITY: "CRISIL AAA STABLE / CARE AAA / IND AAA STABLE ",
		CREDITRATING: "25-Jan-2027",
		MATURITYDATE: "",
	},
	{
		SYMBOL: "RECLTD",
		SERIES: "N9",
		BONDTYPE: "Regular",
		COUPONRATE: 8.71,
		FACEVALUE: "1,000.00",
		LTP: "1,167.50",
		OWNEDQUANTITY: "CRISIL AAA STABLE / CARE AAA / ICRA AAA / IND AAA",
		CREDITRATING: "24-Sep-2028",
		MATURITYDATE: "",
	},
	{
		SYMBOL: "NHBTF2014",
		SERIES: "N6",
		BONDTYPE: "Regular",
		COUPONRATE: 9.01,
		FACEVALUE: "5,000.00",
		LTP: "6,538.00",
		OWNEDQUANTITY: "CRISIL AAA STABLE / CARE AAA / ICRA AAA STABLE",
		CREDITRATING: "13-Jan-2034",
		MATURITYDATE: "",
	},
	{
		SYMBOL: "IIHFL",
		SERIES: "N5",
		BONDTYPE: "Regular",
		COUPONRATE: 9.6,
		FACEVALUE: "1,000.00",
		LTP: "999.00",
		OWNEDQUANTITY: "CRISIL AA Stable / BWR AA+  Negative",
		CREDITRATING: "03-Nov-2028",
		MATURITYDATE: "",
	},
	{
		SYMBOL: "IRFC",
		SERIES: "NI",
		BONDTYPE: "Regular",
		COUPONRATE: 7.32,
		FACEVALUE: "1,000.00",
		LTP: "1,069.99",
		OWNEDQUANTITY: "CRISIL AAA STABLE / CARE AAA / ICRA AAA",
		CREDITRATING: "21-Dec-2025",
		MATURITYDATE: "",
	},
	{
		SYMBOL: "IIFL",
		SERIES: "NF",
		BONDTYPE: "Regular",
		COUPONRATE: 9.6,
		FACEVALUE: "1,000.00",
		LTP: "1,001.00",
		OWNEDQUANTITY: "CRISIL AA Negative / BWR AA+ Negative",
		CREDITRATING: "24-Jun-2028",
		MATURITYDATE: "",
	},
	{
		SYMBOL: "TATACAPHSG",
		SERIES: "N8",
		BONDTYPE: "Regular",
		COUPONRATE: 8.1,
		FACEVALUE: "1,000.00",
		LTP: "1,054.99",
		OWNEDQUANTITY: "CRISIL AAA STABLE / ICRA AAA STABLE",
		CREDITRATING: "14-Jan-2028",
		MATURITYDATE: "",
	},
	{
		SYMBOL: "IIHFL",
		SERIES: "N4",
		BONDTYPE: "Regular",
		COUPONRATE: 10,
		FACEVALUE: "1,000.00",
		LTP: "1,008.40",
		OWNEDQUANTITY: "CRISIL AA Stable / BWR AA+  Negative",
		CREDITRATING: "03-Nov-2028",
		MATURITYDATE: "",
	},
	{
		SYMBOL: "NHAI",
		SERIES: "NE",
		BONDTYPE: "Regular",
		COUPONRATE: 7.69,
		FACEVALUE: "1,000.00",
		LTP: "1,166.00",
		OWNEDQUANTITY: "CRISIL AAA STABLE / CARE AAA / ICRA AAA / IND AAA",
		CREDITRATING: "09-Mar-2031",
		MATURITYDATE: "",
	},
];

export const AllStocks = () => {
	const [attemptData, setAttempts] = useState([]);
	const [modal, setModal] = useState("close");
	const [search, setSearch] = useState({
		name: "",
	});
	const [orders, setOrders] = useState([]);
	const getData = () => {
		const Quizdata = JSON.parse(localStorage.getItem("quiz"));
		// console.log(Quizdata, 'data')
		setAttempts(Quizdata?.reverse());
	};
	useEffect(() => {
		getData();

		axios
			.get(`${config.backendLocation}/order/mine`, {
				headers: { token: localStorage.token },
			})
			.then((res) => {
				let ordersBeforeReversing = res.data;
				setOrders(ordersBeforeReversing.reverse());
				// console.log(ordersBeforeReversing.reverse());
			});
	}, []);
	// console.log(attemptData, 'attempt-data')

	const handlerInput = (e) => {
		setSearch(e.target.value);
		const quiz = e.target.value;
		if (quiz === "") {
			getData();
		} else {
			const filterData = pusharray.filter((item) => {
				return item.SYMBOL.toLowerCase().includes(quiz.toLowerCase());
			});
			setAttempts(filterData);
		}
	};

	const handlerModal = (e) => {
		switch (modal) {
			case "close":
				setModal("open");
				break;
			case "open":
				setModal("close");
				break;
			default:
				setModal("close");
		}
	};

	return (
		<Container>
			<Attempt>
				<Header>
					<div>
						<h2>Bond Trading Data</h2>
						<p>Below is the list of Bond Trading Data.</p>
					</div>

					<Inputs>
						<label htmlFor="name">Sort By</label>
						<input
							type="text"
							placeholder="Enter symbol name..."
							id="name"
							name="name"
							value={search.name}
							onChange={handlerInput}
						/>
					</Inputs>
				</Header>
			</Attempt>

			<Main>
				<Box>
					<table>
						<thead>
							<tr>
								<th>Sr. No.</th>
								<th>Bond_id</th>
								<th>SYMBOL</th>
								<th>TYPE</th>
								<th>Quantity</th>
								<th>PRICE</th>
								<th>Total Price</th>
								<th>STATUS</th>
							</tr>
						</thead>
						<tbody>
							{orders?.map((item, index) => {
								return (
									<>
										<tr key={index}>
											<td>{index + 1}</td>
											<td>{item._id}</td>
											<td>{item.bond.symbol}</td>
											<td>{item.type}</td>
											<td>{item.quantity}</td>
											<td>
												{item.price
													? item.price
													: item.bond.price[
															item.bond.price
																.length - 1
													  ]}
											</td>
											<td>{item.total_price}</td>
											<td>
												{item.completed
													? "completed"
													: "pending"}
											</td>
											{/* <td>{item.FACEVALUE}</td>
											<td>{item.LTP}</td>
											<td>{item.OWNEDQUANTITY}</td>
											<td>{item.CREDITRATING}</td>
											<td>{item.MATURITYDATE}</td> */}

											{/* <td>
                            <Btns onClick={handlerModal}>
                            TRADE
                            </Btns>

                            </td> */}
										</tr>
										<Break />
									</>
								);
							})}
						</tbody>
					</table>
				</Box>
			</Main>

			<ViewTrade modal={modal} setModal={setModal} />
		</Container>
	);
};

const Break = styled.div`
	padding: 6px;
`;

const Container = styled.div`
	/* background-color: red; */
	width: 100%;
	height: 100vh;
	position: relative;
	/* background: #E6E2E2; */
`;

const Attempt = styled.div`
	color: #fff;
	padding: 20px 20px;
	/* background: #B90E50; */
	height: 100%;
	max-height: 250px;
	h2 {
		font-size: 40px;
	}
	p {
		font-size: 20px;
		line-height: 1.8;
	}
`;

const Inputs = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	input {
		padding: 10px;
		outline: none;
		border: 1px solid #cccccc;
		background-color: transparent;
		border: 1px solid #fff;
		border-radius: 5px;
		color: #fff;
		&::placeholder {
			color: #fff;
		}
	}
	label {
		position: absolute;
		background-color: #b90e50;
		top: -10px;
		left: 10px;
		font-size: 12px;
		padding: 3px 5px;
	}
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	max-width: 1350px;
	margin: 0 auto;
	/* background-color: red; */
	margin-top: 50px;
`;

const Main = styled.div`
	margin-top: -65px;
`;

const BtnO = styled.button`
	background: #bbffba;
	border-radius: 999px;
	padding: 5px 10px;
	border: none;
	outline: none;
	color: #219653;
`;

const BtnT = styled(BtnO)`
	background: #fcc8c8;
	color: #f44336;
`;

const Box = styled.div`
	position: relative;
	width: 100%;
	max-width: 1350px;
	margin: 0 auto;
	/* margin-top: -50px; */
	height: 750px;
	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		/* font-size: 16px; */
		text-align: center;
		thead {
			background-color: #b90e50;
			position: sticky;
			top: 0;
		}
	}
	th,
	td {
		padding: 10px;
		color: rgba(0, 0, 0, 0.7);
	}
	th {
		color: #fff;
		font-size: 15px;
		font-weight: 400;
	}
	td {
		background-color: #fff;
		margin: 20px;
	}
	tr {
		/* position: relative; */
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		padding: 10px;
		margin: 20px;

		&:first-child {
			box-shadow: none;
		}
	}
`;

const Btns = styled.button`
	border: none;
	outline: none;
	background: #5c36bb;
	color: #fff;
	padding: 5px 8px;
	border-radius: 5px;
	cursor: pointer;
	font-size: 13px;
`;
