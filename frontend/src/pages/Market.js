import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ViewTrade from "../components/ViewTrade";
import axios from "axios";
import config from "../config";
import Navbar from "../components/Navbar";
import { Loader } from "../components/Loader";
import Footer from '../components/Footer';
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
	}
];

const Market = () => {
    const [bonds, setBonds] = useState([]);
    const [attemptData, setAttempts] = useState([]);
    const [modal, setModal] = useState("close");
    const [search, setSearch] = useState({ name: "" });
    const [balance, setBalance] = useState();
    const [selectedBond, setSelectedBond] = useState(null);
    const [ownedQuantities, setOwnedQuantities] = useState({});
    const [expandedRows, setExpandedRows] = useState([]);

    // useEffect to run at start
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const bondResponse = await axios.get(`${config.backendLocation}/bond`);
                setBonds(bondResponse.data);

                const balanceResponse = await axios.get(`${config.backendLocation}/user/self`, {
                    headers: { token: localStorage.token },
                });
                setBalance(balanceResponse.data.balance);

                // Fetch owned quantities for each bond
                bondResponse.data.forEach(async (bond) => {
                    const ownedResponse = await axios.get(`${config.backendLocation}/bond/my-count/${bond._id}`, {
                        headers: { token: localStorage.token },
                    });
                    setOwnedQuantities((prev) => ({
                        ...prev,
                        [bond._id]: ownedResponse.data.count,
                    }));
                });

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchInitialData();

        const intervalRef = setInterval(() => {
            axios
                .get(`${config.backendLocation}/bond`)
                .then((res) => {
                    setBonds(res.data);
                });
        }, 5000);

        return () => clearInterval(intervalRef);
    }, []);

   
//  const getData = () => {
//       const Quizdata = JSON.parse(localStorage.getItem("quiz"));
//       console.log(Quizdata, 'data')
//       setAttempts(Quizdata?.reverse());
//    };
//    useEffect(() => {
//       getData();
//    }, []);
//   console.log(attemptData, 'attempt-data')
    const handlerInput = (e) => {
        setSearch(e.target.value);
        const query = e.target.value;   
        if (query === "") {
            setAttempts(bonds); // Reset to all bond data
        } else {
            const filteredData = bonds.filter((item) => {
                return item.symbol.toLowerCase().includes(query.toLowerCase());
            });
            setAttempts(filteredData);
        }
    };
    let dataToMap = attemptData.length > 0 ? attemptData : bonds;
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

    const toggleRow = (index) => {
        setExpandedRows((prev) => 
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    return (
        <Container>
            <Content>
                { <Loader />}
                <Attempt>
                    <Header>
                        <div>
                            <h3>Bond Trading With Bondzapp</h3>
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
                  {/*<h1>Bond trading with BondZapp</h1>*/}
                    <Box>
                        <table>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>SYMBOL</th>
                                    <th>SERIES</th>
                                    <th>BOND TYPE</th>
                                    <th>COUPON RATE</th>
                                    <th>FACE VALUE</th>
                                    <th>LTP</th>
                                    <th>Volume</th>
                                    <th>CREDIT RATING</th>
                                    <th>MATURITY DATE</th>
                                    <th>Price</th>
                                    <th>Owned Quantity</th>
                                    <th>TRADE</th>
                                    <th>More</th>
                                </tr>
                            </thead>
                            <tbody>
                               {dataToMap.map((item, index) => {
                                  const isExpanded = expandedRows.includes(index);
                                  return (
                                     <React.Fragment key={index}>
                                        <tr className={isExpanded ? "expanded" : ""}>
                                               <td>{index + 1}</td>
                                               <td>{item.symbol}</td>
                                               <td>{item.series}</td>
                                               <td>{item.bondtype}</td>
                                               <td>{item.couponrate}</td>
                                               <td>{item.facevalue}</td>
                                               <td>{item.ltp}</td>
                                               <td>{item.volume}</td>
                                                <td>{item.creditRating}</td>
                                                <td>
                                                    {item.maturityDate ? new Date(item.maturityDate)
                                                        .toISOString()
                                                        .replace(/T.*/, "")
                                                        .split("-")
                                                        .reverse()
                                                        .join("-") : ""}
                                                </td>
                                                <td>${item.price}</td>
                                                <td>{ownedQuantities[item._id] || 0}</td>
                                                <td>
                                                    <Btns
                                                        onClick={() => {
                                                            setSelectedBond(item);
                                                            handlerModal();
                                                        }}
                                                    >
                                                        TRADE
                                                    </Btns>
                                                </td>
                                                <td>
                                                    <ExpandButton onClick={() => toggleRow(index)}>
                                                        {isExpanded ? "Collapse" : "Expand"}
                                                    </ExpandButton>
                                                </td>
                                            </tr>
                                            <Break />
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Box>
                </Main>
                <Break2 />
                <ViewTrade
                    modal={modal}
                    setModal={setModal}
                    bond={selectedBond}
                    balance={balance}
                />
                <Footer />
            </Content>
        </Container>
    );
};

const Break = styled.div`
    padding: 2px;
`;
const Break2 = styled.div`
    padding: 10px;
`;

const Container = styled.div`
    width: 100%;
    height: 100vh;
    position: relative;
    h1 {
        max-width: 1350px;
    }

`;

const Content = styled.div`
    width: 100%;
    height: 100vh;
    position: relative;
    
`;

const Attempt = styled.div`
    color: #fff;
    padding: 20px 20px;
    height: 100%;
    max-height: 200px;
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
    margin-top: 7%;
`;

const Main = styled.div`
    h1 {
        padding-left: 35px;
    }
`;

const Box = styled.div`
    position: relative;
    width: 95%;
    max-width: 1350px;
    margin: 0 auto;
    border-style: solid;
    border-color: black;
    border-width: 5px;
    border-radius: 20px;
    height: auto;
    max-height: 600px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        
        thead {
            background-color: #b90e50;
            position: sticky;
            top: 0;
        }
    }
    th, td {
        padding: 10px;
        color: rgba(0, 0, 0, 0.7);
        font-size: 13px;
        border-spacing: 0;
    }
    th {
        color: #fff;
        font-size: 15px;
        font-weight: 400;
    }
    td {
        background-color: #2C2C2C;
        margin: 20px;
        white-space: nowrap;
        overflow: hidden;
        color: #fff;
        text-overflow: ellipsis;
        max-width: 150px;
    }
    .expanded td {
        white-space: normal;
        overflow: visible;
    }
    tr {
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

const ExpandButton = styled.button`
    border: none;
    outline: none;
    background: #b90e50;
    color: #fff;
    padding: 5px 8px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
`;

export default Market;